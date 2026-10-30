---
title: 第16课：BMP 图片的 LCD 显示
description: 解析 BMP 像素数据，处理行对齐和图片方向，再写入 Framebuffer
date: 2026-10-21
tags:
  - Linux
  - Framebuffer
  - BMP
  - LCD
status: learning
difficulty: beginner
---

# 第16课：BMP 图片的 LCD 显示

## 想弄清的问题

BMP 文件里的像素数据怎样转换成 LCD 能显示的格式？为什么图片可能上下颠倒、错行或红蓝颜色互换？

## 关键概念

### 1. BMP 文件由什么组成？

```text
文件头 → 位图信息头 → 可选调色板 → 像素数据
```

- **文件头**：包含文件类型、文件大小和像素数据起始位置 `bfOffBits`。
- **位图信息头**：记录宽度、高度、位深和压缩方式等。
- **调色板**：索引色 BMP 可能使用，保存颜色索引与实际颜色的对应关系。
- **像素数据**：真正的图像内容。

常见 BMP 文件头为 14 字节，信息头常见为 40 字节，但不同 BMP 版本可能不同。不要固定假设像素数据总是从第 54 字节开始，应读取 `bfOffBits`。BMP 多字节数值通常采用小端序。

### 2. 两个常见问题

**每行 4 字节对齐**

24 位未压缩 BMP 的一个像素通常占 3 字节，且像素数据每行会补齐到 4 字节的倍数：

```c
row_bytes = (width * 3 + 3) & ~3;
```

例如一行有 3 个像素，像素本身占 9 字节，文件中该行会占 12 字节。BMP 的 `row_bytes` 与 LCD 的 `fix.line_length` 是两回事，不能混用。

**图片上下方向**

- `height > 0`：通常自下向上存储，先读到的是图片最下面一行。
- `height < 0`：自上向下存储，先读到的是图片最上面一行。

处理时要根据高度正负，将文件行映射到正确的屏幕行。

### 3. 颜色格式转换

常见 24 位 BMP 像素顺序是 **B、G、R**，而 LCD 可能使用 RGB565。若目标 Framebuffer 已确认是 RGB565，可以将 8 位颜色通道压缩为 5/6/5 位：

```c
uint8_t b = pixel[0];
uint8_t g = pixel[1];
uint8_t r = pixel[2];

uint16_t rgb565 = ((uint16_t)(r >> 3) << 11)
                | ((uint16_t)(g >> 2) << 5)
                | (uint16_t)(b >> 3);
```

16 位 BMP 不一定是 RGB565，24 位 BMP 也不一定都是未压缩格式；读取前要检查位深和压缩方式。

## 自己的理解

BMP 是磁盘上的图片文件，Framebuffer 是显示系统使用的像素缓冲区。两者的格式可能不同，因此显示图片通常需要先解析文件头，再按行读取像素、处理方向与对齐，必要时转换颜色，最后写入显存。

## 用法与最小示例

```text
打开 BMP 和 /dev/fb0
        ↓
查询 Framebuffer 参数并映射显存
        ↓
解析 BMP 头，读取宽、高、位深、压缩方式和 bfOffBits
        ↓
逐行读取像素，处理行对齐和上下方向
        ↓
按屏幕格式转换颜色
        ↓
根据 line_length 计算显存地址并写入
        ↓
释放映射并关闭文件
```

写入屏幕时，若目标为 RGB565：

```c
size_t offset = (size_t)(screen_y + var.yoffset) * fix.line_length
              + (size_t)(screen_x + var.xoffset) * 2;
/* 检查 offset 未越过 fix.smem_len 后，再写入 rgb565。 */
```

当前课程示例的适用范围是 **24 位、未压缩 BMP → RGB565 Framebuffer**。PNG、JPEG、索引色 BMP、压缩 BMP 或其他屏幕像素格式需要额外处理。图片大于屏幕时也要进行边界裁剪。

## 待弄清的问题

- [ ] 准备一张 24 位、未压缩 BMP，确认程序能正确读取。
- [ ] 分别测试正高度和负高度图片，观察上下方向。
- [ ] 若图片错行，检查 BMP 行对齐；若颜色不对，检查 BGR 顺序和屏幕 RGB 位域。
- [ ] 在目标开发板上验证实际显示结果；目前不能仅凭代码编译成功就认定显示正常。

## 参考与关联

- 课程：i.MX6ULL 嵌入式 Linux 开发，BMP 图片 LCD 显示部分。
- 前置知识：[Framebuffer 基本原理与显示编程](./01-Framebuffer原理与显示编程.md) 中的 `mmap()`、`line_length` 和像素格式。
- 关联主题：RGB565、BMP 文件格式、C 文件 I/O。
