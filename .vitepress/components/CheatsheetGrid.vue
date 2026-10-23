<script setup>
import { withBase } from 'vitepress'
import AboutIcon from './AboutIcon.vue'
import { data as cheatsheetList } from '../data/cheatsheet.data.ts'
import { formatShortDate } from '../utils/content-loader'
import '../theme/collections.css'

const tools = {
  linux: { icon: 'terminal', label: 'SYSTEM & SHELL', scenes: ['文件与目录', '进程与网络', '设备与驱动'], command: 'ls · grep · ps · dmesg' },
  git: { icon: 'code', label: 'VERSION CONTROL', scenes: ['提交与历史', '分支与合并', '撤销与回退'], command: 'status · log · branch · rebase' },
  v4l2: { icon: 'camera', label: 'CAMERA DEBUGGING', scenes: ['设备与格式', '采集测试', '控件与调试'], command: 'v4l2-ctl · media-ctl · i2cdetect' },
  ffmpeg: { icon: 'film', label: 'MEDIA TOOLKIT', scenes: ['格式与编码', '滤镜与截图', '推流与拉流'], command: 'ffmpeg · ffprobe · ffplay' }
}
const fallback = { icon: 'book', label: 'QUICK REFERENCE', scenes: [], command: '' }
function toolFor(slug) { return tools[slug] || fallback }
</script>

<template>
  <div class="collection-cards collection-cheatsheets">
    <a v-for="item in cheatsheetList" :key="item.slug" :href="withBase(item.url)" class="collection-card collection-cheat">
      <div class="collection-card-top"><span class="collection-tool-icon"><AboutIcon :name="toolFor(item.slug).icon" /></span><span class="collection-record-id">{{ toolFor(item.slug).label }}</span></div>
      <h3>{{ item.title }}</h3>
      <p class="collection-card-description">{{ item.description || item.excerpt }}</p>
      <div class="collection-card-tags"><span v-for="scene in toolFor(item.slug).scenes" :key="scene">{{ scene }}</span></div>
      <code v-if="toolFor(item.slug).command" class="collection-command">{{ toolFor(item.slug).command }}</code>
      <div class="collection-card-footer"><time v-if="item.date" class="collection-card-date" :datetime="item.date">{{ formatShortDate(item.date) }}</time><span v-else class="collection-card-date">常用操作，按场景整理</span><span class="collection-read-link">打开速查 <AboutIcon name="arrow" /></span></div>
    </a>
    <div v-if="cheatsheetList.length === 0" class="collection-empty"><AboutIcon name="terminal" /><h3>速查笔记正在整理</h3><p>常用命令与配置会陆续收录在这里。</p></div>
  </div>
</template>
