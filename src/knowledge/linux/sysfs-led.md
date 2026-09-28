---
title: sysfs LED 控制
description: 通过 sysfs 控制 Linux LED 的亮灭、闪烁和心跳模式
date: 2026-09-26
category:
  - Linux
tags:
  - Linux
  - sysfs
  - LED
  - GPIO
platform:
  - 通用
status: done
difficulty: beginner
---
# sysfs LED 控制

## 概述

Linux 提供了 **LED 子系统（LED Subsystem）**，驱动可以将 LED 注册到 sysfs：

```text
/sys/class/leds/<led-name>/
```

用户空间通过读写这些文件控制 LED，而不是直接操作 GPIO 寄存器。

整体关系：

```text
用户程序
   ↓
sysfs
   ↓
LED 子系统
   ↓
LED 驱动
   ↓
GPIO / PWM
   ↓
LED
```

> sysfs 中的文件是内核提供的虚拟接口，不是普通磁盘文件。

---

## 查看 LED

```bash
ls /sys/class/leds/
```

例如：

```text
sys-led
```

进入目录：

```bash
cd /sys/class/leds/sys-led/
ls
```

常见文件：

| 文件               | 作用                  |
| ------------------ | --------------------- |
| `brightness`     | 设置或读取 LED 亮度   |
| `max_brightness` | 最大亮度值            |
| `trigger`        | 设置 LED 自动触发模式 |
| `delay_on`       | timer 模式亮灯时间    |
| `delay_off`      | timer 模式灭灯时间    |

---

## brightness

查看当前亮度：

```bash
cat brightness
```

普通 GPIO LED 一般：

```text
0 → 熄灭
1 → 点亮
```

控制 LED：

```bash
echo 1 > brightness
echo 0 > brightness
```

查看最大亮度：

```bash
cat max_brightness
```

GPIO LED 常见：

```text
1
```

支持多级亮度的 LED 可能为：

```text
255
```

此时可以：

```bash
echo 128 > brightness
```

### brightness 不是 GPIO 电平

`brightness` 表示的是 **LED 的逻辑亮度**，不是 GPIO 的物理电平。

从 LED 子系统的用户空间语义来看：

```text
brightness = 0
    ↓
LED_OFF
    ↓
LED 熄灭
```

非零值表示非零亮度：

```text
brightness = 1 ~ max_brightness
    ↓
LED 具有对应亮度
```

对于普通 GPIO LED：

```text
max_brightness = 1

0 → 熄灭
1 → 点亮
```

对于支持多级亮度的 LED：

```text
max_brightness = 255

0       → 熄灭
1~254   → 不同亮度
255     → 最大亮度
```

即使 LED 硬件是低电平点亮：

```text
GPIO = 0 → LED 亮
GPIO = 1 → LED 灭
```

用户空间仍然使用 LED 的逻辑亮度进行控制。

例如设备树中：

```dts
gpios = <&gpio1 3 GPIO_ACTIVE_LOW>;
```

驱动会根据 `GPIO_ACTIVE_LOW` 自动处理逻辑状态和 GPIO 电平之间的转换。

例如：

```text
brightness = 1
      ↓
LED 子系统：要求 LED 点亮
      ↓
驱动发现 GPIO_ACTIVE_LOW
      ↓
GPIO 输出低电平
      ↓
LED 点亮
```

因此：

> `brightness` 表示 LED 的逻辑亮度，不应该直接把它理解成 GPIO 输出的高低电平。

---

## trigger

查看当前支持的 trigger：

```bash
cat trigger
```

例如：

```text
none timer [heartbeat] default-on
```

方括号表示当前模式：

```text
[heartbeat]
```

不同系统支持的 trigger 不完全相同，以实际输出为准。

### 手动控制

```bash
echo none > trigger
```

然后：

```bash
echo 1 > brightness
echo 0 > brightness
```

如果程序需要自己控制 LED，建议先关闭 trigger。

---

## timer 闪烁

设置：

```bash
echo timer > trigger
```

此时通常会出现：

```text
delay_on
delay_off
```

例如：

```bash
echo 500 > delay_on
echo 500 > delay_off
```

效果：

```text
亮 500 ms
灭 500 ms
```

即约 `1 Hz` 周期闪烁。

---

## heartbeat 心跳灯

```bash
echo heartbeat > trigger
```

LED 会按照类似心跳的节奏闪烁，常用于表示系统正在运行。

---

## 常用操作

### 手动控制

```bash
LED=/sys/class/leds/sys-led

echo none > ${LED}/trigger
echo 1 > ${LED}/brightness

sleep 1

echo 0 > ${LED}/brightness
```

### 定时闪烁

```bash
LED=/sys/class/leds/sys-led

echo timer > ${LED}/trigger
echo 500 > ${LED}/delay_on
echo 500 > ${LED}/delay_off
```

### 心跳模式

```bash
echo heartbeat > /sys/class/leds/sys-led/trigger
```

---

## C 语言控制 LED

本质就是操作 sysfs 文件：

```text
open → write → close
```

示例：

