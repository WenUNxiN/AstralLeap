<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter, withBase } from 'vitepress'
import AboutIcon from './AboutIcon.vue'
import { data } from '../data/explore.data.ts'
import { exploreSections } from '../utils/sections.ts'
import { countExploreFacets, filterExplore } from '../utils/explore.ts'
import { firstOf, formatShortDate, getStatusClass, getStatusText } from '../utils/content-loader.ts'
import { readExploreQuery, resolveExploreQuery, writeExploreQuery, type ExploreQuery } from '../utils/explore-query.ts'

const route = useRoute()
const router = useRouter()
const filters = reactive(readExploreQuery(''))
const mounted = ref(false)
const tagsVisible = ref(false)
const tagSearch = ref('')

// Query state is restored after hydration, including old links and Back/Forward.
watch(() => route.query, query => {
  if (mounted.value) Object.assign(filters, resolveExploreQuery(query, data.topics))
})
onMounted(() => {
  mounted.value = true
  Object.assign(filters, resolveExploreQuery(route.query, data.topics))
})

const themes = computed(() => data.topics.filter(topic => topic.kind === 'theme'))
const results = computed(() => filterExplore(data.articles, filters))
const counts = computed(() => countExploreFacets(data.articles, filters))
const currentTopic = computed(() => data.topics.find(topic => topic.id === filters.topic))
const currentTag = computed(() => data.topics.find(topic => topic.id === filters.tag))
const currentSection = computed(() => exploreSections.find(section => section.id === filters.section))
const progressStates = [
  { id: 'all', label: '全部' }, { id: 'doing', label: '进行中' }, { id: 'done', label: '已完成' },
] as const
const stateCount = (state: ExploreQuery['state']) => state === 'all' ? counts.value.allStates : counts.value.states.get(state) || 0
const hasFilters = computed(() => Boolean(filters.query.trim()) || filters.section !== 'all' || filters.topic !== 'all' || filters.tag !== 'all' || filters.state !== 'all' || filters.sort !== 'recent')
const availableTags = computed(() => data.topics.filter(topic => topic.kind === 'tag' && ((counts.value.tags.get(topic.id) || 0) > 0 || topic.id === filters.tag)))
const matchingTags = computed(() => {
  const query = tagSearch.value.normalize('NFKC').trim().toLocaleLowerCase('en')
  return availableTags.value.filter(tag => tag.label.normalize('NFKC').toLocaleLowerCase('en').includes(query))
})
const heading = computed(() => currentTopic.value?.label || (filters.topic !== 'all' ? filters.topic : '全部记录'))
const selectedFilters = computed(() => [
  ...(filters.topic !== 'all' ? [{ key: 'topic' as const, name: '主题', label: currentTopic.value?.label || filters.topic }] : []),
  ...(filters.section !== 'all' ? [{ key: 'section' as const, name: '形式', label: currentSection.value?.label || filters.section }] : []),
  ...(filters.tag !== 'all' ? [{ key: 'tag' as const, name: '标签', label: currentTag.value?.label || filters.tag }] : []),
  ...(filters.state !== 'all' ? [{ key: 'state' as const, name: '进度', label: filters.state === 'doing' ? '进行中' : '已完成' }] : []),
  ...(filters.query.trim() ? [{ key: 'query' as const, name: '关键词', label: filters.query.trim() }] : []),
  ...(filters.sort !== 'recent' ? [{ key: 'sort' as const, name: '排序', label: filters.sort === 'oldest' ? '较早记录在前' : '按标题排列' }] : []),
])
const sectionFor = (id: string) => exploreSections.find(section => section.id === id)
const statusText = (status: string) => getStatusText(status).replace(/^(?:✓|⟳|🔍|📖)\s*/u, '')

function updateFilters(next: Partial<ExploreQuery>, replace = false) {
  Object.assign(filters, next)
  const href = writeExploreQuery(window.location.href, filters)
  if (href === window.location.pathname + window.location.search + window.location.hash) return
  void router.go(href, { replace })
}
function searchInput(event: Event) {
  if ((event as InputEvent).isComposing) return
  updateFilters({ query: (event.target as HTMLInputElement).value }, true)
}
function removeFilter(key: keyof ExploreQuery) {
  updateFilters({ [key]: readExploreQuery('')[key] })
}
function resetFilters() {
  tagSearch.value = ''
  tagsVisible.value = false
  updateFilters(readExploreQuery(''))
}
</script>

