# AstralLeap VitePress 优化方案

> 目标：把现有的「星跃 | Astral Leap」从“个人博客 + 项目展示站”升级为 **Embedded Linux / Camera / Audio & Video / AI 技术知识库 + 实验记录库 + 项目作品集**。
>
> 本方案基于当前网站总结文件中的实际结构制定。当前站点使用 VitePress 2.0.0-alpha.16，采用 zh-CN、`/AstralLeap/` 子路径部署，已有 projects、blog、`.vitepress` 等目录；当前有 4 个展示项目、24 个项目文档页、3 篇博客文章、35 个 Markdown 页面和 8 个自研 Vue 组件。fileciteturn1file0L103-L117

---

# 1. 当前网站现状

## 1.1 已经具备的基础

当前站点已经不是一个简单的 VitePress 默认模板，而是已经有比较完整的工程化基础：

- VitePress + Vue 3
- 本地搜索
- 项目 JSON 驱动的动态侧边栏
- ProjectShowcase 项目卡片
- 自定义代码块文件名
- 星空视觉主题
- BlogHero / BlogStats / BlogCategories / ArticleList / Discussion / Breadcrumb
- SEO 基础配置

这些工程化能力已经存在，不建议为了“重新设计”而全部推翻。当前项目系统是由 `project.json` 驱动，并且新增项目可以自动接入；这是后续扩展知识库时应该保留的基础。fileciteturn1file0L180-L190

## 1.2 当前主要问题

当前站点内容侧的主要问题比框架问题明显：

1. **博客内容偏少**
   - 当前只有 3 篇文章。
   - “硬件设计”“项目复盘”等分类还没有形成内容体系。fileciteturn1file0L170-L177
2. **项目页面存在占位内容**
   - Edge AI、Smart Home、Open Scope 主要还是框架。
   - AstralOrder 主页详情仍存在占位文本。fileciteturn1file0L193-L203
3. **项目编号存在断档**
   - 当前为 1 / 3 / 4 / 5。
4. **“博客”和“项目文档”之间缺少技术知识库层**
   - 目前更像“作品展示站”。
   - 下一步应该增加 Linux / Driver / Camera / Video / Audio / AI / Rockchip 等知识体系。
5. **学习过程没有形成可验证记录**
   - 需要增加实验记录、Debug 记录、平台验证记录、性能测试记录。
6. **项目、知识、实验、Bug 之间没有建立关联**
   - 后续应该让一篇实验记录可以关联到项目、平台、驱动、工具和 Bug。

---

# 2. 最终定位

建议把网站定位从：

> 个人博客 + 项目展示

升级成：

> **AstralLeap Embedded Lab**
>
> Embedded Linux / Driver / Camera / Audio & Video / AI

核心目标：

```text
                 AstralLeap Embedded Lab
                           │
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓
      Knowledge          Projects          Experiments
        │                  │                  │
        ↓                  ↓                  ↓
 Linux / Driver       Camera / IPC       V4L2
 Camera / Video       Audio / Video      MPP
 Audio / AI           AI / NVR           FFmpeg
 Rockchip             Hardware           RTSP
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ↓
                         Debug
                           │
                    Problem → Analysis
                           ↓
                       Solution
                           ↓
                       Verified
```

最终目标不是“文章很多”，而是：

> **每一个学过的知识点、做过的实验、踩过的 Bug、完成的项目，都可以被检索、复现和验证。**

---

# 3. 推荐的新目录结构

建议逐步从现在的：

```text
AstralLeap/
├── index.md
├── projects/
├── blog/
└── .vitepress/
```

升级为：

