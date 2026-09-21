---
title: MIPI CSI 接口
description: MIPI CSI-2 接口原理、D-PHY 与 C-PHY、通道数
date: 2026-09-19
category:
  - Camera
tags:
  - MIPI
  - CSI
  - D-PHY
  - Camera
platform:
  - 通用
status: learning
difficulty: intermediate
---

# MIPI CSI 接口

MIPI CSI-2（Camera Serial Interface 2）是 MIPI 联盟制定的摄像头接口标准，是目前嵌入式摄像头最主流的接口。

---

## 什么是 MIPI CSI-2

CSI-2 是一种高速串行差分接口，用于将 Camera Sensor 输出的图像数据传输到 SoC 的 ISP 或视频输入模块。

```
Sensor ── MIPI CSI-2 ──> SoC (CSI 接收 → ISP → V4L2)
```

### 特点

- 高速：每 lane 可达 2.5 Gbps（D-PHY）或 4.5 Gbps（C-PHY v1.2）
- 低功耗：HS（高速）模式和 LP（低功耗）模式切换
- 差分信号：抗干扰能力强
- 可扩展：1/2/4  lane 灵活配置

---

## D-PHY vs C-PHY

### D-PHY（最常用）

- 使用差分对传输数据，每个 lane 一对线：Dp / Dn
- 另需一对时钟线：ClkP / ClkN
- 速率：每 lane 最高 2.5 Gbps（v1.2）
- 编码：8b/9b 编码
- 优点：简单、成熟、应用广

```
2 lane D-PHY 需要的信号线：
D0p / D0n   （数据 lane 0）
D1p / D1n   （数据 lane 1）
Clkp / Clkn （时钟 lane）
共 6 根线
```

### C-PHY

- 三态差分信号，每 lane 三根线
- 不需要独立的时钟线（时钟嵌入数据中）
- 速率：每 lane 最高 4.5 Gbps（v1.2）
- 优点：相同带宽下 pin 数更少
- 缺点：更复杂，兼容性稍差

---

## Lane 数与带宽

常见的 lane 配置：1 lane、2 lane、4 lane。

### 带宽计算

以 D-PHY 为例：

```
总带宽 = lane 数 × 每 lane 速率
```

| Lane 数 | 每 lane 速率 | 总带宽 | 支持的典型分辨率 |
|---|---|---|---|
| 1 lane | 1.5 Gbps | 1.5 Gbps | 720P 30fps |
| 2 lane | 1.5 Gbps | 3.0 Gbps | 1080P 30fps |
| 4 lane | 1.5 Gbps | 6.0 Gbps | 4K 30fps / 1080P 120fps |
| 4 lane | 2.5 Gbps | 10 Gbps | 4K 60fps |

### 实际数据量估算

以 1080P 30fps RAW10 为例：

```
每帧数据 = 1920 × 1080 × 10bit = 20,736,000 bit
每秒数据 = 20,736,000 × 30 = 622,080,000 bps ≈ 622 Mbps
```

2 lane D-PHY（每 lane 800Mbps）= 1.6Gbps，足够。

> 💡 实际传输有协议开销（8b/9b 编码、帧头帧尾等），通常按 1.5~2 倍余量计算。

---

## CSI-2 协议层

```
应用层          (像素数据、GPIO、中断)
    ↓
协议层          (像素格式、虚拟通道、数据类型)
    ↓
通道管理层      (通道分配、帧同步、行同步)
    ↓
低层协议层      (SoT/EoT、8b/9b 编码)
    ↓
物理层 (D-PHY/C-PHY)
```

### 数据类型 (Data Type)

| DT 值 | 类型 | 说明 |
|---|---|---|
| 0x00 ~ 0x07 | 同步 | FS、FE、LS、LE 等 |
| 0x08 ~ 0x0F | Generic | 通用 8/16/24 位数据 |
| 0x18 | YUV420 8bit | YUV420 8 位 |
| 0x1E | YUV422 8bit | YUV422 8 位 |
| 0x28 | RAW8 | RAW 8 位 |
| 0x2B | RAW10 | RAW 10 位 |
| 0x2C | RAW12 | RAW 12 位 |

### 虚拟通道 (Virtual Channel)

CSI-2 支持最多 4 个虚拟通道（VC 0~3），可以在同一条物理链路上传输多个数据流。

---

## D-PHY 传输模式

### HS（High Speed）模式

- 高速数据传输
- 差分信号，摆幅约 200mV
- 传输图像数据时使用

### LP（Low Power）模式

- 低功耗，速率低（~10Mbps）
- 单端信号，摆幅 1.2V
- 控制和状态通信时使用
- 传输帧间隙、控制指令

**传输过程**：LP 模式 → 进入 HS 模式 → 发送数据 → 回到 LP 模式

---

## 设备树配置

```dts title="Sensor 端输出配置"
sensor@1a {
    port {
        sensor_out: endpoint {
            remote-endpoint = <&csi2_dphy_in>;
            data-lanes = <1 2 3 4>;  // 使用 4 条数据 lane
            clock-noncontinuous;     // 时钟非连续模式
            link-frequencies = /bits/ 64 <450000000>; // 450MHz
        };
    };
};
```

```dts title="SoC 端接收配置"
&csi2_dphy0 {
    status = "okay";
    ports {
        port@0 {
            reg = <0>;
            csi2_dphy_in: endpoint@0 {
                remote-endpoint = <&sensor_out>;
                data-lanes = <1 2 3 4>;
            };
        };
        port@1 {
            reg = <1>;
            csi2_dphy_out: endpoint {
                remote-endpoint = <&isp_in>;
            };
        };
    };
};
```

---

## 常见问题

### 1. 接收不到数据 / DQBUF 超时

- MIPI D-PHY 未锁定
- 检查 Sensor 是否正确输出数据
- 检查 lane 数是否匹配
- 检查 data-lanes 顺序是否正确

### 2. 画面花屏 / 错位

- lane 数不匹配（Sensor 输出 4 lane，接收端配置 2 lane）
- 分辨率或像素格式不匹配
- 行长度不对齐

### 3. 高速模式下数据错误

- 阻抗不匹配（PCB 走线阻抗应控制在 100Ω±10%）
- 信号完整性问题（走线太长、过孔太多）
- 电平不匹配（IO 电压不一致）

### 4. clock-noncontinuous

有些 Sensor 支持时钟非连续模式（帧间隔时钟停止），有些不支持。配置错了可能导致接收端 PLL 失锁。

---

## 调试方法

```bash title="查看 MIPI D-PHY 状态"
cat /sys/kernel/debug/mipi-dphy/status
cat /sys/kernel/debug/rkisp1/stats
```

```bash title="查看 CSI 中断计数"
cat /proc/interrupts | grep csi
```

```bash title="用示波器/逻辑分析仪看 MIPI 信号"
# 需要专用的 MIPI 探头，普通示波器抓不到这么高速的差分信号
```

---

## 相关知识

- [V4L2 子系统](/knowledge/camera/v4l2)
- Sensor 原理
- ISP 图像信号处理

## 相关 Debug

- [VIDIOC_DQBUF Timeout](/debug/v4l2-dqbuf-timeout) — MIPI 链路未建立

## 相关实验

- [#022 V4L2 MMAP 视频采集实验](/experiments/022-v4l2-mmap)
