---
title: Camera Sensor I2C 通信验证
description: 通过 I2C 读写 Sensor 寄存器，验证通信链路
date: 2026-09-18
category:
  - Camera
  - Driver
tags:
  - I2C
  - Sensor
  - IMX477
platform:
  - RV1106G2
status: verified
difficulty: beginner
---

# #021 · Camera Sensor I2C 通信验证

## 实验目标

在 RV1106G2 上通过 I2C 读写 IMX477 Sensor 的寄存器，验证 I2C 通信链路是否正常。

---

## 实验环境

| 项目 | 内容 |
|---|---|
| 开发板 | RV1106G2 |
| 内核版本 | 5.10.x |
| Camera Sensor | IMX477 |
| I2C 地址 | 0x1a（16-bit 寄存器地址） |
| I2C 总线 | I2C1 |

---

## 实验原理

```
CPU → I2C 控制器 → I2C 总线 → Sensor 寄存器
```

读取 Sensor 的 chip_id 寄存器（通常是 0x0000-0x0001），如果读到的值与规格书一致，说明 I2C 通信正常。

---

## 实验步骤

### Step 1：确认 I2C 总线

```bash title="shell"
i2cdetect -l
```

### Step 2：扫描 I2C 设备

```bash title="shell"
i2cdetect -y 1
```

预期输出中 0x1a 位置应该有设备地址。

### Step 3：读取 chip_id 寄存器

```bash title="shell"
# IMX477 chip_id 寄存器地址 0x0000-0x0001，值应为 0x0477
i2cget -y 1 0x1a 0x00 w
```

预期返回值：`0x0477`（注意字节序）

### Step 4：写入测试寄存器

```bash title="shell"
# 写入测试寄存器，然后读回验证
i2cset -y 1 0x1a 0x00 0x01
i2cget -y 1 0x1a 0x00
```

---

## 实验结果

### 预期

- i2cdetect 能扫描到 0x1a 地址
- 读取 chip_id 返回 0x0477
- 写入后读回值一致

### 实际

- ✅ i2cdetect 扫描到 0x1a
- ✅ chip_id 读取值为 0x0477，与规格书一致
- ✅ 读写测试正常

---

## 常见问题

### 问题：i2cdetect 全是 UU 或 --

- **UU**：设备被驱动占用（正常现象，说明驱动已加载）
- **--**：没有设备应答，检查硬件连接、电源、地址

### 问题：读到的值全是 0xff 或 0x00

- 可能是 Sensor 未上电
- 可能是 reset 引脚处于复位状态
- 可能是 mclk 未提供

---

## 相关知识

- I2C 协议
- IMX477 规格书
- Sensor 上电时序

---

## 下一步

- [ ] 配置 Sensor 的输出格式
- [ ] 配置 V4L2 采集
- [ ] 测试不同分辨率