```text
AstralLeap/
│
├── index.md
│
├── roadmap/
│   ├── index.md
│   ├── learning-roadmap.md
│   ├── embedded-linux-roadmap.md
│   ├── camera-roadmap.md
│   └── audio-video-roadmap.md
│
├── knowledge/
│   ├── index.md
│   │
│   ├── c/
│   │   ├── index.md
│   │   ├── pointer.md
│   │   ├── memory.md
│   │   ├── struct.md
│   │   ├── function-pointer.md
│   │   └── data-structure.md
│   │
│   ├── linux/
│   │   ├── index.md
│   │   ├── file-io.md
│   │   ├── process.md
│   │   ├── thread.md
│   │   ├── ipc.md
│   │   ├── mmap.md
│   │   ├── socket.md
│   │   └── shell.md
│   │
│   ├── driver/
│   │   ├── index.md
│   │   ├── gpio.md
│   │   ├── i2c.md
│   │   ├── spi.md
│   │   ├── uart.md
│   │   ├── device-tree.md
│   │   └── linux-driver.md
│   │
│   ├── camera/
│   │   ├── index.md
│   │   ├── sensor.md
│   │   ├── mipi-csi.md
│   │   ├── v4l2.md
│   │   ├── media-controller.md
│   │   └── isp.md
│   │
│   ├── video/
│   │   ├── index.md
│   │   ├── yuv.md
│   │   ├── h264.md
│   │   ├── h265.md
│   │   ├── mpp.md
│   │   ├── rga.md
│   │   ├── ffmpeg.md
│   │   ├── rtp.md
│   │   ├── rtsp.md
│   │   └── drm.md
│   │
│   ├── audio/
│   │   ├── index.md
│   │   ├── alsa.md
│   │   ├── pcm.md
│   │   ├── aac.md
│   │   └── av-sync.md
│   │
│   └── ai/
│       ├── index.md
│       ├── rknn.md
│       ├── quantization.md
│       └── deployment.md
│
├── platforms/
│   ├── index.md
│   │
│   ├── rv1106g2/
│   ├── rv1126b/
│   ├── rk3566/
│   ├── rk3588/
│   └── hi3516cv610/
│
├── projects/
│   ├── 1-smart-watch/
│   ├── 3-edge-ai/
│   ├── 4-smart-home/
│   ├── 5-open-scope/
│   │
│   ├── camera-rtsp/
│   ├── audio-video/
│   ├── ai-camera/
│   └── nvr/
│
├── experiments/
│   ├── index.md
│   ├── 001-linux-file-io.md
│   ├── 002-pthread.md
│   ├── 003-mmap.md
│   ├── 004-socket.md
│   ├── 010-v4l2-open.md
│   ├── 011-v4l2-format.md
│   ├── 012-v4l2-mmap.md
│   ├── 020-camera-i2c.md
│   ├── 021-camera-reset.md
│   ├── 030-mpp-init.md
│   └── ...
│
├── debug/
│   ├── index.md
│   ├── camera/
│   ├── v4l2/
│   ├── mpp/
│   ├── ffmpeg/
│   ├── network/
│   └── system/
│
├── cheatsheet/
│   ├── index.md
│   ├── linux.md
│   ├── git.md
│   ├── v4l2.md
│   ├── media.md
│   ├── ffmpeg.md
│   ├── mpp.md
│   └── network.md
│
├── blog/
│   └── posts/
│
└── .vitepress/
```

---

# 4. 为什么要这样改

不要把所有内容都继续放进 `blog/`。

建议明确区分：

| 内容 | 放在哪里 | 目的 |
|---|---|---|
| 概念知识 | `knowledge/` | 长期知识库 |
| 平台资料 | `platforms/` | 板卡/SDK/SoC 专属知识 |
| 完整项目 | `projects/` | 作品集 |
| 单次实验 | `experiments/` | 学习过程和可复现记录 |
| Bug 排查 | `debug/` | Debug 数据库 |
| 命令速查 | `cheatsheet/` | 快速查询 |
| 个人思考/总结 | `blog/` | 博客文章 |

核心原则：

> **Blog 写“观点和总结”，Knowledge 写“知识”，Experiment 写“我做了什么”，Debug 写“我遇到了什么问题”，Project 写“我最终做成了什么”。**

---

# 5. 首页重新设计

当前首页已经有 Hero + 项目卡片展示。fileciteturn1file0L120-L128

建议保留现有视觉风格，不需要彻底换掉星空主题。

首页结构调整为：

```text
Hero
 ↓
个人技术方向
 ↓
当前学习路线
 ↓
核心技术栈
 ↓
开发平台
 ↓
最新项目
 ↓
最新实验
 ↓
最新 Debug
 ↓
最新文章
 ↓
GitHub / 项目入口
```

推荐首页文案：

