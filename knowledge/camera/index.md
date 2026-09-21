---
title: Camera / V4L2
description: Camera 和 V4L2 知识：Sensor、MIPI CSI、V4L2、Media Controller、ISP
icon: 📷
---

# 📷 Camera / V4L2

> Camera 全链路知识：从 Sensor 到 MIPI 到 V4L2 到 ISP。
> 自动扫描本分类下所有文章，按日期倒序排列。

---

<KnowledgeArticleList category="camera" />

---

## Camera 完整链路

```
Sensor → I2C → Power/Clock/Reset → MIPI CSI → Media Controller
  → V4L2 Subdev → Video Node → VI → ISP → YUV → RGA → MPP → H.264 → RTSP
```

> 💡 每篇文章都会包含：原理说明、示例代码、常见问题、相关实验。

<script setup>
import KnowledgeArticleList from '../../.vitepress/components/KnowledgeArticleList.vue'
</script>
