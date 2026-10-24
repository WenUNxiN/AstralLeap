<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data } from '../data/explore.data.ts'
import { filterExplore } from '../utils/explore'
import { formatShortDate } from '../utils/content-loader'
import { sectionForPath } from '../utils/sections'
import AboutIcon from './AboutIcon.vue'

const notes = computed(() => filterExplore(data.articles).slice(0, 3))
</script>

<template>
  <aside class="home-notebook home-recent" aria-labelledby="notebook-title">
    <div class="home-notebook-top">
      <span><span class="home-status-dot" aria-hidden="true"></span>随学随记，慢慢积累</span>
      <span class="home-recent-count">{{ data.articles.length }} 条记录</span>
    </div>
    <p class="home-eyebrow">RECENT NOTES</p>
    <h2 id="notebook-title">最近记下的</h2>
    <ul v-if="notes.length" class="home-recent-list">
      <li v-for="note in notes" :key="note.url">
        <a :href="withBase(note.url)">
          <div class="home-recent-meta">
            <span>{{ sectionForPath(note.url)?.label || '笔记' }}</span>
            <time v-if="note.date" :datetime="note.date">{{ formatShortDate(note.date) }}</time>
          </div>
          <div class="home-recent-title"><span>{{ note.title }}</span><AboutIcon name="arrow-up" /></div>
        </a>
      </li>
    </ul>
    <p v-else class="home-recent-empty">第一篇笔记，留给下一次发现。</p>
    <a class="home-recent-more" :href="withBase('/explore/')">浏览所有记录 <AboutIcon name="arrow" /></a>
  </aside>
</template>
