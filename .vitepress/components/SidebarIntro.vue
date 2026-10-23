<script setup>
import { withBase } from 'vitepress'
import AboutIcon from './AboutIcon.vue'
</script>

<template>
  <div class="sidebar-intro">
    <p class="sidebar-kicker"><AboutIcon name="layers" /><span>EXPLORE / 探索导航</span></p>
    <p class="sidebar-intro-note">跟随好奇心，连接每次实践。</p>
    <a :href="withBase('/knowledge/')">浏览全部主题 <AboutIcon name="arrow" /></a>
  </div>
</template>
