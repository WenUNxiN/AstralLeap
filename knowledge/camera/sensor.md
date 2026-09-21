---
title: Camera Sensor 原理
description: CMOS 图像传感器工作原理、参数与驱动要点
date: 2026-09-15
category:
  - Camera
tags:
  - Sensor
  - Camera
  - CMOS
platform:
  - 通用
status: learning
difficulty: beginner
---

# Camera Sensor 原理

Camera Sensor（图像传感器）是摄像头的核心部件，负责将光学图像转换为电信号。目前主流的是 CMOS 图像传感器（CIS，CMOS Image Sensor）。

---

## Sensor 是怎么工作的

```
光线 → 微透镜 → 彩色滤光片 → 光电二极管（PD） → 电荷 → 放大 → ADC → 数字信号
```

1. **微透镜（Microlens）**：将光线聚焦到光电二极管上，提高采光效率
2. **彩色滤光片（Color Filter）**：只让特定颜色的光通过（R/G/B）
3. **光电二极管（PD）**：光子打在上面产生电荷，光越强，电荷越多
4. **读出电路**：将电荷转换为电压并放大
5. **ADC**：将模拟电压转换为数字信号（RAW 数据）

---

## Bayer 阵列

Sensor 像素上覆盖着 Bayer 彩色滤光片阵列，每个像素只能感知一种颜色（R、G 或 B）。

```
G  R  G  R  G  R
B  G  B  G  B  G
G  R  G  R  G  R
B  G  B  G  B  G
```

- **G 像素最多**：人眼对绿色最敏感，所以 G 像素占一半
- **R 和 B 各占 1/4**
- 输出格式叫 **RAW**（RAW8 / RAW10 / RAW12）

> 💡 为什么叫 RAW？因为它是 Sensor 最原始的输出，还没经过 ISP 处理。每个像素只有一个颜色分量，需要通过插值（去马赛克）才能得到完整的 RGB 图像。

---

## 关键参数

### 像素尺寸（Pixel Size）

- 单位：μm（微米）
- 常见尺寸：1.0μm / 1.4μm / 2.0μm / 2.9μm
- **像素越大，感光能力越强，画质越好**，但同尺寸芯片下像素数越少

### 分辨率

- 1080P = 1920×1080 ≈ 200 万像素
- 4K = 3840×2160 ≈ 800 万像素
- 12MP = 4056×3040

### 帧率（Frame Rate）

- 单位：fps（帧每秒）
- 常见：30fps / 60fps / 120fps
- 帧率越高，运动画面越流畅，数据量越大

### 像素深度

| 格式 | 每像素位数 | 动态范围 |
|---|---|---|
| RAW8 | 8 bit | 约 48 dB |
| RAW10 | 10 bit | 约 60 dB |
| RAW12 | 12 bit | 约 72 dB |
| RAW14 | 14 bit | 约 84 dB |

位数越多，动态范围越大，后期调整空间越大，但数据量也更大。

### 靶面尺寸

- 1/2.7" / 1/2.3" / 1/1.8" / 1" / APS-C / Full Frame
- 分母越小，靶面越大，画质越好

---

## Sensor 输出接口

| 接口 | 说明 | 应用场景 |
|---|---|---|
| **MIPI CSI-2** | 高速差分串行，主流接口 | 手机、嵌入式、平板 |
| **DVP（Parallel）** | 并行接口，引脚多 | 老款、低分辨率 |
| **LVDS** | 低压差分 | 工业相机 |
| **USB** | USB 摄像头 | 外接摄像头 |
| **SDI** | 串行数字接口 | 广播级 |

---

## 曝光与增益

### 曝光时间（Exposure Time）

- 光电二极管积累电荷的时间
- 曝光时间越长，画面越亮，但运动模糊越明显
- 单位：行时间（line time）或微秒（μs）
- 最长曝光时间受帧率限制：`曝光时间 < 1/帧率`

### 增益（Gain）

- 对读出的信号进行放大
- 模拟增益（Analog Gain）：ADC 之前放大，噪声也一起放大
- 数字增益（Digital Gain）：ADC 之后数字乘法
- 增益越高，画面越亮，但噪声越大

### 自动曝光（AE）

Sensor 驱动 + ISP 根据画面亮度自动调整曝光时间和增益，让画面亮度保持在目标水平。

---

## Sensor 驱动要点

### 上电时序

Sensor 上电有严格的时序要求，顺序错了可能无法工作甚至损坏：

```
1. 模拟电源 AVDD 上电
2. 数字电源 DOVDD 上电
3. 核心电源 DVDD 上电
4. 等待 > 1ms
5. 释放 PWDN（拉低为正常工作）
6. 等待 > 2ms
7. 释放 RESET（拉高为正常工作）
8. 等待 Sensor 就绪（通常几十 ms）
9. 配置 I2C 寄存器
```

### 寄存器配置

Sensor 通过 I2C 配置寄存器，常见配置：

- 分辨率 / 窗口大小
- 帧率
- 曝光时间
- 增益
- 镜像 / 翻转
- MIPI lane 数
- 像素格式

### 常见寄存器页

很多 Sensor 寄存器地址只有 8 位，但寄存器数量超过 256 个，所以用「页」来扩展：

```c
// 先写页寄存器切到第 0x10 页
i2c_write(0xF0, 0x10);
// 然后访问 0x10 页的 0x01 寄存器
i2c_write(0x01, value);
```

---

## 常见 Sensor 型号

| 型号 | 分辨率 | 像素尺寸 | 接口 | 厂商 |
|---|---|---|---|---|
| IMX477 | 12MP (4056×3040) | 1.55μm | MIPI 4 lane | Sony |
| IMX219 | 8MP (3280×2464) | 1.12μm | MIPI 2 lane | Sony |
| IMX290 | 2MP (1920×1080) | 2.9μm | MIPI 2 lane | Sony |
| OV5640 | 5MP (2592×1944) | 1.4μm | MIPI / DVP | OmniVision |
| GC2053 | 2MP (1920×1080) | 3.0μm | MIPI / DVP | GalaxyCore |
| SC2336 | 2MP (1920×1080) | 3.0μm | MIPI 2 lane | SmartSens |

---

## 相关知识

- [MIPI CSI 接口](mipi-csi)
- [V4L2 子系统](v4l2)
- ISP 图像信号处理
- [I2C 驱动](/knowledge/driver/i2c)

## 相关实验

- [#021 Camera Sensor I2C 通信验证](/experiments/021-camera-i2c)

## 相关 Debug

- [I2C 读写失败 - 时钟频率问题](/debug/i2c-clock-fail)
