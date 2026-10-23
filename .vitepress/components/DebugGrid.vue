<script setup>
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import AboutIcon from './AboutIcon.vue'
import { data as debugList } from '../data/debug.data.ts'
import { formatShortDate, getStatusClass, firstOf } from '../utils/content-loader'
import '../theme/collections.css'

const props = defineProps({ limit: { type: Number, default: 0 } })
const query = ref('')
const state = ref('all')
const filters = [{ value: 'all', label: '全部' }, { value: 'done', label: '已解决' }, { value: 'doing', label: '排查中' }]
const filteredDebug = computed(() => {
  const keyword = query.value.trim().toLowerCase()
  return debugList.filter(item => {
    const searchable = [item.title, item.description, ...(item.tags || []), ...asArray(item.platform), ...asArray(item.category)].join(' ').toLowerCase()
    return (!keyword || searchable.includes(keyword)) && (state.value === 'all' || getStatusClass(item.status) === state.value)
  })
})
const displayedDebug = computed(() => props.limit > 0 ? filteredDebug.value.slice(0, props.limit) : filteredDebug.value)
const isFiltered = computed(() => query.value.trim() !== '' || state.value !== 'all')
function asArray(value) { return Array.isArray(value) ? value : value ? [value] : [] }
function statusText(status) { return ({ solved: '已解决', debugging: '排查中', doing: '排查中', 'in-progress': '排查中' })[status] || status }
function resetFilters() { query.value = ''; state.value = 'all' }
</script>

<template>
  <div class="collection-browser">
    <div v-if="limit === 0" class="collection-toolbar">
      <div class="collection-filter-group" role="group" aria-label="按问题状态筛选">
        <button v-for="filter in filters" :key="filter.value" type="button" :aria-pressed="state === filter.value" @click="state = filter.value">{{ filter.label }}</button>
      </div>
      <label class="collection-search"><AboutIcon name="code" /><span class="collection-sr-only">筛选问题标题、标签或平台</span><input v-model="query" type="search" placeholder="错误关键词、标签或平台" /></label>
    </div>
    <div v-if="limit === 0" class="collection-result-line"><span role="status" aria-live="polite">{{ isFiltered ? '找到' : '共' }} {{ filteredDebug.length }} 篇问题记录</span><button v-if="isFiltered" type="button" @click="resetFilters">重置筛选</button><span v-else>最近记录在前</span></div>
    <div class="collection-cards">
      <a v-for="item in displayedDebug" :key="item.slug" :href="withBase(item.url)" class="collection-card collection-debug">
        <div class="collection-card-top"><span class="collection-record-id"><AboutIcon name="bug" />{{ firstOf(item.category) || 'DEBUG' }}</span><span v-if="item.status" class="collection-state" :class="getStatusClass(item.status)"><span aria-hidden="true"></span>{{ statusText(item.status) }}</span></div>
        <h3>{{ item.title }}</h3>
        <p class="collection-card-description">{{ item.description || item.excerpt }}</p>
        <div class="collection-card-meta"><span v-if="asArray(item.platform).length"><AboutIcon name="chip" />{{ asArray(item.platform).join(' · ') }}</span><time v-if="item.date" :datetime="item.date">{{ formatShortDate(item.date) }}</time></div>
        <div class="collection-card-footer"><div class="collection-card-tags"><span v-for="tag in (item.tags || []).slice(0, 4)" :key="tag">{{ tag }}</span></div><span class="collection-read-link">查看排查 <AboutIcon name="arrow" /></span></div>
      </a>
      <div v-if="displayedDebug.length === 0" class="collection-empty">
        <AboutIcon name="bug" /><h3>{{ debugList.length ? '没有找到匹配的问题' : '还没有问题记录' }}</h3><p>{{ debugList.length ? '换个关键词，或清除当前筛选再看看。' : '遇到的问题与排查过程，会持续整理在这里。' }}</p><button v-if="isFiltered" type="button" @click="resetFilters">查看全部问题</button>
      </div>
    </div>
  </div>
</template>
