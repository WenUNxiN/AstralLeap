---
title: Camera 类 Debug
description: Sensor、MIPI、ISP 相关问题记录
---

# 📷 Camera 类 Debug 记录

> Sensor 驱动、MIPI CSI、ISP 图像信号处理相关的问题。

---

## 记录列表

| 标题 | 状态 | 平台 | 日期 |
|---|---|---|---|
| [Sensor 画面偏绿 - Bayer 顺序](sensor-bayer-green) | ✅ 已解决 | RV1106G2 | 2026-09-07 |

---

## 常见问题方向

### Sensor 相关
- 上电时序问题
- I2C 通信失败
- 输出格式不匹配
- 帧率不对
- 曝光/增益设置

### MIPI 相关
- DQBUF 超时（MIPI 未锁定）
- 花屏/错位（lane 数不匹配）
- 时钟非连续模式问题
- 信号完整性

### ISP 相关
- 画面偏色
- 噪点多
- 模糊不清
- 3A（AE/AWB/AF）不工作

---

::: tip 排查顺序
Sensor 电源 → I2C → MIPI → ISP → V4L2
:::