```markdown
# AstralLeap

## Embedded Linux Lab

从 MCU 到 Embedded Linux，
专注 Linux Driver / Camera / Audio & Video / AI。

[学习路线] [知识库] [项目] [实验记录]
```

下面增加：

```text
Core
C / C++ / Linux

Driver
GPIO / I2C / SPI / Device Tree / V4L2

Camera
MIPI CSI / Sensor / ISP / V4L2

Video
YUV / H.264 / H.265 / MPP / RGA / FFmpeg / RTSP

Audio
ALSA / PCM / AAC / A/V Sync

AI
RKNN / NPU / Quantization
```

---

# 6. 你的开发板必须单独建立平台库

你目前实际拥有：

```text
RV1106G2
RV1126B
RK3566
RK3588
Hi3516CV610
```

建议建立：

```text
platforms/
├── index.md
├── rv1106g2/
├── rv1126b/
├── rk3566/
├── rk3588/
└── hi3516cv610/
```

每个平台统一结构：

```text
platform/
├── index.md
├── hardware.md
├── boot.md
├── build.md
├── toolchain.md
├── uboot.md
├── kernel.md
├── device-tree.md
├── gpio.md
├── i2c.md
├── camera.md
├── mpp.md
└── ai.md
```

这样以后可以横向比较：

```text
             Embedded Linux
                    │
       ┌────────────┼────────────┐
       ↓            ↓            ↓
   RV1106G2      RK3566       RK3588
       │            │            │
      MPP          MPP          MPP
       │            │            │
     Camera       Camera       Camera
```

---

# 7. Camera 应该成为你的重点知识库

结合你目前的学习方向，建议 Camera 单独形成完整体系：

```text
knowledge/camera/

01-camera-basic
02-sensor
03-i2c-control
04-reset-pwdn
05-mclk
06-mipi-csi
07-v4l2
08-media-controller
09-subdev
10-video-node
11-buffer
12-mmap
13-dmabuf
14-isp
15-rkisp
```

以后你可以形成完整链路：

```text
Sensor
 ↓
I2C
 ↓
Power / Clock / Reset
 ↓
MIPI CSI
 ↓
Media Controller
 ↓
V4L2 Subdev
 ↓
Video Node
 ↓
VI
 ↓
ISP
 ↓
YUV
 ↓
RGA
 ↓
MPP
 ↓
H.264 / H.265
 ↓
RTSP
```

这是以后你做嵌入式音视频项目时非常重要的一条主线。

---

# 8. Video 知识库

建议：

```text
knowledge/video/

├── video-basic.md
├── pixel-format.md
├── yuv.md
├── nv12.md
├── nv21.md
├── yuyv.md
├── h264.md
├── h265.md
├── nalu.md
├── sps-pps.md
├── idr.md
├── gop.md
├── bitrate.md
├── mpp.md
├── rga.md
├── ffmpeg.md
├── rtp.md
├── rtsp.md
├── timestamp.md
├── av-sync.md
└── zero-copy.md
```

重点不是文章数量，而是最终能够回答：

```text
Camera输入是什么？
 ↓
YUV是什么？
 ↓
NV12怎么排列？
 ↓
RGA为什么需要？
 ↓
MPP怎么编码？
 ↓
H.264 NALU是什么？
 ↓
RTP怎么传？
 ↓
RTSP怎么建立会话？
 ↓
VLC为什么可以播放？
```

---

# 9. 实验记录系统

建立：

```text
experiments/
```

编号建议采用：

```text
001-009  C / Linux
010-019  Driver
020-029  Camera
030-039  V4L2
040-049  MPP
050-059  FFmpeg
060-069  RTSP
070-079  Audio
080-089  AI
```

每次实验只完成一个明确目标。

例如：

```text
020-v4l2-open.md
021-v4l2-format.md
022-v4l2-mmap.md
023-v4l2-stream.md
```

不要写：

> “今天学习 V4L2。”

而应该写：

> “在 RK3566 上使用 V4L2 MMAP 完成一帧 YUYV 图像采集。”

---

# 10. 实验模板

每个实验统一：

