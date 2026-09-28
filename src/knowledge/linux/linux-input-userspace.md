---
title: Linux Input 子系统用户空间使用
description: 通过 /dev/input/eventX 读取并解析按键、触摸屏等输入设备上报的事件
date: 2026-09-28
category:
  - Linux
tags:
  - Linux
  - Input
  - evdev
  - input_event
platform:
  - 通用
status: learning
difficulty: beginner
---
# Linux Input 子系统用户空间使用

## 概述

Linux 使用 **Input 子系统**统一管理各种输入设备，例如：

```text
按键
键盘
鼠标
触摸屏
传感器
```

不同硬件产生的数据格式可能不同，但经过 Input 子系统处理后，会统一转换成 **input event（输入事件）**，并通过：

```text
/dev/input/eventX
```

提供给用户程序读取。

整体关系：

```text
输入设备
   ↓
设备驱动
   ↓
Linux Input 子系统
   ↓
/dev/input/eventX
   ↓
应用程序
```

---

## 查看输入设备

### 查看 event 设备

```bash
ls /dev/input/
```

常见结果：

```text
event0
event1
event2
```

每个 `eventX` 对应一个注册到 Input 子系统的输入设备。

---

### 查看设备对应关系

可以查看：

```bash
cat /proc/bus/input/devices
```

例如：

```text
N: Name="20cc000.snvs:snvs-powerkey"
H: Handlers=kbd event0

N: Name="goodix-ts"
H: Handlers=event1

N: Name="gpio_keys@0"
H: Handlers=kbd event2
```

通过：

```text
Name
```

可以判断是什么设备。

通过：

```text
Handlers
```

可以找到对应的 `eventX`。

例如：

```text
event0 → 电源按键
event1 → 触摸屏
event2 → GPIO 按键
```

---

## 读取输入设备

用户程序可以像读取普通设备文件一样读取：

```text
/dev/input/eventX
```

基本流程：

```text
open()
  ↓
read()
  ↓
解析 struct input_event
  ↓
继续 read()
```

例如打开：

```c
int fd = open("/dev/input/event0", O_RDONLY);
```

然后读取：

```c
struct input_event ev;

read(fd, &ev, sizeof(ev));
```

---

## 阻塞读取

默认情况下：

```c
read(fd, &ev, sizeof(ev));
```

属于阻塞读取。

如果当前没有新的输入事件：

```text
read()
  ↓
进程阻塞等待
```

当用户：

```text
按下按键
移动鼠标
点击触摸屏
```

产生新的输入事件后：

```text
输入设备产生事件
      ↓
Input 子系统上报
      ↓
read() 返回
      ↓
应用程序解析事件
```

因此程序通常会循环调用 `read()`：

```text
read
 ↓
等待事件
 ↓
事件发生
 ↓
解析事件
 ↓
再次 read
```

---

## struct input_event

Input 子系统向用户空间提供的核心数据结构是：

```c
struct input_event
```

程序需要包含：

```c
#include <linux/input.h>
```

其核心字段可以理解为：

```c
struct input_event {
    struct timeval time;
    __u16 type;
    __u16 code;
    __s32 value;
};
```

主要关注：

| 字段      | 作用         |
| --------- | ------------ |
| `time`  | 事件发生时间 |
| `type`  | 事件类型     |
| `code`  | 具体事件编号 |
| `value` | 事件值       |

可以简单理解成：

```text
type  → 发生了什么类型的事件
code  → 具体是哪一个按键 / 坐标轴
value → 事件具体发生了什么变化
```

---

## type：事件类型

`type` 表示当前事件属于哪一种类型。

常见类型：

```text
EV_KEY → 按键事件
EV_REL → 相对坐标事件
EV_ABS → 绝对坐标事件
EV_SYN → 同步事件
```

例如：

```c
if (ev.type == EV_KEY) {
    // 这是一个按键事件
}
```

---

## code：事件编号

`code` 表示具体是哪个输入元素产生了事件。

对于按键事件，例如：

```text
KEY_ESC
KEY_1
KEY_2
KEY_ENTER
KEY_POWER
```

例如：

```c
if (ev.code == KEY_ENTER) {
    // 回车键
}
```

因此：

```text
type = EV_KEY
code = KEY_ENTER
```

表示：

```text
发生了一个“回车键”事件
```

---

## value：事件值

对于 `EV_KEY` 按键事件：

| value | 含义         |
| ----: | ------------ |
| `0` | 按键松开     |
| `1` | 按键按下     |
| `2` | 按键自动重复 |

例如：

```text
type  = EV_KEY
code  = KEY_ENTER
value = 1
```

表示：

```text
回车键按下
```

而：

```text
type  = EV_KEY
code  = KEY_ENTER
value = 0
```

表示：

```text
回车键松开
```

因此判断一个按键事件通常需要同时判断：

```text
type + code + value
```

---

## 按键事件示例

