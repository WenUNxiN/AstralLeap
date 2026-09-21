---
title: 视频编解码
description: 视频编解码知识：YUV、H.264、MPP、RGA、FFmpeg
icon: 🎬
---

# 🎬 视频编解码

> 从像素格式到编码原理到硬件实现，视频处理全链路知识。
> 自动扫描本分类下所有文章。

---

<KnowledgeArticleList category="video" />

---

## 视频处理全链路

```
原始图像 → YUV 格式 → RGA 缩放/转换 → MPP 编码 → H.264 码流
  → FFmpeg 封装 → RTSP/RTMP → 播放器解码 → 显示
```

<script setup>
import KnowledgeArticleList from '../../.vitepress/components/KnowledgeArticleList.vue'
</script>