```markdown
---
title: V4L2 MMAP采集实验
description: 在 RK3566 上使用 V4L2 MMAP 完成视频采集
---

# V4L2 MMAP采集实验

## 实验目标

---

## 实验环境

| 项目 | 内容 |
|---|---|
| Board | RK3566 |
| Kernel | 5.10.x |
| Camera | xxx |
| Sensor | xxx |
| Format | NV12 |
| Resolution | 1920×1080 |

## 实验原理

```text
Camera
 ↓
V4L2
 ↓
MMAP
 ↓
User Space
```

## 实验步骤

### Step 1

```bash
command
```

### Step 2

```bash
command
```

## 实验代码

```c
code
```

## 实验结果

### Expected

...

### Actual

...

## 问题

...

## Debug过程

...

## 根因

...

## 解决方案

...

## 性能数据

| 项目 | 数据 |
|---|---:|
| FPS | |
| CPU | |
| Memory | |
| Latency | |

## 最终结论

...

## 可复现条件

...

## 相关知识

- V4L2
- MMAP
- Buffer

## 下一步

...
```

---

# 11. Debug 数据库

建立：

```text
debug/
├── camera/
├── v4l2/
├── mpp/
├── ffmpeg/
├── network/
└── system/
```

每个 Bug 使用统一格式：

```markdown
# VIDIOC_DQBUF Timeout

## 现象

...

## 环境

Board:
Kernel:
SDK:
Camera:

## 错误日志

```text
log
```

## 初步判断

1.
2.
3.

## 排查过程

### 1. 检查电源

结果：

### 2. 检查I2C

结果：

### 3. 检查MIPI

结果：

### 4. 检查V4L2

结果：

## 根因

...

## 解决方案

...

## 验证

...

## 最终状态

🟢 Verified

## 相关知识

- V4L2
- MIPI
- Sensor
```

---

# 12. 必须加入“验证状态”

推荐统一使用：

```text
🟢 Verified
🟡 Learning
🔴 Failed
⚠️ Platform Specific
📌 Important
```

例如：

```markdown
Status: 🟢 Verified

Platform: RV1106G2
Kernel: 5.10
SDK: xxx

Verified: 2026-09-21
```

尤其要区分：

> **网上看到的内容**

和：

> **自己在板子上验证过的内容。**

---

# 13. 建立平台兼容矩阵

这是非常适合你的一个功能。

例如：

| Feature | RV1106G2 | RV1126B | RK3566 | RK3588 | Hi3516CV610 |
|---|---|---|---|---|---|
| V4L2 | ✅ | ✅ | ✅ | ✅ | ? |
| MPP | ✅ | ✅ | ✅ | ✅ | — |
| RGA | ✅ | ? | ✅ | ✅ | — |
| RKNN | ✅ | ✅ | ? | ✅ | — |
| FFmpeg | ✅ | ✅ | ✅ | ✅ | ? |
| RTSP | ✅ | ✅ | ✅ | ✅ | ✅ |
| ALSA | ? | ? | ? | ? | ? |

注意：

> 没有实际验证的数据不要填写“✅”。

使用：

```text
✅ 已验证
🟡 理论支持/未验证
❌ 不支持
— 不适用
```

这样这个表才有长期价值。

---

# 14. Project 项目体系

当前已经有：

- AstralOrder 智能手表
- Edge AI
- Smart Home
- Open Scope

当前项目文档数量和完成情况并不均衡，AstralOrder 最完整，而其他项目多数仍是框架。fileciteturn1file0L135-L167

不要急着继续增加很多项目。

建议下一阶段增加真正与你新技术方向一致的项目：

```text
projects/

camera-rtsp/
├── README.md
├── architecture.md
├── hardware.md
├── software.md
├── camera.md
├── encoder.md
├── rtsp.md
├── debug.md
└── performance.md
```

第一个核心项目建议：

# Camera → H.264 → RTSP

完整链路：

```text
Sensor
 ↓
MIPI CSI
 ↓
VI / V4L2
 ↓
RGA
 ↓
MPP
 ↓
H.264
 ↓
RTP
 ↓
RTSP
 ↓
VLC
```

第二个：

# Camera + AI

```text
Sensor
 ↓
VI
 ↓
RGA
 ├────────→ Display
 ↓
NPU
 ↓
Detection
 ↓
OSD
 ↓
MPP
 ↓
RTSP
```