<template>
  <main class="explore-shell" aria-labelledby="explore-title">
    <header class="explore-intro">
      <div>
        <p class="explore-eyebrow">EXPLORE / 持续生长的记录</p>
        <h1 id="explore-title">探索</h1>
        <p class="explore-intro-text">沿着主题，串起知识、实验与问题排查。</p>
      </div>
      <label class="explore-search">
        <AboutIcon name="search" />
        <span class="explore-sr-only">搜索标题、主题、标签</span>
        <input type="search" :value="filters.query" placeholder="搜索笔记、关键词…" autocomplete="off" spellcheck="false"
          @input="searchInput" @compositionend="searchInput">
      </label>
    </header>

    <div class="explore-catalog">
      <aside class="explore-topics" aria-label="主题筛选">
        <p class="explore-filter-label" id="explore-topic-label">按主题浏览 <span>{{ themes.length }}</span></p>
        <div class="explore-topic-list" role="group" aria-labelledby="explore-topic-label">
          <button class="explore-topic" :class="{ 'is-selected': filters.topic === 'all' }" :aria-pressed="filters.topic === 'all'" @click="updateFilters({ topic: 'all' })">
            <span>所有主题</span><span class="explore-topic-count">{{ counts.allTopics }}</span>
          </button>
          <button v-for="topic in themes" :key="topic.id" class="explore-topic"
            :class="{ 'is-selected': filters.topic === topic.id }" :aria-pressed="filters.topic === topic.id"
            :disabled="!counts.topics.get(topic.id) && filters.topic !== topic.id" @click="updateFilters({ topic: topic.id })">
            <span>{{ topic.label }}</span><span class="explore-topic-count">{{ counts.topics.get(topic.id) || 0 }}</span>
          </button>
        </div>
        <p class="explore-topic-note">只展示已有记录的主题。<br>新的探索，会在这里慢慢生长。</p>
      </aside>

      <section class="explore-records" aria-labelledby="explore-records-title">
        <div class="explore-format-heading">
          <span id="explore-format-label">记录形式</span>
          <button class="explore-tags-toggle" :aria-expanded="tagsVisible" aria-controls="explore-tag-panel" @click="tagsVisible = !tagsVisible">
            <AboutIcon name="sliders" /><span>细分标签 <span class="explore-tag-total">{{ availableTags.length }}</span></span>
            <span aria-hidden="true">{{ tagsVisible ? '−' : '+' }}</span>
          </button>
        </div>
        <div class="explore-type-list" role="group" aria-labelledby="explore-format-label">
          <button class="explore-type" :class="{ 'is-selected': filters.section === 'all' }" :aria-pressed="filters.section === 'all'" @click="updateFilters({ section: 'all' })">
            全部 <span class="explore-type-count">{{ counts.allSections }}</span>
          </button>
          <button v-for="section in exploreSections" :key="section.id" class="explore-type" :class="{ 'is-selected': filters.section === section.id }"
            :aria-pressed="filters.section === section.id" :aria-label="section.label + ' ' + (counts.sections.get(section.id) || 0)" :title="section.label"
            :disabled="!counts.sections.get(section.id) && filters.section !== section.id" @click="updateFilters({ section: section.id })">
            <AboutIcon :name="section.icon" /><span class="explore-type-name">{{ section.label }}</span><span class="explore-type-short">{{ section.label.replace(/笔记|记录|命令/g, '').trim() }}</span><span class="explore-type-count">{{ counts.sections.get(section.id) || 0 }}</span>
          </button>
        </div>

          <div v-show="tagsVisible" id="explore-tag-panel" class="explore-tag-panel">
            <label class="explore-tag-search"><AboutIcon name="search" /><span class="explore-sr-only">查找细分标签</span><input v-model="tagSearch" type="search" placeholder="查找标签，如 I2C、mmap…" autocomplete="off"></label>
            <div v-if="matchingTags.length" class="explore-tag-list" role="group" aria-label="细分标签">
              <button v-for="tag in matchingTags" :key="tag.id" class="explore-tag" :class="{ 'is-selected': filters.tag === tag.id }" :aria-pressed="filters.tag === tag.id"
                @click="updateFilters({ tag: filters.tag === tag.id ? 'all' : tag.id })"><span>{{ tag.label }}</span><span>{{ counts.tags.get(tag.id) || 0 }}</span></button>
            </div>
            <p v-else class="explore-tag-empty">{{ tagSearch.trim() ? '没有找到这个标签，试试其他词。' : '当前范围没有细分标签，仍可直接阅读下方记录。' }}</p>
          </div>

        <div v-if="hasFilters" class="explore-selected" aria-label="已选筛选条件">
          <div class="explore-selected-list">
            <button v-for="filter in selectedFilters" :key="filter.key" class="explore-filter-chip" :aria-label="'移除' + filter.name + '：' + filter.label" @click="removeFilter(filter.key)">
              <span class="explore-chip-name">{{ filter.name }}</span><span>{{ filter.label }}</span><span aria-hidden="true">×</span>
            </button>
          </div>
          <button class="explore-reset" @click="resetFilters">重置筛选</button>
        </div>

        <div class="explore-progress">
          <span id="explore-progress-label">进度</span>
          <div class="explore-state-list" role="group" aria-labelledby="explore-progress-label">
            <button v-for="state in progressStates" :key="state.id" class="explore-state"
              :class="{ 'is-selected': filters.state === state.id }" :aria-pressed="filters.state === state.id"
              :disabled="state.id !== 'all' && !stateCount(state.id) && filters.state !== state.id"
              @click="updateFilters({ state: state.id })">{{ state.label }} <span>{{ stateCount(state.id) }}</span></button>
          </div>
        </div>

        <div class="explore-results-heading">
          <div class="explore-result-summary" role="status" aria-live="polite" aria-atomic="true">
            <h2 id="explore-records-title">{{ heading }}</h2><span>{{ results.length }} 条记录</span>
          </div>
          <label class="explore-sort"><span class="explore-sr-only">排序方式</span>
            <select :value="filters.sort" aria-label="排序方式" @change="updateFilters({ sort: ($event.target as HTMLSelectElement).value as ExploreQuery['sort'] })">
              <option value="recent">最近记录在前</option>
              <option value="oldest">较早记录在前</option>
              <option value="title">按标题排列</option>
            </select>
          </label>
        </div>

        <ul v-if="results.length" class="explore-results">
          <li v-for="article in results" :key="article.url">
            <a class="explore-record" :href="withBase(article.url)">
              <div class="explore-record-meta">
                <span class="explore-record-kind"><AboutIcon :name="sectionFor(article.section)?.icon || 'book'" />{{ sectionFor(article.section)?.label || '笔记' }}</span>
                <time v-if="article.date" :datetime="article.date">{{ formatShortDate(article.date) }}</time>
              </div>
              <h3>{{ article.title }}<AboutIcon name="arrow" /></h3>
              <p v-if="article.description || article.excerpt" class="explore-record-description">{{ article.description || article.excerpt }}</p>
              <div v-if="article.topics.length || article.status || firstOf(article.platform)" class="explore-record-footer">
                <div v-if="article.topics.length" class="explore-record-topics"><span v-for="topic in article.topics.slice(0, 3)" :key="topic.id">{{ topic.label }}</span><span v-if="article.topics.length > 3" :title="article.topics.slice(3).map(topic => topic.label).join('、')">+{{ article.topics.length - 3 }}</span></div>
                <span v-if="firstOf(article.platform)" class="explore-record-platform">{{ firstOf(article.platform) }}</span>
                <span v-if="article.status" class="explore-record-status" :class="getStatusClass(article.status)">{{ statusText(article.status) }}</span>
              </div>
            </a>
          </li>
        </ul>
        <div v-else class="explore-empty">
          <AboutIcon name="search" />
          <h3>没有找到匹配的记录</h3>
          <p>可以先移除一个条件，保留其余选择。</p>
          <div class="explore-empty-actions">
            <button v-if="filters.query.trim()" @click="removeFilter('query')">清除关键词</button>
            <button v-if="filters.tag !== 'all'" @click="removeFilter('tag')">取消标签</button>
            <button v-if="filters.state !== 'all'" @click="removeFilter('state')">取消进度</button>
            <button v-if="hasFilters" @click="resetFilters">查看全部记录</button>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
