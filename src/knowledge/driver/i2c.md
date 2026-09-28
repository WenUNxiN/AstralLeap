---
title: I2C 驱动
description: I2C 协议原理与 Linux I2C 驱动开发
date: 2026-09-18
category:
  - Driver
tags:
  - I2C
  - 驱动
  - Linux
platform:
  - 通用
status: learning
difficulty: beginner
---

# I2C 驱动

I2C（Inter-Integrated Circuit）是一种常用的低速串行总线，广泛用于连接 Sensor、EEPROM、RTC 等外设。

---

## 什么是 I2C

I2C 总线只有两根线：

- **SCL**（Serial Clock）— 时钟线，由主机产生
- **SDA**（Serial Data）— 数据线，双向传输

特点：
- 半双工、同步串行
- 支持多主机（常用为单主机）
- 7 位或 10 位地址
- 标准模式 100KHz，快速模式 400KHz，高速模式 3.4MHz

```
  主控 ── SCL ──┬──┬──┬── 从设备1  从设备2  从设备3
              │  │  │
  主控 ── SDA ──┴──┴──┴──  地址0x1A  地址0x50  地址0x68
```

---

## I2C 通信协议

### 起始条件 (START)

SCL 为高电平时，SDA 从高变低。

```
SDA: ────┐
        └───
SCL: ───────
        ───
```

### 停止条件 (STOP)

SCL 为高电平时，SDA 从低变高。

```
SDA:    ┌───
     ───┘
SCL: ───────
         ───
```

### 数据传输

- SCL 高电平时，SDA 必须稳定（数据有效）
- SCL 低电平时，SDA 可以变化
- 每字节 8 位，MSB 在前
- 每字节后跟一个 ACK/NACK 位（第 9 个时钟）

### ACK / NACK

- **ACK**：接收方在第 9 个时钟拉低 SDA
- **NACK**：接收方在第 9 个时钟保持 SDA 高电平

---

## Linux I2C 子系统架构

```
用户空间 (i2c-dev / sysfs)
    ↓
I2C 核心 (i2c-core)
    ↓
I2C 总线驱动 (i2c-bus driver)  ←→  I2C 设备驱动 (i2c-client driver)
    ↓                                    ↓
I2C 控制器硬件                      Sensor / EEPROM 等外设
```

### 重要概念

| 概念 | 说明 |
|---|---|
| i2c_adapter | I2C 控制器（总线）的抽象 |
| i2c_driver | I2C 设备驱动（如 Sensor 驱动） |
| i2c_client | I2C 设备实例（挂在总线上的具体设备） |
| i2c_algorithm | 总线读写算法（位操作或硬件控制器） |

---

## 用户空间 I2C 操作

### i2c-tools 工具

```bash title="列出 I2C 总线"
i2cdetect -l
```

```bash title="扫描总线上的设备"
i2cdetect -y 1
```

```bash title="读取寄存器（8位地址，8位数据）"
i2cget -y 1 0x50 0x10
```

```bash title="读取寄存器（16位地址）"
i2cget -y 1 0x1a 0x00 w
```

```bash title="写入寄存器"
i2cset -y 1 0x50 0x10 0xff
```

```bash title="dump 整个寄存器空间"
i2cdump -y 1 0x50
```

### C 语言操作 I2C

```c title="i2c_read_write.c"
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <linux/i2c-dev.h>
#include <sys/ioctl.h>

int main() {
    int fd = open("/dev/i2c-1", O_RDWR);

    // 设置从机地址
    ioctl(fd, I2C_SLAVE, 0x50);

    // 写寄存器：寄存器地址 + 数据
    unsigned char buf[2] = {0x10, 0xff};
    write(fd, buf, 2);

    // 读寄存器：先写寄存器地址，再读数据
    unsigned char reg = 0x10;
    write(fd, &reg, 1);
    unsigned char data;
    read(fd, &data, 1);
    printf("0x%02x\n", data);

    close(fd);
    return 0;
}
```

---

## I2C 设备驱动示例

### 设备树配置

```dts title="i2c 设备树示例"
&i2c1 {
    status = "okay";
    clock-frequency = <400000>; // 400KHz

    sensor@1a {
        compatible = "vendor,sensor-xxx";
        reg = <0x1a>;
        // ... 其他属性
    };
};
```

### 驱动基本框架

```c
static const struct i2c_device_id sensor_id[] = {
    { "sensor-xxx", 0 },
    { }
};
MODULE_DEVICE_TABLE(i2c, sensor_id);

static const struct of_device_id sensor_of_match[] = {
    { .compatible = "vendor,sensor-xxx" },
    { }
};
MODULE_DEVICE_TABLE(of, sensor_of_match);

static struct i2c_driver sensor_driver = {
    .driver = {
        .name = "sensor-xxx",
        .of_match_table = sensor_of_match,
    },
    .probe = sensor_probe,
    .remove = sensor_remove,
    .id_table = sensor_id,
};

module_i2c_driver(sensor_driver);
```

---

## 常见问题

### 1. 设备地址扫描不到

- 设备未上电
- SDA/SCL 接线错误
- I2C 总线时钟过高（设备不支持快速模式）
- 上拉电阻缺失或阻值不对

### 2. 读写失败返回 EIO

- 设备不 ACK
- 寄存器地址格式不对（8位 vs 16位）
- 设备处于休眠状态

### 3. 时钟频率问题

- 标准模式：100 KHz
- 快速模式：400 KHz
- 高速模式：3.4 MHz
- 超高速模式：5 MHz

> Sensor I2C 通常用 100KHz 或 400KHz。如果设备不稳定，先降到 100KHz 测试。

---

## 相关实验

- [#021 Camera Sensor I2C 通信验证](/experiments/021-camera-i2c)

## 相关知识

- GPIO 子系统
- 设备树
- Sensor 原理