假设用户按下回车键。

Input 子系统可能上报：

```text
type  = EV_KEY
code  = KEY_ENTER
value = 1
```

表示：

```text
回车键按下
```

用户松开后：

```text
type  = EV_KEY
code  = KEY_ENTER
value = 0
```

表示：

```text
回车键松开
```

完整过程：

```text
按下回车键
    ↓
EV_KEY + KEY_ENTER + 1

松开回车键
    ↓
EV_KEY + KEY_ENTER + 0
```

---

## C 程序读取事件

下面程序读取并打印 `/dev/input/event0` 上报的事件：

```c
#include <fcntl.h>
#include <linux/input.h>
#include <stdio.h>
#include <unistd.h>

int main(void)
{
    int fd;
    ssize_t ret;
    struct input_event ev;

    fd = open("/dev/input/event0", O_RDONLY);
    if (fd < 0) {
        perror("open");
        return 1;
    }

    while (1) {
        ret = read(fd, &ev, sizeof(ev));
        if (ret < 0) {
            perror("read");
            break;
        }

        if (ret != sizeof(ev))
            continue;

        printf("type=%u code=%u value=%d\n",
               ev.type,
               ev.code,
               ev.value);
    }

    close(fd);

    return 0;
}
```

运行后操作输入设备，可以看到类似：

```text
type=1 code=28 value=1
type=0 code=0  value=0
type=1 code=28 value=0
type=0 code=0  value=0
```

其中：

```text
type = 1
```

对应：

```text
EV_KEY
```

而：

```text
code = 28
```

对应：

```text
KEY_ENTER
```

---

## 判断指定按键

例如只处理回车键：

```c
if (ev.type == EV_KEY && ev.code == KEY_ENTER) {
    if (ev.value == 1) {
        printf("KEY_ENTER pressed\n");
    } else if (ev.value == 0) {
        printf("KEY_ENTER released\n");
    }
}
```

判断逻辑：

```text
type == EV_KEY
        ↓
确定是按键事件

code == KEY_ENTER
        ↓
确定是回车键

value
  ├── 1 → 按下
  ├── 0 → 松开
  └── 2 → 自动重复
```

---

## EV_SYN

读取 Input 事件时，经常还能看到：

```text
EV_SYN
```

例如：

```text
type=0 code=0 value=0
```

`EV_SYN` 用来表示一组输入事件的同步边界。

因此读取输入设备时出现：

```text
EV_KEY
EV_SYN
```

是正常现象。

例如一次按键上报可能类似：

```text
EV_KEY  KEY_ENTER  1
EV_SYN  SYN_REPORT 0
```

可以理解为：

```text
回车键按下
   ↓
这一组事件上报完成
```

---

## 注意 read() 的返回数据

课程中通常为了方便理解，以：

```c
read(fd, &ev, sizeof(ev));
```

一次读取一个：

```c
struct input_event
```

来讲解。

实际使用时需要注意：

> `read()` 返回的是字节数。只要提供的缓冲区足够大，一次 `read()` 也可以读取多个 `struct input_event`，因此不要把 Input 接口理解成“系统强制一次 read 只能返回一个事件”。

入门阶段使用：

```c
struct input_event ev;

read(fd, &ev, sizeof(ev));
```

即可。

---

## 常用命令

查看输入设备节点：

```bash
ls -l /dev/input/
```

查看输入设备信息：

```bash
cat /proc/bus/input/devices
```

快速查找 event：

```bash
grep -E "Name|Handlers" /proc/bus/input/devices
```

例如：

```text
N: Name="goodix-ts"
H: Handlers=event1
```

即可知道：

```text
goodix-ts → /dev/input/event1
```

---

## 使用流程

实际使用 Input 设备时，可以按照下面的步骤：

```text
1. 查看设备
   ↓
cat /proc/bus/input/devices

2. 找到 Handlers
   ↓
event0 / event1 / event2

3. 打开设备
   ↓
open("/dev/input/eventX")

4. 读取数据
   ↓
read()

5. 解析 struct input_event
   ↓
type + code + value

6. 根据事件执行业务逻辑
```

---

## 小结

Linux Input 子系统的核心作用是统一不同输入设备的事件格式：

```text
按键 / 键盘 / 鼠标 / 触摸屏
            ↓
       Input 子系统
            ↓
     /dev/input/eventX
            ↓
       struct input_event
            ↓
         应用程序
```

用户空间最需要掌握的是：

```text
/dev/input/eventX
struct input_event

type
code
value
```

对于按键事件：

```text
type  = EV_KEY
code  = 哪个按键
value = 按下 / 松开 / 重复
```

其中：

```text
value = 1 → 按下
value = 0 → 松开
value = 2 → 自动重复
```

基本使用流程就是：

```text
找到 eventX
    ↓
open()
    ↓
read()
    ↓
解析 type / code / value
    ↓
处理输入事件
```
