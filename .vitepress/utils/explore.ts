import { isArticle } from './content-collections.ts'
import { getStatusClass, toContentItem, type ContentItem, type RawContentEntry } from './content-loader.ts'
import { getMarkdownTitle } from './frontmatter.ts'
import { sectionForPath, type ExploreSectionId } from './sections.ts'

export interface ArticleTopic { id: string; label: string }
export interface ExploreArticle extends ContentItem {
  section: ExploreSectionId
  topics: ArticleTopic[]
}
export interface ExploreTopic extends ArticleTopic {
  kind: 'theme' | 'tag'
  count: number
  sections: ExploreSectionId[]
}
export interface ExploreData {
  articles: ExploreArticle[]
  topics: ExploreTopic[]
}
export interface ExploreFilters {
  query?: string
  section?: string
  topic?: string
  tag?: string
  status?: string
  state?: 'all' | 'doing' | 'done'
  sort?: 'recent' | 'oldest' | 'title'
}

const textList = (value: unknown): string[] => (Array.isArray(value) ? value : [value])
  .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
  .map(item => item.trim())
const normalizeText = (value: string): string => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en')
const topicId = (value: string): string => {
  const normalized = normalizeText(value)
  // Keep the default filter distinct from real names, including the escape prefix itself.
  return normalized === 'all' || normalized.startsWith('~') ? `~${normalized}` : normalized
}
function urlPath(url: string): string {
  const path = url.split(/[?#]/, 1)[0]
  try { return decodeURI(path) } catch { return path }
}

/**
 * Topics come from the author's existing categories/tags and directory names.
 * Knowledge indexes supply human-readable category names. No topic registry or
 * additional frontmatter is required when adding an article or a directory.
 */
export function collectExplore(entries: RawContentEntry[]): ExploreData {
  const supported = entries.filter(entry => sectionForPath(urlPath(entry.url))?.explore)
  const aliases = new Map<string, string>()
  const aliasCandidates = new Map<string, Set<string>>()
  const labels = new Map<string, string>()
  const themeIds = new Set<string>()
  const register = (label: string): ArticleTopic => {
    const key = topicId(label)
    const id = themeIds.has(key) ? key : aliases.get(key) || key
    if (!labels.has(id)) labels.set(id, label)
    return { id, label: labels.get(id)! }
  }
  // Directory identities take priority over display names. Gather every one
  // before resolving aliases so category order cannot change article ownership.
  for (const entry of supported) {
    const match = urlPath(entry.url).match(/^\/knowledge\/([^/]+)\/$/)
    if (!match) continue
    const dir = match[1]
    const title = textList(entry.frontmatter?.title)[0] || getMarkdownTitle(entry.src) || dir
    const id = topicId(dir)
    themeIds.add(id)
    if (!labels.has(id)) labels.set(id, title)
    const key = topicId(title)
    const candidates = aliasCandidates.get(key) || new Set<string>()
    candidates.add(id)
    aliasCandidates.set(key, candidates)
  }
  // Directories establish broad themes. Free-form metadata remains a detail
  // unless it matches an existing theme; adding tags must not grow the sidebar.
  for (const entry of supported) {
    const path = urlPath(entry.url)
    if (!isArticle({ ...entry, url: path })) continue
    const dir = path.split('/').slice(2, -1)[0]
    if (dir) {
      const id = topicId(dir)
      themeIds.add(id)
      if (!labels.has(id)) labels.set(id, dir)
    }
  }
  // A shared display name cannot identify one category. Keep it as a detail
  // tag rather than assigning it to whichever index happened to load last.
  for (const [key, candidates] of aliasCandidates) {
    if (!themeIds.has(key) && candidates.size === 1) aliases.set(key, [...candidates][0])
  }
  for (const entry of supported) {
    for (const label of [...textList(entry.frontmatter?.category), ...textList(entry.frontmatter?.tags)]) register(label)
  }

  const byUrl = new Map<string, ExploreArticle>()
  for (const entry of supported) {
    const path = urlPath(entry.url)
    const section = sectionForPath(path)
    if (!section?.explore || !isArticle({ ...entry, url: path }) || byUrl.has(path)) continue
    const dirs = path.split('/').slice(2, -1)
    const topics = new Map<string, ArticleTopic>()
    for (const label of [...dirs, ...textList(entry.frontmatter?.category), ...textList(entry.frontmatter?.tags)]) {
      const topic = register(label)
      topics.set(topic.id, topic)
    }
    byUrl.set(path, {
      ...toContentItem(entry), section: section.id, topics: [...topics.values()],
    })
  }
  const articles = filterExplore([...byUrl.values()])
  const topics = new Map<string, ExploreTopic>()
  for (const article of articles) {
    for (const topic of article.topics) {
      const item: ExploreTopic = topics.get(topic.id) || { ...topic, kind: themeIds.has(topic.id) ? 'theme' : 'tag', count: 0, sections: [] }
      item.count++
      if (!item.sections.includes(article.section)) item.sections.push(article.section)
      topics.set(topic.id, item)
    }
  }
  return {
    articles,
    topics: [...topics.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'zh-CN', { numeric: true })),
  }
}

/** Pure filtering, shared by the explorer UI and regression tests. */
export function filterExplore(articles: ExploreArticle[], filters: ExploreFilters = {}): ExploreArticle[] {
  const active = (value?: string) => !!value && value !== 'all'
  const terms = normalizeText(filters.query || '').split(/\s+/).filter(Boolean)
  const matches = articles.filter(article => {
    if (active(filters.section) && article.section !== filters.section) return false
    if (active(filters.status) && article.status !== filters.status) return false
    if (active(filters.state) && getStatusClass(article.status) !== filters.state) return false
    if (active(filters.topic) && !article.topics.some(topic => topic.id === normalizeText(filters.topic!))) return false
    if (active(filters.tag) && !article.topics.some(topic => topic.id === normalizeText(filters.tag!))) return false
    if (!terms.length) return true
    const text = normalizeText([
      article.title, article.description, article.excerpt,
      ...article.tags, ...textList(article.category), ...textList(article.platform),
      ...article.topics.map(topic => topic.label),
    ].join(' '))
    return terms.every(term => text.includes(term))
  })
  return matches.sort((a, b) => {
    const title = () => a.title.localeCompare(b.title, 'zh-CN', { numeric: true }) || a.url.localeCompare(b.url)
    if (filters.sort === 'title') return title()
    const left = Date.parse(a.date)
    const right = Date.parse(b.date)
    if (!Number.isFinite(left)) return Number.isFinite(right) ? 1 : title()
    if (!Number.isFinite(right)) return -1
    return (filters.sort === 'oldest' ? left - right : right - left) || title()
  })
}

/** Each facet counts matching records with only its own selection removed. */
export function countExploreFacets(articles: ExploreArticle[], filters: ExploreFilters = {}) {
  const topicsBase = filterExplore(articles, { ...filters, topic: 'all' })
  const tagsBase = filterExplore(articles, { ...filters, tag: 'all' })
  const sectionsBase = filterExplore(articles, { ...filters, section: 'all' })
  const statesBase = filterExplore(articles, { ...filters, state: 'all' })
  const countTopics = (items: ExploreArticle[]) => {
    const counts = new Map<string, number>()
    for (const article of items) {
      for (const id of new Set(article.topics.map(topic => topic.id))) counts.set(id, (counts.get(id) || 0) + 1)
    }
    return counts
  }
  const sections = new Map<string, number>()
  for (const article of sectionsBase) sections.set(article.section, (sections.get(article.section) || 0) + 1)
  const states = new Map<string, number>()
  for (const article of statesBase) {
    const state = getStatusClass(article.status)
    if (state) states.set(state, (states.get(state) || 0) + 1)
  }
  return {
    topics: countTopics(topicsBase), tags: countTopics(tagsBase), sections, states,
    allTopics: topicsBase.length, allSections: sectionsBase.length, allStates: statesBase.length,
  }
}

/** Resolve the same note from a source path or an encoded browser URL. */
export function findExploreArticle(articles: ExploreArticle[], currentUrl: string): ExploreArticle | undefined {
  const path = urlPath(currentUrl)
  return articles.find(article => urlPath(article.url) === path)
}

/** Recommend real notes sharing topics; never fill empty slots with unrelated records. */
export function relatedExplore(articles: ExploreArticle[], currentUrl: string, limit = 3): ExploreArticle[] {
  const maximum = Number.isNaN(limit) ? 0 : Math.min(3, Math.max(0, Math.floor(limit)))
  if (!maximum) return []
  const currentPath = urlPath(currentUrl)
  const current = findExploreArticle(articles, currentUrl)
  if (!current?.topics.length) return []
  const topics = new Set(current.topics.map(topic => topic.id))
  const seen = new Set([currentPath])
  // Sort by date first, then rely on stable sorting to retain that order when
  // common-topic counts and cross-section preference are both equal.
  const candidates = filterExplore(articles).flatMap(article => {
    const path = urlPath(article.url)
    if (seen.has(path)) return []
    seen.add(path)
    const common = new Set(article.topics.map(topic => topic.id).filter(id => topics.has(id))).size
    return common ? [{ article, common, crossSection: article.section !== current.section }] : []
  })
  return candidates.sort((a, b) => b.common - a.common || Number(b.crossSection) - Number(a.crossSection))
    .slice(0, maximum).map(candidate => candidate.article)
}
