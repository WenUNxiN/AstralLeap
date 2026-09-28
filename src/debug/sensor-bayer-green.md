---
title: Sensor 画面偏绿 - Bayer 顺序不对
description: Sensor 输出画面整体偏绿，原因是 Bayer 格式与 ISP 配置不匹配
date: 2026-09-07
category:
  - Camera
  - Sensor
tags:
  - Sensor
  - Bayer
  - ISP
  - 图像质量
platform:
  - RV1106G2
status: solved
---

# Sensor 画面偏绿 - Bayer 顺序不对

## 现象

Camera 采集到的画面整体偏绿色，色彩异常，亮度正常但颜色不对。

```
画面表现：
- 整体偏绿调
- 红色物体偏黄
- 蓝色物体偏青
- 黑白物体基本正常
```

## 环境

| 项目 | 内容 |
|---|---|
| 开发板 | RV1106G2 |
| Sensor | GC2053 |
| 分辨率 | 1920×1080 |
| ISP | rkisp1 |

---

## 初步判断

1. 白平衡问题？
2. 色温设置不对？
3. Bayer 格式不匹配？
4. 色彩矩阵配置错误？

---

## 排查过程

### 第一步：检查 RAW 图

直接保存 Sensor 输出的 RAW 数据，用 raw2rgb 工具查看：

```bash title="保存 RAW 数据"
v4l2-ctl -d /dev/video0 --set-fmt-video=width=1920,height=1080,pixelformat=BGGR
v4l2-ctl -d /dev/video0 --stream-mmap --stream-count=1 --stream-to=output.raw
```

用工具将 RAW 转成 RGB 查看，颜色正常 → 说明 Sensor 输出本身没问题，是 ISP 处理出了问题。

### 第二步：检查 ISP 配置

查看 ISP 管道配置中的 Bayer 顺序：

```c
// ISP 配置
struct isp_sensor_info info;
info.bayer_pattern = RKISP_BAYER_RGGB;  // ← 这里对吗？
```

### 第三步：确认 Sensor 的 Bayer 顺序

查阅 GC2053 规格书：

> Pixel Array: 1920(H) × 1080(V)
> Bayer Pattern: BGGR (first pixel is Blue)

Sensor 是 **BGGR** 顺序，但 ISP 配置成了 **RGGB**！

### 第四步：验证修复

将 ISP 的 Bayer 格式改为 BGGR：

```c
info.bayer_pattern = RKISP_BAYER_BGGR;  // 修正为 BGGR
```

重新运行，画面颜色恢复正常。

---

## 根因

Sensor 的 Bayer 阵列顺序（BGGR）与 ISP 配置的 Bayer 顺序（RGGB）不一致，导致去马赛克（Demosaic）时颜色通道对应错误，画面整体偏绿。

### 为什么会偏绿？

因为 Bayer 阵列中 G 像素数量最多（占一半），当 Bayer 顺序搞错时，很多 R/B 像素被当成 G 来处理，导致画面整体偏绿。

---

## 解决方案

将 ISP 配置中的 `bayer_pattern` 改为与 Sensor 实际输出一致的格式。

```c title="修复后"
info.bayer_pattern = RKISP_BAYER_BGGR;
```

或者在设备树中配置正确的 Bayer 顺序：

```dts
sensor@37 {
    ...
    bayer-pattern = <BAYER_BGGR>;
};
```

---

## 验证

- ✅ 画面颜色恢复正常
- ✅ 白平衡校准后色彩准确
- ✅ 黑白灰阶无偏色

---

## 最终状态

🟢 **已解决** · 已验证

---

## 经验总结

1. **偏绿优先查 Bayer 顺序**：整体偏绿是 Bayer 不匹配的典型特征
2. **先看 RAW 再调 ISP**：先确认 Sensor 输出正确，再排查 ISP 配置
3. **Bayer 顺序有四种**：RGGB / BGGR / GRBG / GBRG，每种都可能遇到
4. **注意镜像翻转对 Bayer 的影响**：水平镜像会改变 Bayer 顺序（RGGB → GRBG）

---

## Bayer 四种模式速查

```
RGGB:    BGGR:    GRBG:    GBRG:
R G R G  B G B G  G R G R  G B G B
G B G B  G R G R  R G R G  B G B G
R G R G  B G B G  G R G R  G B G B
G B G B  G R G R  R G R G  B G B G
```

---

## 相关知识

- [Camera Sensor 原理](/knowledge/camera/sensor)
- ISP 图像信号处理

## 相关实验

- [#021 Camera Sensor I2C 通信验证](/experiments/021-camera-i2c)
