---
title: Camera / V4L2
description: Camera 和 V4L2 知识：Sensor、MIPI CSI、V4L2、Media Controller、ISP
icon: 📷
pageClass: knowledge-category
aside: false
---

<div class="knowledge-category-header">

<p class="knowledge-overline">KNOWLEDGE / CAMERA & VIDEO</p>

# Camera / V4L2

Camera 全链路知识：从 Sensor 到 MIPI CSI，再到 V4L2 与 ISP。把图像如何从硬件进入应用，逐层拆开。

</div>

<KnowledgeArticleList category="camera" />

## Camera 完整链路

```
Sensor → I2C → Power/Clock/Reset → MIPI CSI → Media Controller
  → V4L2 Subdev → Video Node → VI → ISP → YUV → RGA → MPP → H.264 → RTSP
```

<script setup>
import KnowledgeArticleList from '../../../.vitepress/components/KnowledgeArticleList.vue'
</script>