第三个：

# Audio + Video

```text
Camera ──→ H.264 ──┐
                    ├→ Mux / RTSP
ALSA ──→ AAC ──────┘
```

---

# 15. Blog 的定位需要改变

Blog 不要再承担所有技术知识。

建议：

```text
Blog
├── 学习记录
├── 项目复盘
├── 技术总结
├── 硬件设计
└── 工具效率
```

例如：

### Blog

> 我是如何从 MCU 转向 Embedded Linux 音视频开发的

### Knowledge

> V4L2 Buffer 工作机制

### Experiment

> RK3566 V4L2 MMAP 实验

### Debug

> VIDIOC_DQBUF timeout 排查

### Project

> RK3566 Camera → H.264 → RTSP

这五类内容之间形成关联。

---

# 16. 建议给每篇 Markdown 加 Frontmatter

统一：

```yaml
---
title: V4L2 MMAP Buffer
description: V4L2 MMAP Buffer工作机制与实验
date: 2026-09-21

category:
  - Camera
  - V4L2

tags:
  - Linux
  - V4L2
  - MMAP

platform:
  - RK3566

status: verified

difficulty: intermediate

related:
  - /knowledge/camera/v4l2
  - /experiments/022-v4l2-mmap
---
```

建议字段：

```text
title
description
date
category
tags
platform
status
difficulty
related
```

这样以后可以自动生成：

- 标签页
- 分类页
- 平台页
- 搜索
- 相关文章
- 实验索引

---

# 17. 建立“技术地图”

增加：

```text
knowledge/index.md
```

内容：

```text
Embedded Linux
│
├── C/C++
│
├── Linux
│   ├── Process
│   ├── Thread
│   ├── IPC
│   └── Network
│
├── Driver
│   ├── GPIO
│   ├── I2C
│   ├── SPI
│   ├── UART
│   └── Device Tree
│
├── Camera
│   ├── Sensor
│   ├── MIPI
│   ├── V4L2
│   └── ISP
│
├── Video
│   ├── YUV
│   ├── H264
│   ├── H265
│   ├── MPP
│   ├── RGA
│   ├── FFmpeg
│   └── RTSP
│
├── Audio
│   ├── ALSA
│   ├── PCM
│   └── AAC
│
└── AI
    ├── RKNN
    ├── NPU
    └── Quantization
```

---

# 18. 建立学习路线页

建议：

```text
roadmap/
├── index.md
├── embedded-linux-roadmap.md
├── camera-roadmap.md
└── audio-video-roadmap.md
```

总路线：

```text
C
 ↓
Linux
 ↓
Linux System Programming
 ↓
Driver
 ↓
Device Tree
 ↓
V4L2
 ↓
Camera
 ↓
YUV
 ↓
H264/H265
 ↓
MPP
 ↓
FFmpeg
 ↓
RTP/RTSP
 ↓
ALSA
 ↓
Audio/Video Sync
 ↓
NPU/RKNN
 ↓
完整IPC项目
```

---

# 19. 你现在不要立刻全部重构

建议分四个阶段。

## Phase 1：整理现有内容

时间：1～2天

完成：

- [ ] 修复 AstralOrder 占位详情页
- [ ] 处理项目编号 1/3/4/5 的断档
- [ ] 给现有项目统一 Frontmatter
- [ ] 清理 Lorem ipsum
- [ ] 给现有 3 篇博客统一 Frontmatter
- [ ] 保留现有 ProjectShowcase
- [ ] 保留现有动态 sidebar

当前审计已经明确指出这些问题。fileciteturn1file0L193-L203

---

# 20. Phase 2：建立知识库

时间：1～2周

优先建立：

```text
knowledge/
├── c/
├── linux/
├── driver/
├── camera/
└── video/
```

第一批文章：

```text
C指针
Linux文件IO
Linux进程
Linux线程
mmap
Socket
GPIO
I2C
SPI
Device Tree
V4L2
YUV
H264
MPP
FFmpeg
RTSP
```

不要一次写很多。

每学完一个知识点就写一个。

---

# 21. Phase 3：建立实验系统

时间：持续

建立：

