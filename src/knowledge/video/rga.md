---
title: RGA 图形加速
description: Rockchip RGA 2D 图形加速硬件，格式转换、缩放、旋转、裁剪
date: 2026-09-11
category:
  - Video
tags:
  - RGA
  - 格式转换
  - 缩放
  - 旋转
platform:
  - RK3566
  - RV1126B
status: learning
difficulty: beginner
---

# RGA 图形加速

RGA（Raster Graphic Acceleration）是瑞芯微芯片中的 2D 图形加速硬件，可以高效完成图像格式转换、缩放、旋转、裁剪、位块传输等操作，完全不占用 CPU。

---

## RGA 能做什么

| 功能 | 说明 | 典型应用 |
|---|---|---|
| **格式转换** | YUV/RGB 各种格式互转 | Camera YUYV → NV12 给 MPP 编码 |
| **缩放** | 任意比例缩放 | 1080P → 720P 子码流 |
| **旋转** | 0°/90°/180°/270° 旋转 | 竖屏设备画面旋转 |
| **镜像** | 水平/垂直镜像 | 前置摄像头镜像 |
| **裁剪** | 从大图中裁出区域 | ROI 提取 |
| **位块传输** | 内存拷贝（带格式转换） | 高效 memcpy |

---

## 为什么要用 RGA

### CPU 做格式转换的问题

以 1080P YUYV → NV12 为例：
- 每帧 4MB 数据
- CPU 需要逐像素处理
- 30fps 下每秒处理 120MB 数据
- 占用大量 CPU，还可能拖慢帧率

### RGA 做格式转换

- 硬件加速，零 CPU 占用
- 1080P 转换仅需 ~1ms
- 支持流水线操作（格式转换 + 缩放 + 旋转一次完成）

---

## RGA 版本

| 版本 | 代表芯片 | 特点 |
|---|---|---|
| RGA 1.x | RK3288、RV1108 | 基础功能 |
| RGA 2.x | RK3566、RV1126 | 支持更多格式，性能提升 |
| RGA 3.x | RK3588 | 更强大的 2D 加速 |

> 本文主要针对 RGA 2.x（RK3566/RV1126 平台）

---

## 支持的格式

### RGB 格式

- RGB565
- RGB888
- ARGB8888
- ABGR8888

### YUV 格式

- YUYV422
- UYVY422
- NV12 / NV21
- YUV420P / YV12
- NV16 / NV61

---

## 使用方式

### 方法一：librga 库（推荐）

瑞芯微提供了用户空间的 `librga` 库，封装了 RGA 驱动的 ioctl 调用。

```c
#include <rga/RgaApi.h>

rga_info_t src, dst;

// 配置源图
src.w = 1920;
src.h = 1080;
src.format = RK_FORMAT_YUYV_422;
src.virAddr = (unsigned long)src_buf;
src.mmuFlag = 1;

// 配置目标图
dst.w = 1280;
dst.h = 720;
dst.format = RK_FORMAT_NV12;
dst.virAddr = (unsigned long)dst_buf;
dst.mmuFlag = 1;

// 执行转换 + 缩放（一次完成）
int ret = c_RkRgaBlit(&src, &dst, NULL);
```

### 方法二：DRM 方式

通过 Linux DRM 框架使用 RGA，更通用但更复杂。

---

## 常见操作示例

### 1. 格式转换（YUYV → NV12）

```c
src.format = RK_FORMAT_YUYV_422;
dst.format = RK_FORMAT_NV12;
c_RkRgaBlit(&src, &dst, NULL);
```

### 2. 缩放（1080P → 720P）

```c
src.w = 1920; src.h = 1080;
dst.w = 1280; dst.h = 720;
c_RkRgaBlit(&src, &dst, NULL);
```

### 3. 旋转 90 度

```c
rga_info_t src, dst;
// 注意：旋转后宽高互换
src.w = 1920; src.h = 1080;
dst.w = 1080; dst.h = 1920;

// 设置旋转参数
rga_rect_t rotate_rect;
rotate_rect.rotation = HAL_TRANSFORM_ROT_90;

c_RkRgaBlit(&src, &dst, &rotate_rect);
```

### 4. 裁剪

```c
src.w = 1920;
src.h = 1080;

// 源图裁剪区域（从(100, 100)开始取 640x480）
src.x = 100;
src.y = 100;
src.width = 640;   // 实际使用宽度
src.height = 480;  // 实际使用高度

dst.w = 640;
dst.h = 480;
```

### 5. 组合操作（格式转换 + 缩放 + 旋转）

RGA 支持一次操作完成多个效果：

```c
// YUYV 1920x1080 → 旋转90度 → 缩放到 720x1280 → NV12 输出
src.w = 1920;
src.h = 1080;
src.format = RK_FORMAT_YUYV_422;

dst.w = 720;
dst.h = 1280;
dst.format = RK_FORMAT_NV12;

rga_rect_t rect;
rect.rotation = HAL_TRANSFORM_ROT_90;

c_RkRgaBlit(&src, &dst, &rect);
```

> 一次完成多步操作，性能比分步做更好。

---

## 重要参数

### mmuFlag

```c
src.mmuFlag = 1;  // 必须设为 1，使用 MMU 模式
```

如果不设或设为 0，可能导致地址映射错误，出现花屏或崩溃。

### virAddr vs phyAddr

- **virAddr**：虚拟地址，用户空间的指针
- **phyAddr**：物理地址

RGA 驱动内部会做虚实地址转换，通常只需要设置 `virAddr` 和 `mmuFlag = 1` 即可。

### stride（行跨度）

```c
src.w_stride = 1920;  // 行跨度，单位是像素
src.h_stride = 1080;  // 垂直跨度
```

如果不设置，默认等于 width/height。但如果内存分配有对齐要求（如 16 字节对齐），stride 可能大于 width，这时候必须手动设置。

---

## 性能数据（RK3566）

| 操作 | 分辨率 | 耗时 |
|---|---|---|
| YUYV → NV12 | 1920×1080 | ~1.2 ms |
| 缩放 1080P → 720P | NV12 | ~0.8 ms |
| 旋转 90° | 1920×1080 | ~1.5 ms |
| 格式转换+缩放+旋转 | 1080P → 720P 旋转 | ~2.0 ms |

> 性能非常充足，完全不构成实时视频链路的瓶颈。

---

## 常见问题

### 1. 输出花屏

- mmuFlag 没设对
- stride 与实际内存布局不一致
- 格式配置错误

### 2. c_RkRgaBlit 返回错误码

错误码定义在 `RgaApi.h` 中，常见错误：

| 错误码 | 说明 |
|---|---|
| -1 | 参数错误 |
| -2 | 不支持的格式 |
| -6 | 内存不足 |

### 3. 性能不达预期

- 检查是否一次完成多步操作（避免多次调用）
- 确认使用了 MMU 模式
- 查看是否有其他进程占用 RGA

---

## 相关知识

- [YUV 像素格式](yuv)
- [H.264 编码](h264)
- MPP 编码

## 相关实验

- [#017 YUYV 转 NV12 格式转换](/experiments/017-rga-yuyv-nv12)
- [#020 MPP H.264 硬编码实验](/experiments/020-mpp-h264)
