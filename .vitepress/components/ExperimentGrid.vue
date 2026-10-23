<script setup>
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import AboutIcon from './AboutIcon.vue'
import { data as experiments } from '../data/experiments.data.ts'
import { formatShortDate, getStatusClass, getExpId, getDifficultyText } from '../utils/content-loader'
import '../theme/collections.css'

const props = defineProps({ limit: { type: Number, default: 0 } })
const query = ref('')
const state = ref('all')
const filters = [{ value: 'all', label: '全部' }, { value: 'done', label: '已验证' }, { value: 'doing', label: '进行中' }]
const filteredExperiments = computed(() => {
  const keyword = query.value.trim().toLowerCase()
  return experiments.filter(item => {
    const searchable = [item.title, item.description, item.slug, ...(item.tags || []), ...asArray(item.platform), ...asArray(item.category)].join(' ').toLowerCase()
    return (!keyword || searchable.includes(keyword)) && (state.value === 'all' || getStatusClass(item.status) === state.value)
  })
})
const displayedExperiments = computed(() => props.limit > 0 ? filteredExperiments.value.slice(0, props.limit) : filteredExperiments.value)
const isFiltered = computed(() => query.value.trim() !== '' || state.value !== 'all')
function asArray(value) { return Array.isArray(value) ? value : value ? [value] : [] }
function statusText(status) { return ({ done: '已验证', verified: '已验证', doing: '进行中', 'in-progress': '进行中' })[status] || status }
function resetFilters() { query.value = ''; state.value = 'all' }
</script>

<template>
  <div class="collection-browser">
    <div v-if="limit === 0" class="collection-toolbar">
      <div class="collection-filter-group" role="group" aria-label="按实验状态筛选">
        <button v-for="filter in filters" :key="filter.value" type="button" :aria-pressed="state === filter.value" @click="state = filter.value">{{ filter.label }}</button>
      </div>
      <label class="collection-search"><AboutIcon name="code" /><span class="collection-sr-only">筛选实验标题、标签或平台</span><input v-model="query" type="search" placeholder="标题、标签或平台" /></label>
    </div>
    <div v-if="limit === 0" class="collection-result-line"><span role="status" aria-live="polite">{{ isFiltered ? '找到' : '共' }} {{ filteredExperiments.length }} 篇实验记录</span><button v-if="isFiltered" type="button" @click="resetFilters">重置筛选</button><span v-else>最近记录在前</span></div>
    <div class="collection-cards">
      <a v-for="exp in displayedExperiments" :key="exp.slug" :href="withBase(exp.url)" class="collection-card collection-experiment">
        <div class="collection-card-top"><span class="collection-record-id">EXP / {{ getExpId(exp.slug) || 'NOTE' }}</span><span v-if="exp.status" class="collection-state" :class="getStatusClass(exp.status)"><span aria-hidden="true"></span>{{ statusText(exp.status) }}</span></div>
        <h3>{{ exp.title }}</h3>
        <p class="collection-card-description">{{ exp.description || exp.excerpt }}</p>
        <div class="collection-card-meta"><span v-if="asArray(exp.platform).length"><AboutIcon name="chip" />{{ asArray(exp.platform).join(' · ') }}</span><span v-if="exp.difficulty">{{ getDifficultyText(exp.difficulty) }}</span><time v-if="exp.date" :datetime="exp.date">{{ formatShortDate(exp.date) }}</time></div>
        <div class="collection-card-footer"><div class="collection-card-tags"><span v-for="tag in (exp.tags || []).slice(0, 4)" :key="tag">{{ tag }}</span></div><span class="collection-read-link">阅读实验 <AboutIcon name="arrow" /></span></div>
      </a>
      <div v-if="displayedExperiments.length === 0" class="collection-empty">
        <AboutIcon name="flask" /><h3>{{ experiments.length ? '没有找到匹配的实验' : '实验正在酝酿中' }}</h3><p>{{ experiments.length ? '换个关键词，或清除当前筛选再看看。' : '下一次动手的过程与发现，会记录在这里。' }}</p><button v-if="isFiltered" type="button" @click="resetFilters">查看全部实验</button>
      </div>
    </div>
  </div>
</template>
