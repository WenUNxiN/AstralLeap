---
title: Media Controller
description: Linux Media Controller 架构、实体、管道、链路配置
date: 2026-09-18
category:
  - Camera
tags:
  - Media Controller
  - V4L2
  - ISP
platform:
  - 通用
status: learning
difficulty: intermediate
---

# Media Controller

Media Controller 是 Linux 内核中用于管理复杂视频管道的框架。当视频系统不再是简单的 Sensor → V4L2，而是包含了 ISP、CSI、RGA、编码器等多个硬件模块时，就需要 Media Controller 来管理它们之间的连接关系。

---

## 为什么需要 Media Controller

传统的 V4L2 模型是一个 `/dev/videoX` 设备对应一个功能。但现代嵌入式视频系统非常复杂：

```
Sensor → MIPI CSI → ISP → RGA → 编码器
            ↓         ↓
          预览       抓拍
```

每个模块都是独立的硬件单元，可以有不同的输入输出，可以灵活组合。Media Controller 就是用来描述和配置这些模块之间的连接关系的。

---

## 核心概念

### 实体（Entity）

Media Controller 中的每个硬件模块就是一个实体（Entity）。

常见的实体：
- Sensor 实体
- CSI 接收实体
- ISP 实体
- 视频捕获实体（Video Capture）
- 编码实体（Encoder）

每个实体有一个或多个 Pad（端口）。

### Pad（端口）

实体的输入输出接口叫 Pad。

- **Sink Pad** — 输入端口（数据流入）
- **Source Pad** — 输出端口（数据流出）

```
Sensor 实体                    ISP 实体
┌─────────────┐               ┌─────────────┐
│ Source Pad  │ → → → → → → → │ Sink Pad    │
│     (输出)  │     链路      │    (输入)    │
└─────────────┘               └─────────────┘
```

### 链路（Link）

两个 Pad 之间的连接叫做链路（Link）。链路可以启用或禁用。

### 管道（Pipeline）

多个实体通过链路连接起来，形成一条完整的数据流路径，叫做管道。

```
Sensor → CSI → ISP → Video Device
```

---

## 设备节点

Media Controller 引入了新的设备节点类型：

| 设备节点 | 说明 |
|---|---|
| `/dev/mediaX` | Media 控制器设备，用于发现和配置拓扑 |
| `/dev/videoX` | 视频设备，用于帧数据的 IO（MMAP 等） |
| `/dev/v4l-subdevX` | 子设备，用于配置 Sensor/ISP 等子模块 |

### v4l-subdev

每个子模块（Sensor、CSI、ISP 的每个子模块）都对应一个 `/dev/v4l-subdevX` 设备，通过它可以配置该子模块的格式、裁剪、缩放等参数。

---

## 用户空间工具

### media-ctl

`media-ctl` 是用来操作 Media Controller 的命令行工具。

```bash title="查看拓扑结构"
media-ctl -d /dev/media0 -p
```

```bash title="打印 DOT 图（可以可视化）"
media-ctl -d /dev/media0 --print-dot
```

```bash title="设置链路"
media-ctl -d /dev/media0 --set-link '"imx477 2-001a":0->"rkisp1_isp":0[1]'
# [1] 表示启用链路，[0] 表示禁用
```

```bash title="设置子设备格式"
media-ctl -d /dev/media0 --set-v4l2 '"imx477 2-001a":0[fmt:SRGGB10_1X10/4056x3040]'
```

### v4l2-ctl 配合使用

```bash title="查看 video 设备对应的 subdev"
v4l2-ctl -d /dev/video0 --all
# 看 info 部分的 entity name
```

---

## 典型的拓扑结构

以 Rockchip ISP 为例：

```
Sensor (imx477)
    ↓ Pad 0
MIPI CSI DPHY
    ↓
ISP Input (rkisp1_isp)
    ├── selfpath → 预览输出 (/dev/video1)
    └── mainpath → 全量输出 (/dev/video0)
```

```bash title="用 media-ctl 查看"
media-ctl -d /dev/media0 -p
# 输出会列出所有 entity、pad、link
```

---

## 配置流程（以采集为例）

### Step 1：发现拓扑

```c
// 打开 media 设备
int fd = open("/dev/media0", O_RDWR);

// 枚举所有 entity
struct media_entity_desc entity;
for (int i = 0; ; i++) {
    entity.id = i | MEDIA_ENT_ID_FLAG_NEXT;
    if (ioctl(fd, MEDIA_IOC_ENUM_ENTITIES, &entity) < 0)
        break;
    // 处理 entity
}
```

### Step 2：配置链路

```c
struct media_link_desc link;
// 设置 source pad 和 sink pad
link.source.entity = sensor_entity.id;
link.source.pad = 0; // source pad
link.sink.entity = isp_entity.id;
link.sink.pad = 0;   // sink pad
link.flags = MEDIA_LNK_FL_ENABLED;

ioctl(fd, MEDIA_IOC_SETUP_LINK, &link);
```

### Step 3：配置子设备格式

```c
// 打开 subdev 设备
int subdev_fd = open("/dev/v4l-subdev0", O_RDWR);

struct v4l2_subdev_format fmt;
fmt.which = V4L2_SUBDEV_FORMAT_ACTIVE;
fmt.pad = 0;
fmt.format.width = 1920;
fmt.format.height = 1080;
fmt.format.code = MEDIA_BUS_FMT_SRGGB10_1X10;

ioctl(subdev_fd, VIDIOC_SUBDEV_S_FMT, &fmt);
```

### Step 4：正常 V4L2 采集

配置完拓扑和格式后，就可以在 `/dev/videoX` 上用标准的 V4L2 MMAP 方式采集了。

---

## 为什么比传统 V4L2 复杂

| 方面 | 传统 V4L2 | Media Controller |
|---|---|---|
| 模型 | 一个 video 设备干所有 | 多个 subdev 组成管道 |
| 配置 | 直接在 video 设备上配置 | 每个 subdev 分别配置 |
| 灵活性 | 低，硬件通路固定 | 高，可灵活组合 |
| 复杂度 | 简单 | 复杂 |

---

## 常见问题

### 1. 找不到 media 设备

```bash
ls /dev/media*
```

如果没有，检查内核配置：
- `CONFIG_MEDIA_CONTROLLER=y`
- `CONFIG_VIDEO_V4L2_SUBDEV_API=y`

### 2. 设置格式失败

- 先确认 entity 名字对不对（`media-ctl -p` 查看）
- 确认 pad 编号对不对
- 确认格式码（MEDIA_BUS_FMT_xxx）是该 subdev 支持的

### 3. 采集不到数据

- 检查链路是否启用（`MEDIA_LNK_FL_ENABLED`）
- 检查每个 subdev 的格式是否匹配
- 检查 Sensor 是否正常输出

---

## 相关知识

- [V4L2 子系统](v4l2)
- [MIPI CSI 接口](mipi-csi)
- [Camera Sensor 原理](sensor)

## 相关实验

- [#022 V4L2 MMAP 视频采集实验](/experiments/022-v4l2-mmap)

## 相关 Debug

- [VIDIOC_DQBUF Timeout](/debug/v4l2-dqbuf-timeout)
