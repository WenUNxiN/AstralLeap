---
title: Framebuffer 基本原理与显示编程
description: 理解 LCD 显存、屏幕参数、RGB565 和 mmap 像素绘制
date: 2026-10-20
tags:
  - Linux
  - Framebuffer
  - LCD
  - RGB565
status: learning
difficulty: beginner
---

# Framebuffer 基本原理与显示编程

## 想弄清的问题

Linux 应用程序怎样通过 `/dev/fb0` 获取屏幕参数，并在 LCD 上画出指定颜色？

## 关键概念

### 1. Framebuffer 是什么？

Framebuffer（帧缓冲）可以理解为保存屏幕像素数据的一块内存。应用程序向其中写入颜色，显示控制器按配置读取这些数据，最终显示在 LCD 上。

```text
应用程序 → /dev/fb0 → Framebuffer（显存）→ 显示控制器 → LCD
```

本课是**使用已有的 fbdev 显示接口**，不是编写 LCD 内核驱动。部分新平台主要使用 DRM/KMS，不一定提供 `/dev/fb0`。

### 2. 操作流程

```text
open() → ioctl() → mmap() → 写入像素 → munmap() → close()
```

| 接口 | 用途 |
| --- | --- |
| `open()` | 打开 `/dev/fb0` |
| `ioctl()` | 获取屏幕分辨率、像素格式及显存布局 |
| `mmap()` | 把显存映射到用户空间，便于直接访问 |
| `munmap()` / `close()` | 解除映射、关闭设备 |

### 3. 两类屏幕参数

```c
struct fb_var_screeninfo var; // 可变参数
struct fb_fix_screeninfo fix; // 固定参数

ioctl(fd, FBIOGET_VSCREENINFO, &var);
ioctl(fd, FBIOGET_FSCREENINFO, &fix);
```

| 字段 | 含义 |
| --- | --- |
| `var.xres / yres` | 实际可见的宽度、高度 |
| `var.xres_virtual / yres_virtual` | 显存画布的宽度、高度 |
| `var.xoffset / yoffset` | 当前画面在虚拟画布中的偏移 |
| `var.bits_per_pixel` | 每个像素的位数（bpp） |
| `var.red / green / blue` | RGB 分量所在的位位置、位数 |
| `fix.line_length` | 显存每行实际字节数，可能有对齐填充 |
| `fix.smem_len` | 显存区域大小 |

例如实际分辨率 `1024×600`，虚拟分辨率 `1024×1200`，显存可以容纳上下两张画面；但能否通过 `yoffset` 和 `FBIOPAN_DISPLAY` 切换画面，**取决于驱动支持情况**。

### 4. RGB565 与像素地址

RGB565：红色 5 位、绿色 6 位、蓝色 5 位，共 16 位（2 字节）。

| 颜色 | RGB565 值 |
| --- | --- |
| 红 | `0xF800` |
| 绿 | `0x07E0` |
| 蓝 | `0x001F` |
| 白 | `0xFFFF` |

**16 bpp 不一定就是 RGB565**，还要核对 `var.red/green/blue` 的 `offset` 和 `length`。

在常见的线性 16 bpp 显存中，像素 `(x, y)` 的字节偏移是：

```text
偏移 = (y + yoffset) × line_length + (x + xoffset) × 2
```

注意：不能用 `xres × 2` 代替 `line_length`，因为显存每行可能存在对齐填充。24/32 bpp 则应按实际每像素字节数计算。

## 自己的理解

`ioctl()` 告诉程序显存“怎样排列”，`mmap()` 让程序“可以访问显存”。画点、画线、画矩形其实都是**计算像素地址并写入颜色**。

## 用法与最小示例

先检查设备是否存在：

```bash
ls -l /dev/fb*
cat /sys/class/graphics/fb0/virtual_size
cat /sys/class/graphics/fb0/bits_per_pixel
```

下面是**RGB565、线性显存、小端序平台**的最小画点示例；先判断格式，避免误写其他像素布局：

```c
#include <fcntl.h>
#include <linux/fb.h>
#include <stdint.h>
#include <stdio.h>
#include <sys/ioctl.h>
#include <sys/mman.h>
#include <unistd.h>

int main(void)
{
    int fd = open("/dev/fb0", O_RDWR);
    if (fd < 0) { perror("open"); return 1; }

    struct fb_var_screeninfo var = {0};
    struct fb_fix_screeninfo fix = {0};
    if (ioctl(fd, FBIOGET_VSCREENINFO, &var) < 0 ||
        ioctl(fd, FBIOGET_FSCREENINFO, &fix) < 0) {
        perror("ioctl"); close(fd); return 1;
    }

    printf("%ux%u, %u bpp, line_length=%u\n",
           var.xres, var.yres, var.bits_per_pixel, fix.line_length);

    if (var.bits_per_pixel != 16 ||
        var.red.offset != 11 || var.red.length != 5 ||
        var.green.offset != 5 || var.green.length != 6 ||
        var.blue.offset != 0 || var.blue.length != 5 ||
        fix.type != FB_TYPE_PACKED_PIXELS ||
        fix.visual != FB_VISUAL_TRUECOLOR ||
        var.xres == 0 || var.yres == 0 || fix.smem_len == 0) {
        fprintf(stderr, "不支持的显存格式或屏幕参数\n");
        close(fd); return 1;
    }

    uint8_t *fb = mmap(NULL, fix.smem_len,
                       PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    if (fb == MAP_FAILED) { perror("mmap"); close(fd); return 1; }

    /* 在可见画面左上角写入一个红色像素 */
    size_t pos = (size_t)var.yoffset * fix.line_length +
                 (size_t)var.xoffset * 2;
    if (pos < fix.smem_len && fix.smem_len - pos >= 2) {
        fb[pos] = 0x00;     // RGB565 红色 0xF800（小端低字节）
        fb[pos + 1] = 0xF8; // 高字节
    }

    munmap(fb, fix.smem_len);
    close(fd);
    return 0;
}
```

将代码保存为 `fb_pixel.c`。在有 Linux fbdev 头文件的环境中编译（目标板需使用对应交叉工具链）：

```bash
gcc -Wall -Wextra -O2 fb_pixel.c -o fb_pixel
```

**实验状态：尚未在目标开发板验证。** 运行前先确认目标 LCD 已点亮、`/dev/fb0` 可用；示例只改变一个像素，不会画满屏幕。

## 待弄清的问题

- [ ] 在实际开发板记录分辨率、`bpp`、`line_length` 与 RGB 位域。
- [ ] 在屏幕四角画点，检查像素坐标和偏移是否正确。
- [ ] 在画点基础上实现填充矩形，并验证虚拟分辨率能否切换缓冲区。

## 参考与关联

- [点亮 SPI 屏幕](../experiments/01-泰山派RK3566点亮spi屏幕.md)。
- Linux 接口：`<linux/fb.h>`、`open()`、`ioctl()`、`mmap()`。
- 后续：[BMP 图片的 LCD 显示](./02-BMP图片的LCD显示.md)。
