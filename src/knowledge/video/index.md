---
title: 视频编解码
description: 视频编解码知识：YUV、H.264、MPP、RGA、FFmpeg
icon: 🎬
pageClass: knowledge-category
aside: false
---

<div class="knowledge-category-header">

<p class="knowledge-overline">KNOWLEDGE / VIDEO PROCESSING</p>

# 视频编解码

从像素格式，到编码原理与硬件实现。围绕 YUV、H.264、MPP、RGA 与 FFmpeg，串起视频处理的完整链路。

</div>

<KnowledgeArticleList category="video" />

## 视频处理全链路

```
原始图像 → YUV 格式 → RGA 缩放/转换 → MPP 编码 → H.264 码流
  → FFmpeg 封装 → RTSP/RTMP → 播放器解码 → 显示
```

<script setup>
import KnowledgeArticleList from '../../../.vitepress/components/KnowledgeArticleList.vue'
</script>
