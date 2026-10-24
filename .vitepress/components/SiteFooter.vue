<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import AboutIcon from './AboutIcon.vue'
import { visitorStats } from '../utils/visitor-stats'

const props = defineProps({ compact: { type: Boolean, default: false } })
const { frontmatter, page } = useData()
const isDocument = computed(() => !page.value.isNotFound && (!frontmatter.value.layout || frontmatter.value.layout === 'doc'))
const showFooter = computed(() => props.compact === isDocument.value)
</script>

<template>
  <footer v-if="showFooter" class="site-footer" :class="{ 'site-footer-doc': compact }">
    <div class="footer-inner">
      <div class="footer-main">
        <div class="footer-brand-block">
          <a class="footer-brand" :href="withBase('/')"><span aria-hidden="true">✦</span> 星跃 <span class="footer-brand-en">Astral Leap</span></a>
          <p>以星为向，以技为跃。记录每一次探索与实践。</p>
        </div>
        <nav class="footer-nav" aria-label="页脚导航">
          <a :href="withBase('/projects/')">项目</a>
          <a :href="withBase('/explore/')">探索</a>
          <a :href="withBase('/about.html')">关于我</a>
          <a href="https://github.com/WenUNxiN/AstralLeap" target="_blank" rel="noopener noreferrer" aria-label="GitHub 源码（在新标签页打开）">GitHub <AboutIcon name="arrow-up" /></a>
        </nav>
      </div>
      <div class="footer-bottom">
        <span>© {{ new Date().getFullYear() }} Stellan W <span class="footer-built">· Built with VitePress</span></span>
        <div class="footer-traffic" aria-label="站点访问统计">
          <span>{{ visitorStats.pageViews }} 次访问</span><span class="footer-traffic-dot" aria-hidden="true">·</span>
          <span>{{ visitorStats.visitors }} 位访客</span>
        </div>
      </div>
    </div>
  </footer>
</template>
