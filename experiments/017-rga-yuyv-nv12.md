---
title: YUYV 转 NV12 格式转换
description: 使用 RGA 硬件加速进行 YUYV 到 NV12 的格式转换
date: 2026-09-10
category:
  - Video
  - RGA
tags:
  - YUV
  - RGA
  - 格式转换
platform:
  - RK3566
status: verified
difficulty: beginner
---

# #017 · YUYV 转 NV12 格式转换

## 实验目标

验证 RGA 硬件加速进行 YUYV422 → NV12 格式转换的性能和正确性，为 Camera 采集 + MPP 编码链路做准备。

---

## 实验环境

| 项目 | 内容 |
|---|---|
| 开发板 | RK3566 |
| 内核版本 | 5.10.x |
| RGA 版本 | 2.1.0 |
| 输入格式 | YUYV422 |
| 输出格式 | NV12 |
| 分辨率 | 1920×1080 |

---

## 背景

Camera Sensor 通常输出 YUYV 格式，而 MPP 编码通常需要 NV12 格式。中间需要做一次格式转换：

```
Sensor → YUYV → [格式转换] → NV12 → MPP → H.264
```

用 CPU 做转换太慢，所以用 RGA 硬件加速。

---

## 实验步骤

### Step 1：准备输入数据

先用 V4L2 采集一帧 YUYV 数据：

```bash title="采集 YUYV 帧"
v4l2-ctl -d /dev/video0 --set-fmt-video=width=1920,height=1080,pixelformat=YUYV
v4l2-ctl -d /dev/video0 --stream-mmap --stream-count=1 --stream-to=input.yuyv
```

### Step 2：RGA 转换代码

```c title="rga_convert.c 片段"
#include <rga/RgaApi.h>

rga_info_t src_info, dst_info;
int ret;

// 源图配置（YUYV）
memset(&src_info, 0, sizeof(src_info));
src_info.w = 1920;
src_info.h = 1080;
src_info.format = RK_FORMAT_YUYV_422;
src_info.virAddr = (unsigned long)yuyv_buf;
src_info.mmuFlag = 1;

// 目标图配置（NV12）
memset(&dst_info, 0, sizeof(dst_info));
dst_info.w = 1920;
dst_info.h = 1080;
dst_info.format = RK_FORMAT_NV12;
dst_info.virAddr = (unsigned long)nv12_buf;
dst_info.mmuFlag = 1;

// 执行转换
ret = c_RkRgaBlit(&src_info, &dst_info, NULL);
if (ret) {
    printf("RGA blit failed: %d\n", ret);
    return -1;
}
```

### Step 3：保存输出并验证

```bash title="播放输出验证"
ffplay -f rawvideo -pix_fmt nv12 -s 1920x1080 output.nv12
```

### Step 4：性能测试

循环转换 1000 次，计算平均耗时：

```c
struct timeval start, end;
gettimeofday(&start, NULL);

for (int i = 0; i < 1000; i++) {
    c_RkRgaBlit(&src_info, &dst_info, NULL);
}

gettimeofday(&end, NULL);
double total = (end.tv_sec - start.tv_sec) +
               (end.tv_usec - start.tv_usec) / 1000000.0;
printf("Avg time: %.2f ms\n", total * 1000 / 1000);
```

---

## 实验结果

### 正确性

- ✅ 输出 NV12 播放正常，颜色正确
- ✅ 无花屏、无错位、无绿边
- ✅ 分辨率正确

### 性能

| 分辨率 | 格式转换 | 平均耗时 | 理论帧率 |
|---|---|---|---|
| 1920×1080 | YUYV → NV12 | ~1.2 ms | ~833 fps |
| 1280×720 | YUYV → NV12 | ~0.6 ms | ~1666 fps |

> RGA 硬件转换非常快，完全不构成性能瓶颈。

---

## 结论

1. RGA 硬件加速 YUYV → NV12 转换正确无误
2. 1080P 下仅需 1.2ms，性能充足
3. 可以放心用在 Camera → MPP 的实时编码链路中

---

## 经验

1. **MMU flag 一定要设**：`mmuFlag = 1`，否则可能访问非法地址
2. **virAddr 用虚拟地址**：RGA 驱动内部会做虚实地址转换
3. **支持的格式有限**：不是所有格式都能互转，转换前查 RGA 文档
4. **异步模式**：RGA 也支持异步模式，适合流水线

---

## 相关知识

- [YUV 像素格式](/knowledge/video/yuv)
- RGA 图形加速

## 相关实验

- [#022 V4L2 MMAP 视频采集实验](/experiments/022-v4l2-mmap)
- [#020 MPP H.264 硬编码实验](/experiments/020-mpp-h264)
