---
title: RTSP 推流测试
description: 基于 Live555 实现 H.264 码流 RTSP 推流
date: 2026-09-08
category:
  - Video
  - Network
tags:
  - RTSP
  - Live555
  - 流媒体
platform:
  - RK3566
status: doing
difficulty: intermediate
---

# #016 · RTSP 推流测试

## 实验目标

将 MPP 编码输出的 H.264 码流通过 RTSP 协议推流，在 PC 端用 VLC/ffplay 实时播放，验证端到端的视频链路。

---

## 实验环境

| 项目 | 内容 |
|---|---|
| 开发板 | RK3566 |
| 推流库 | Live555 |
| 编码格式 | H.264 (Baseline) |
| 分辨率 | 1080P |
| 码率 | 4 Mbps |
| 帧率 | 30 fps |
| 播放器 | ffplay / VLC |

---

## 整体链路

```
Sensor → V4L2 → RGA → MPP → H.264 → Live555 → RTSP → 播放器
   采集    格式转换  编码      打包      传输      解码播放
```

---

## 实验步骤

### Step 1：交叉编译 Live555

```bash title="shell"
# 下载 Live555 源码
wget http://www.live555.com/liveMedia/public/live555-latest.tar.gz
tar xzf live555-latest.tar.gz
cd live

# 生成配置文件
./genMakefiles linux-arm

# 交叉编译
make CROSS_COMPILE=aarch64-linux-gnu-
```

### Step 2：集成到项目中

```c title="rtsp_server.c 核心逻辑"
// 1. 创建 RTSPServer
RTSPServer* rtspServer = RTSPServer::createNew(env, 8554);

// 2. 创建 ServerMediaSession
ServerMediaSession* sms = ServerMediaSession::createNew(
    env, "live", "live", "H.264 stream");

// 3. 添加 H.264 子会话
sms->addSubsession(H264LiveServerMediaSubsession::createNew(
    env, *source, false));

// 4. 注册到 RTSP Server
rtspServer->addServerMediaSession(sms);
```

### Step 3：帧数据喂给 Live555

```c
// 编码得到一帧 H.264 数据后
// 找到对应的 Sink，把数据写进去
FramedSource* source = ...;
source->doGetNextFrame();
```

> ⚠️ Live555 的数据推送模型是「拉」的，需要实现一个 FramedSource 子类，在 doGetNextFrame 中提供帧数据。

### Step 4：启动推流并测试

```bash title="开发板启动 RTSP 服务"
./rtsp-server
# RTSP URL: rtsp://192.168.1.100:8554/live
```

```bash title="PC 端播放"
ffplay rtsp://192.168.1.100:8554/live
```

---

## 实验结果

### 功能验证

- ✅ ffplay 可以正常拉流播放
- ✅ VLC 可以正常播放
- ✅ 画面清晰，无花屏

### 延迟测试

| 测试项 | 延迟 |
|---|---|
| 端到端延迟 | ~300ms |
| 编码延迟 | ~50ms |
| 网络传输 | ~10ms |
| 播放缓冲 | ~200ms |

> 延迟主要来自播放器端的缓冲，可以通过调整播放器参数降低。

---

## 当前问题

1. ⬜ 音频还没接入，目前只有视频
2. ⬜ 多路并发推流稳定性待验证
3. ⬜ GOP 太长导致首帧出图慢

---

## 下一步计划

1. 加入 AAC 音频推流
2. 优化首帧出图速度（SPS/PPS 及时发送）
3. 测试多路并发
4. 对比 GStreamer 的 RTSP 方案

---

## 相关知识

- [H.264 编码](/knowledge/video/h264)
- RTSP 协议
- RTP 协议

## 相关实验

- [#020 MPP H.264 硬编码实验](/experiments/020-mpp-h264)