```text
experiments/
debug/
```

每次实验必须留下：

```text
实验目标
环境
代码
命令
日志
结果
问题
Debug
结论
```

以后你的博客内容会自然产生：

```text
学习
 ↓
实验
 ↓
Debug
 ↓
总结
 ↓
项目
```

---

# 22. Phase 4：做完整音视频项目

最终重点：

## Project 01

```text
RV1106G2
Camera → H264 → RTSP
```

## Project 02

```text
RV1126B
Camera → AI → OSD → H264 → RTSP
```

## Project 03

```text
RK3566
Camera + Audio → H264/AAC → RTSP
```

## Project 04

```text
RK3588
多路Camera → Decode → AI → Display
```

## Project 05

```text
跨平台 Camera Framework
```

这样你的知识库、实验库和项目库最终会汇合。

---

# 23. Git 规范

网站本身也应该当作工程维护。

推荐：

```text
feat: 新增功能
docs: 文档
fix: 修复
refactor: 重构
style: 样式
chore: 工程配置
experiment: 实验记录
debug: Debug记录
project: 项目更新
```

例如：

```bash
git commit -m "docs: add V4L2 MMAP experiment"
git commit -m "experiment: add RV1106 MPP encoder test"
git commit -m "debug: record camera dqbuf timeout"
git commit -m "project: add camera RTSP pipeline"
```

---

# 24. 文件命名规范

统一使用：

```text
kebab-case
```

例如：

```text
device-tree.md
audio-video-sync.md
v4l2-buffer.md
camera-reset.md
mpp-encoder.md
rtsp-server.md
```

不要混用：

```text
V4L2.md
v4l2Buffer.md
v4l2_buffer.md
```

---

# 25. 图片和实验附件

建议：

```text
public/
├── images/
│   ├── camera/
│   ├── v4l2/
│   ├── mpp/
│   ├── hardware/
│   └── projects/
│
├── diagrams/
│   ├── camera/
│   ├── video/
│   └── system/
│
└── logs/
```

图片命名：

```text
rv1106-camera-pipeline.png
rk3566-v4l2-flow.png
mpp-h264-pipeline.png
camera-i2c-waveform.png
```

---

# 26. Debug 内容不要只放截图

错误截图可以有，但必须同时保留文本：

```text
[ERROR] VIDIOC_DQBUF failed
errno=110
Connection timed out
```

不要只放：

```text
![error](xxx.png)
```

因为未来搜索系统无法很好地检索图片中的错误信息。

---

# 27. 每个项目都增加“架构图”

例如：

```text
                 Camera
                    │
                 MIPI CSI
                    │
                    ↓
                  V4L2
                    │
                    ↓
                    VI
                    │
             ┌──────┴──────┐
             ↓             ↓
            RGA           AI
             │             │
             └──────┬──────┘
                    ↓
                   OSD
                    │
                    ↓
                  MPP
                    │
                    ↓
                  H264
                    │
                    ↓
                  RTSP
```

架构图比大量文字更容易表达整个项目。

---

# 28. 建立性能数据库

以后做音视频项目时必须记录：

```text
FPS
Resolution
Bitrate
CPU
Memory
Latency
Temperature
Power
Dropped Frames
Encoding Time
Decoding Time
```

例如：

| Platform | Resolution | FPS | Codec | CPU | Memory |
|---|---:|---:|---|---:|---:|
| RV1106 | 1920×1080 | 30 | H.264 | | |
| RV1126B | 1920×1080 | 30 | H.264 | | |
| RK3566 | 1920×1080 | 30 | H.264 | | |
| RK3588 | 3840×2160 | 30 | H.265 | | |

**没有实测数据不要填写。**

---

# 29. 网站最重要的三个数据库

最终建议把网站理解为三个数据库：

## Knowledge Database

```text
“这个东西是什么？”
```

## Experiment Database

```text
“我怎么验证？”
```

## Debug Database

```text
“出了问题怎么办？”
```

再加一个：

## Project Database

```text
“我最终做成了什么？”
```

四者关系：

```text
Knowledge
    ↓
Experiment
    ↓
Debug
    ↓
Project
    ↓
Knowledge反哺
```

---

# 30. 最终网站结构

最终建议形成：

