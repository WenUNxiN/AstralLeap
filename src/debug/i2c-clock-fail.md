---
title: I2C 读写失败 - 时钟频率过高
description: I2C 通信失败，原因是时钟频率超过 Sensor 支持范围
date: 2026-09-13
category:
  - I2C
  - Driver
tags:
  - I2C
  - 时钟
  - 设备树
platform:
  - RV1126B
status: solved
---

# I2C 读写失败 - 时钟频率过高

## 现象

将 I2C 时钟频率从 400KHz 提高到 1MHz 后，Sensor 的 I2C 读写全部失败。

```bash
i2cget -y 1 0x1a 0x00 w
Error: Read failed
```

`i2cdetect` 扫描结果全是 `--`，没有设备应答。

## 环境

| 项目 | 内容 |
|---|---|
| 开发板 | RV1126B |
| 内核版本 | 5.10.x |
| Sensor | IMX477 |
| I2C 总线 | I2C1 |
| 故障前时钟 | 400 KHz（正常） |
| 故障后时钟 | 1 MHz（异常） |

---

## 错误日志

```text title="dmesg"
[  123.456789] i2c i2c-1: i2c transfer timeout
[  123.456800] i2c i2c-1: SCL stuck low
```

---

## 初步判断

1. Sensor 硬件损坏？
2. 上拉电阻问题？
3. 时钟频率过高，Sensor 不支持？
4. 设备树配置错误？

---

## 排查过程

### 第一步：确认硬件没问题

将时钟频率改回 400KHz，I2C 通信恢复正常 → 排除硬件损坏。

### 第二步：检查规格书

查阅 IMX477 规格书中的 I2C 电气参数：

> I2C fast mode: up to 400 kHz

规格书明确写的是最高支持 400KHz 快速模式，不支持 1MHz 快速模式+。

### 第三步：确认设备树配置

```dts
&i2c1 {
    clock-frequency = <1000000>; // 1MHz，超过了 Sensor 支持的 400KHz
};
```

---

## 根因

I2C 时钟频率设置为 1MHz，超过了 IMX477 Sensor 支持的最高 400KHz，导致 Sensor 无法正常应答，I2C 通信失败。

---

## 解决方案

将设备树中的 I2C 时钟频率改回 400KHz（或更低的 100KHz）。

```dts title="修复后"
&i2c1 {
    status = "okay";
    clock-frequency = <400000>; // 400KHz，符合规格
};
```

---

## 验证

- ✅ i2cdetect 可以正常扫描到 0x1a 地址
- ✅ 寄存器读写正常
- ✅ 连续 1000 次读写无失败

---

## 最终状态

🟢 **已解决** · 已验证

---

## 经验总结

1. **先读规格书再超频**：任何外设都有额定的时钟频率，不要凭感觉往高了设
2. **从低速开始调试**：新设备先从 100KHz 标准模式开始，确认正常再往上加
3. **SCL stuck low 是典型信号**：时钟过快导致从机跟不上，会把 SCL 拉低（时钟拉伸），超时后报 stuck low
4. **上拉电阻也要匹配**：高频时需要更小的上拉电阻（1MHz 时建议 1K~2KΩ）

---

## 相关知识

- [I2C 驱动](/knowledge/driver/i2c)

## 相关实验

- [#018 I2C 时钟频率测试](/experiments/018-i2c-clock-test)
- [#021 Camera Sensor I2C 通信验证](/experiments/021-camera-i2c)
