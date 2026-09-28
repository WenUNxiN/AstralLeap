---
title: YUV 像素格式
description: YUV 颜色空间、常见格式 YUYV/NV12/YUV420 详解
date: 2026-09-20
category:
  - Video
tags:
  - YUV
  - NV12
  - YUYV
  - 像素格式
platform:
  - 通用
status: learning
difficulty: beginner
---

# YUV 像素格式

YUV 是一种颜色编码方式，将亮度（Y）和色度（UV）分离。人眼对亮度比对色度更敏感，因此可以降低色度采样率来压缩数据，是视频编解码和图像传感器最常用的格式。

---

## 什么是 YUV

YUV 颜色空间包含三个分量：

- **Y** — Luma（亮度），表示明暗程度
- **U (Cb)** — Chroma Blue（蓝色差）
- **V (Cr)** — Chroma Red（红色差）

```
RGB  →  YUV 转换
Y  = 0.299R + 0.587G + 0.114B
U  = -0.169R - 0.331G + 0.5B   + 128
V  = 0.5R   - 0.419G - 0.081B  + 128
```

---

## 色度采样格式

根据 UV 分量的采样率不同，YUV 分为多种格式：

### YUV444

每个 Y 对应一组 UV，无压缩。质量最高，数据量最大。

```
Y0 Y1 Y2 Y3
U0 U1 U2 U3
V0 V1 V2 V3
```

数据量 = width × height × 3 字节

### YUV422（最常用的采集格式）

每 2 个 Y 共享一组 UV。水平方向色度减半，垂直不变。

```
Y0 Y1 Y2 Y3
U0    U2
V0    V2
```

数据量 = width × height × 2 字节

### YUV420（最常用的编码格式）

每 4 个 Y 共享一组 UV。水平和垂直方向色度都减半。

```
Y0 Y1 Y2 Y3
Y4 Y5 Y6 Y7
U0    U2
V0    V2
```

数据量 = width × height × 1.5 字节

> 💡 为什么叫 420 / 422 / 444？
> 第一个数字是 Y 样本数，后两个数字分别是第 1 行和第 2 行的 UV 样本数（每 4 个 Y 对应的数量）。

---

## 常见存储格式

### YUYV（打包格式，YUV422）

Y U Y V 的顺序交错存储，属于 **packed** 格式。

```
字节:  Y0 U0 Y1 V0  Y2 U2 Y3 V2 ...
```

- 也叫 YUY2、YUYV422
- 每 2 个像素占 4 字节（2Y + 1U + 1V）
- 常用于 Camera Sensor 输出

### NV12（半平面格式，YUV420）

Y 平面连续存储，UV 交错存储在另一个平面。属于 **semi-planar** 格式。

```
Y 平面: Y0 Y1 Y2 Y3 Y4 Y5 Y6 Y7 ...
UV 平面: U0 V0 U2 V2 ...
```

- 最常用的视频编码输入格式
- H.264 / H.265 编码通常使用 NV12
- Rockchip MPP 也以 NV12 为主要输入格式

### YV12 / I420（平面格式，YUV420）

三个独立的平面：Y 平面、V 平面、U 平面（YV12）或 Y 平面、U 平面、V 平面（I420）。

```
Y 平面: Y0 Y1 Y2 Y3 Y4 Y5 Y6 Y7 ...
U 平面: U0 U2 ...
V 平面: V0 V2 ...
```

- I420 = Y 在前、U 在中、V 在后
- YV12 = Y 在前、V 在中、U 在后（U 和 V 顺序相反）

---

## 格式大小计算

以 1920×1080 为例：

| 格式 | 每像素字节 | 总大小 |
|---|---:|---:|
| RGB888 | 3 | 1920×1080×3 = 5,929,920 B ≈ 5.66 MB |
| YUYV (422) | 2 | 1920×1080×2 = 4,147,200 B ≈ 3.96 MB |
| NV12 (420) | 1.5 | 1920×1080×1.5 = 3,110,400 B ≈ 2.97 MB |
| YUV420P | 1.5 | 1920×1080×1.5 = 3,110,400 B ≈ 2.97 MB |

---

## 格式转换

### YUYV → NV12

这是 Camera 采集 → MPP 编码的常见转换路径。

**Y 分量**：直接拷贝即可
**UV 分量**：从 YUYV 中每隔一个像素提取 U 和 V，组合成 UV 交错平面

通常使用 RGA 硬件加速转换，效率远高于 CPU。

---

## 如何查看原始 YUV 数据

```bash title="使用 ffplay 播放 YUV 文件"
# NV12 格式
ffplay -f rawvideo -pix_fmt nv12 -s 1920x1080 output.nv12

# YUYV 格式
ffplay -f rawvideo -pix_fmt yuyv422 -s 1920x1080 output.yuyv

# YUV420P (I420) 格式
ffplay -f rawvideo -pix_fmt yuv420p -s 1920x1080 output.yuv
```

---

## 常见问题

### 画面颜色不对

- 格式不匹配（以为是 NV12 实际是 YUYV）
- U/V 顺序反了（NV12 vs NV21）
- 宽高 stride 不对齐

### 画面有绿边/花屏

- 分辨率设置错误
- stride（行跨度）大于 width，按 width 解析导致错位

---

## 相关实验

- [#022 V4L2 MMAP 视频采集实验](/experiments/022-v4l2-mmap)

## 相关知识

- [V4L2 子系统](/knowledge/camera/v4l2)
- H.264 编码
- RGA 图形加速
