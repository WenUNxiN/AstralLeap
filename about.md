---
layout: page
title: 关于我
sidebar: false
---

<script setup>
import { ref } from 'vue'

const skills = [
  { name: 'C / C++ / Embedded C', level: 90 },
  { name: 'RTOS (FreeRTOS)', level: 85 },
  { name: 'Linux 驱动 / 移植', level: 80 },
  { name: '硬件设计 (KiCad)', level: 75 },
  { name: 'LVGL / GUI 开发', level: 70 },
  { name: 'Python 上位机', level: 80 },
  { name: '边缘 AI 部署 (RV1106/NPU)', level: 65 },
]

const timeline = [
  { year: '2026', event: '星序智能手表项目启动 — 全栈开发：硬件 → 固件 → Linux → 移动端' },
  { year: '2026', event: '泰山派 + MIPI 屏幕移植 LVGL，从设备树到显示驱动的全链路打通' },
  { year: '2026', event: 'Luckfox Pico (RV1106) 交叉编译环境搭建与 AI 模型部署' },
]
</script>

<div class="about-container">

# 👋 你好，我是 Stellan W

嵌入式工程师，热爱软硬件全栈开发。这个博客记录我在嵌入式领域的探索与实践。

## 🛠️ 技术栈

<div class="skills-grid">
  <div v-for="skill in skills" :key="skill.name" class="skill-item">
    <div class="skill-header">
      <span>{{ skill.name }}</span>
      <span class="skill-percent">{{ skill.level }}%</span>
    </div>
    <div class="skill-bar">
      <div class="skill-fill" :style="{ width: skill.level + '%' }"></div>
    </div>
  </div>
</div>

## 📅 时间线

<div class="timeline">
  <div v-for="item in timeline" :key="item.year + item.event" class="timeline-item">
    <div class="timeline-year">{{ item.year }}</div>
    <div class="timeline-dot"></div>
    <div class="timeline-event">{{ item.event }}</div>
  </div>
</div>

## 📬 联系方式

- GitHub: [@WenUNxiN](https://github.com/WenUNxiN)
- 博客: [星跃 | Astral Leap](https://wenunxin.github.io/AstralLeap/)

</div>

<style scoped>
.about-container {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.about-container h1 {
  font-size: 2rem;
  background: linear-gradient(120deg, #bb9af7, #7dcfff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
}

.about-container h2 {
  font-size: 1.3rem;
  color: #c0caf5;
  margin: 2rem 0 1rem;
  padding-left: 0.75rem;
  border-left: 3px solid #7aa2f7;
}

.skills-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.skill-item {
  background: rgba(36, 40, 59, 0.5);
  border-radius: 10px;
  padding: 14px 18px;
  border: 1px solid rgba(122, 162, 247, 0.08);
  transition: all 0.3s ease;
}

.skill-item:hover {
  border-color: rgba(122, 162, 247, 0.25);
  transform: translateX(4px);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #c0caf5;
  margin-bottom: 8px;
}

.skill-percent {
  color: #7aa2f7;
  font-weight: 600;
  font-size: 0.82rem;
}

.skill-bar {
  height: 6px;
  background: rgba(122, 162, 247, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: linear-gradient(90deg, #7aa2f7, #bb9af7);
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.timeline {
  margin: 20px 0;
  padding-left: 8px;
}

.timeline-item {
  margin-bottom: 20px;
  padding-left: 24px;
  position: relative;
  border-left: 2px solid rgba(122, 162, 247, 0.2);
}

.timeline-item:last-child {
  border-left-color: transparent;
}

.timeline-year {
  font-size: 0.85rem;
  color: #7aa2f7;
  font-weight: 700;
  margin-bottom: 4px;
}

.timeline-dot {
  position: absolute;
  left: -5px;
  top: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #7aa2f7;
  box-shadow: 0 0 0 3px rgba(122, 162, 247, 0.2);
}

.timeline-event {
  font-size: 0.9rem;
  color: #a9b1d6;
  line-height: 1.6;
}

.about-container ul {
  list-style: none;
  padding: 0;
}

.about-container ul li {
  padding: 8px 0;
  font-size: 0.95rem;
  color: #a9b1d6;
}

.about-container ul li a {
  color: #7aa2f7;
  text-decoration: none;
}

.about-container ul li a:hover {
  text-decoration: underline;
}
</style>