```c
#include <fcntl.h>
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>

/* 将 sysfs 路径提取为宏定义，方便针对不同硬件平台进行配置和移植 */
#define LED_TRIGGER_PATH    "/sys/class/leds/rgb-led-r/trigger"
#define LED_BRIGHTNESS_PATH "/sys/class/leds/rgb-led-r/brightness"

/* 统一的底层文件写入辅助函数 */
static int write_file(const char *path, const char *val)
{
    int fd = open(path, O_WRONLY);
    if (fd < 0) {
        fprintf(stderr, "Error opening %s: %s\n", path, strerror(errno));
        return -1;
    }

    /* 写入时带上 '\0' 结束符，避免内核读取到脏数据 */
    ssize_t ret = write(fd, val, strlen(val) + 1);
    if (ret < 0) {
        fprintf(stderr, "Error writing to %s: %s\n", path, strerror(errno));
        close(fd);
        return -1;
    }

    close(fd);
    return 0;
}

/* 打印使用帮助信息 */
static void print_usage(const char *prog)
{
    fprintf(stderr, 
        "Usage: %s [command] [args]\n\n"
        "Commands:\n"
        "  on                  Turn on the LED manually\n"
        "  off                 Turn off the LED manually\n"
        "  trigger <type>      Set LED trigger mode\n"
        "                      Supported types: none, heartbeat, timer, mmc0\n",
        prog
    );
}

int main(int argc, char *argv[])
{
    if (argc < 2) {
        print_usage(argv[0]);
        return EXIT_FAILURE;
    }

    if (strcmp(argv[1], "on") == 0) {
        /* 先切回手动模式，再设置亮度，并增加错误判断 */
        if (write_file(LED_TRIGGER_PATH, "none") < 0) return EXIT_FAILURE;
        if (write_file(LED_BRIGHTNESS_PATH, "1") < 0) return EXIT_FAILURE;

    } else if (strcmp(argv[1], "off") == 0) {
        if (write_file(LED_TRIGGER_PATH, "none") < 0) return EXIT_FAILURE;
        if (write_file(LED_BRIGHTNESS_PATH, "0") < 0) return EXIT_FAILURE;

    } else if (strcmp(argv[1], "trigger") == 0) {
        if (argc < 3) {
            fprintf(stderr, "Error: 'trigger' command requires a type argument.\n");
            print_usage(argv[0]);
            return EXIT_FAILURE;
        }
        /* 设置触发类型（如 heartbeat, timer, mmc0 等） */
        if (write_file(LED_TRIGGER_PATH, argv[2]) < 0) return EXIT_FAILURE;

    } else {
        fprintf(stderr, "Error: Unknown command '%s'\n", argv[1]);
        print_usage(argv[0]);
        return EXIT_FAILURE;
    }

    return EXIT_SUCCESS;
}
```

---

## 权限问题

如果出现：

```text
Permission denied
```

通常是当前用户没有写权限。

下面这种写法可能仍然失败：

```bash
sudo echo 1 > brightness
```

因为 `>` 重定向仍由当前 Shell 执行。

可以使用：

```bash
echo 1 | sudo tee brightness
```

或者：

```bash
sudo sh -c 'echo 1 > brightness'
```

嵌入式开发板如果直接以 root 登录，则通常不需要 `sudo`。

---

## 常见问题

### 为什么写 brightness 没反应？

先关闭 trigger：

```bash
echo none > trigger
```

然后：

```bash
echo 1 > brightness
```

如果仍然没有反应，需要继续检查：

```text
设备树
GPIO 配置
GPIO 极性
pinctrl
LED 硬件
```

### 为什么没有 delay_on？

需要先：

```bash
echo timer > trigger
```

然后重新查看目录。

### 怎么知道系统支持哪些 trigger？

```bash
cat trigger
```

实际输出什么，就代表当前内核支持什么。

### LED 是低电平点亮，brightness 应该写 0 吗？

不是。

低电平有效描述的是：

```text
GPIO 物理电平
```

而 `brightness` 描述的是：

```text
LED 逻辑亮度
```

正常情况下：

```text
brightness = 0 → LED 熄灭
brightness > 0 → LED 非零亮度
```

GPIO 最终输出高电平还是低电平，由驱动处理。

---

## 注意：不是所有驱动都使用 sysfs

Linux 不同子系统的用户空间接口不同，例如：

```text
LED   → /sys/class/leds/
GPIO  → /dev/gpiochipX
I²C   → /dev/i2c-X
SPI   → /dev/spidevX.Y
UART  → /dev/ttyS*
Video → /dev/videoX
```

因此不能简单理解为：

```text
Linux 驱动 = 找 sysfs 文件
```

而应该理解为：

```text
不同 Linux 子系统
        ↓
提供不同用户空间 API
        ↓
用户程序操作设备
```

---

## 小结

LED sysfs 最需要掌握三个文件：

```text
brightness
max_brightness
trigger
```

常用命令：

```bash
# 查看 LED
ls /sys/class/leds/

# 手动控制
echo none > trigger

# 点亮
echo 1 > brightness

# 熄灭
echo 0 > brightness

# 定时闪烁
echo timer > trigger

# 心跳模式
echo heartbeat > trigger
```

核心关系：

```text
用户空间
   ↓
sysfs
   ↓
LED 子系统
   ↓
LED 驱动
   ↓
硬件
```

其中最容易混淆的一点是：

```text
brightness ≠ GPIO 电平
```

`brightness` 是 LED 的逻辑亮度，GPIO 的实际高低电平由驱动根据硬件极性进行转换。

---
