---
title: 实验记录
description: 嵌入式 Linux 音视频实验记录，每次一个明确目标
---

# 🧪 实验记录

> 每次实验只完成一个明确目标，完整记录环境、步骤、代码、结果与结论。
> 自动扫描 `experiments/` 目录下所有文章，按日期倒序排列。

---

<ExperimentGrid />

---

## 实验编号规则

| 编号范围 | 分类 | 说明 |
|---|---|---|
| 001-009 | C / Linux 基础 | 语言、系统、工具 |
| 010-019 | 驱动开发 | I2C、SPI、设备树 |
| 020-029 | Camera / V4L2 | Sensor、采集、ISP |
| 030-039 | V4L2 进阶 | 多平面、M2M |
| 040-049 | MPP / 视频编解码 | H.264、H.265、RGA |
| 050-059 | FFmpeg | 转码、滤镜、推流 |
| 060-069 | RTSP / 网络 | Live555、RTP |
| 070-079 | 音频 | ALSA、AAC |
| 080-089 | AI / NPU | RKNN、模型部署 |

<script setup>
import ExperimentGrid from '../.vitepress/components/ExperimentGrid.vue'
</script>