```text
AstralLeap Embedded Lab
│
├── 🧭 Roadmap
│
├── 📚 Knowledge
│   ├── C/C++
│   ├── Linux
│   ├── Driver
│   ├── Camera
│   ├── Video
│   ├── Audio
│   └── AI
│
├── 💻 Platforms
│   ├── RV1106G2
│   ├── RV1126B
│   ├── RK3566
│   ├── RK3588
│   └── Hi3516CV610
│
├── 🧪 Experiments
│
├── 🐛 Debug
│
├── 🚀 Projects
│
├── ⚡ Cheatsheet
│
└── ✍️ Blog
```

---

# 31. 第一阶段不要做的事情

暂时不要：

- ❌ 为了好看重新做整套主题
- ❌ 再增加很多 Vue 组件
- ❌ 再增加几十个空项目
- ❌ 复制网上大量教程
- ❌ 为了 SEO 大量生成文章
- ❌ 每天强迫自己写博客
- ❌ 同时维护 RV1106 / RV1126 / RK3566 / RK3588 的所有内容

当前站点已经有不错的工程化组件基础；当前真正需要解决的是**内容体系和可验证技术资产**，而不是继续堆 UI。fileciteturn1file0L180-L190

---

# 32. 你现在第一周应该做什么

## Day 1

整理：

```text
项目
博客
Frontmatter
项目编号
占位内容
```

## Day 2

建立：

```text
knowledge/
platforms/
experiments/
debug/
cheatsheet/
```

## Day 3

写：

```text
knowledge/linux/
knowledge/driver/
```

## Day 4

开始：

```text
knowledge/camera/
```

重点：

```text
I2C
Sensor
MIPI
V4L2
```

## Day 5

开始：

```text
knowledge/video/
```

重点：

```text
YUV
H264
MPP
FFmpeg
RTSP
```

## Day 6

做第一个实验：

```text
RV1106G2
Camera
 ↓
V4L2
 ↓
YUV
```

## Day 7

把实验完整沉淀：

```text
Experiment
+
Debug
+
Knowledge
```

---

# 33. 第一阶段完成标准

不要以“写了多少文章”衡量。

第一阶段完成的标准应该是：

```text
[ ] 首页定位明确

[ ] Knowledge目录建立

[ ] Platforms目录建立

[ ] Experiments目录建立

[ ] Debug目录建立

[ ] Cheatsheet目录建立

[ ] Frontmatter统一

[ ] 现有项目占位内容清理

[ ] AstralOrder详情页完成

[ ] 项目编号整理

[ ] 第一篇V4L2知识文章

[ ] 第一篇V4L2实验

[ ] 第一篇Camera Debug记录

[ ] 第一套Camera→V4L2流程跑通
```

---

# 34. 最终目标

你最终应该让一个陌生的嵌入式工程师打开网站后，可以看到：

```text
我是谁
 ↓
我学习什么
 ↓
我使用什么平台
 ↓
我掌握哪些技术
 ↓
我做过什么实验
 ↓
我解决过什么问题
 ↓
我做过什么项目
 ↓
项目如何实现
 ↓
代码在哪里
 ↓
实验能否复现
```

这比“文章很多”更重要。

---

# 35. 一条最终原则

以后你每学一个东西，都问自己：

> **它能不能成为一份可复现的技术资产？**

如果答案是可以，就沉淀为：

```text
知识 → Knowledge
实验 → Experiment
问题 → Debug
成果 → Project
总结 → Blog
```

最终形成：

```text
             AstralLeap
                  │
        ┌─────────┴─────────┐
        ↓                   ↓
    Technical             Portfolio
    Knowledge              Projects
        │                   │
        ├── Linux           ├── Camera
        ├── Driver          ├── RTSP
        ├── Camera          ├── AI
        ├── Video           ├── Audio
        └── AI              └── Hardware
                  │
                  ↓
              Experiments
                  │
                  ↓
                Debug
                  │
                  ↓
              Verified
```

**这套结构建议作为 AstralLeap 后续 1～2 年的长期架构，不需要一次性全部实现。先把目录、模板和工作流建立起来，然后随着你实际学习 Embedded Linux / Camera / 音视频逐步填充。**
