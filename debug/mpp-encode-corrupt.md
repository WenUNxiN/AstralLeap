---
title: MPP 编码输出花屏
description: MPP 硬编码输出码流解码后画面花屏、绿边问题排查
date: 2026-09-21
category:
  - MPP
  - Video
tags:
  - MPP
  - 编码
  - NV12
  - stride
platform:
  - RK3566
status: debugging
---

# MPP 编码输出花屏

## 现象

使用 Rockchip MPP 进行 H.264 硬编码，输出码流用 ffplay 播放时画面花屏，底部有绿色条纹，画面整体偏移。

```
画面表现：
- 上半部分正常
- 下半部分花屏/乱码
- 底部有绿色横条
- 整体有水平方向错位
```

## 环境

| 项目 | 内容 |
|---|---|
| 开发板 | RK3566 |
| SDK | rk356x Linux SDK v1.4 |
| MPP 版本 | 1.5.0 |
| 输入格式 | NV12 |
| 分辨率 | 1920×1080 |
| 编码格式 | H.264 |

---

## 初步判断

可能的原因：

1. 输入帧 stride（行跨度）与 width 不一致
2. 像素格式不匹配（实际是 YUYV 但按 NV12 传入）
3. 帧缓冲大小不对
4. 编码参数配置错误
5. MPP 版本问题

---

## 排查过程

### 第一步：确认输入数据正确

将编码前的原始 YUV 数据保存到文件，用 ffplay 播放验证：

```bash title="shell"
ffplay -f rawvideo -pix_fmt nv12 -s 1920x1080 input.nv12
```

**结果**：原始 NV12 数据播放正常，排除源数据问题。

### 第二步：检查编码参数

```c
MppEncCfg cfg;
cfg.width = 1920;
cfg.height = 1080;
// ...
```

宽高设置正确。

### 第三步：检查 hor_stride 和 ver_stride

```c
MppFrame frame;
mpp_frame_set_width(frame, 1920);
mpp_frame_set_height(frame, 1080);
mpp_frame_set_hor_stride(frame, 1920);  // ← 可能有问题
mpp_frame_set_ver_stride(frame, 1080);
```

**怀疑点**：MPP 要求 stride 是 16 或 64 字节对齐的，1920 虽然是 16 对齐（1920/16=120），但某些平台要求 64 对齐。

**待验证**：将 hor_stride 改为 align(1920, 64) = 1920（本身就是 64 的倍数，1920/64=30），所以应该不是对齐问题？

### 第四步：检查帧缓冲大小

NV12 大小 = stride × height × 1.5

如果 stride 是 1920，则总大小 = 1920 × 1080 × 1.5 = 3,110,400 字节

但实际分配的 buffer 大小是多少？需要确认。

---

## 当前状态

🔍 **排查中**

正在验证以下假设：

1. ⬜ stride 对齐问题（64 字节 vs 16 字节）
2. ⬜ MPP 帧缓冲分配大小不足
3. ⬜ Y 平面和 UV 平面偏移计算错误
4. ⬜ MPP 版本与 SDK 不匹配

---

## 下一步计划

1. 用 `v4l2-ctl` 采集一帧原始 NV12，直接喂给 MPP 编码，排除自己代码的数据错误
2. 对比官方 sample 代码中的 stride 设置
3. 检查 MPP 的 `mpi` 日志输出，查看是否有警告
4. 尝试用 `mpp_enc_test` 官方测试工具复现问题

---

## 相关知识

- [YUV 像素格式](/knowledge/video/yuv)
- [H.264 编码](/knowledge/video/h264)
- Rockchip MPP

## 相关实验

- [#020 MPP H.264 硬编码实验](/experiments/020-mpp-h264)
