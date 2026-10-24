import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, rmSync, utimesSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, matchesGlob } from 'node:path'
import { collectExplore, countExploreFacets, filterExplore, relatedExplore } from '../.vitepress/utils/explore.ts'

const entry = (url: string, frontmatter: Record<string, unknown> = {}, src = '# 正文标题\n记录内容。') => ({ url, frontmatter, src })

test('exploration recursively collects real records, excludes navigation and keeps full URL identities', () => {
  const data = collectExplore([
    entry('/knowledge/'), entry('/knowledge/linux/', { title: '嵌入式 Linux' }),
    entry('/knowledge/linux/memory/'),
    entry('/knowledge/linux/navigation.html', { categoryPage: true }),
    entry('/knowledge/linux/memory/setup.html'),
    entry('/experiments/camera/setup.html'), entry('/experiments/audio/setup.html'),
    entry('/debug/camera/setup.html'), entry('/cheatsheet/tools/setup.html'),
    entry('/projects/one/setup.html'), entry('/other/setup.html'),
    entry('/experiments/camera/setup.html', { title: '重复数据不能覆盖原记录' }),
  ])
  assert.equal(data.articles.length, 5)
  assert.equal(new Set(data.articles.map(article => article.url)).size, 5)
  assert.ok(data.articles.every(article => article.title === '正文标题'))
  assert.deepEqual(new Set(data.articles.map(article => article.section)), new Set(['knowledge', 'experiments', 'debug', 'cheatsheet']))
  assert.ok(data.articles.every(article => article.slug === 'setup'))
})

test('topics unify knowledge categories and cross-column metadata without requiring author registration', () => {
  const data = collectExplore([
    entry('/knowledge/linux/', {}, '# 嵌入式 Linux'),
    entry('/knowledge/linux/first.html', { tags: ['Linux', 'linux', null, 12] }),
    entry('/experiments/camera/first.html', { category: ' Linux ', tags: ['Camera', 'camera'] }),
    entry('/debug/new-topic/deep/note.html'),
    entry('/cheatsheet/plain.html'),
  ])
  const linux = data.topics.find(topic => topic.id === 'linux')!
  assert.equal(linux.label, '嵌入式 Linux')
  assert.equal(linux.count, 2)
  assert.deepEqual(new Set(linux.sections), new Set(['knowledge', 'experiments']))
  assert.equal(data.topics.find(topic => topic.id === 'camera')?.count, 1)
  assert.ok(data.topics.some(topic => topic.id === 'new-topic'))
  assert.ok(data.topics.some(topic => topic.id === 'deep'))
  assert.deepEqual(data.articles.find(article => article.url === '/cheatsheet/plain.html')?.topics, [])
})

test('exploration filters combine form, dynamic topics and text while keeping source data unchanged', () => {
  const { articles } = collectExplore([
    entry('/knowledge/linux/', { title: '嵌入式 Linux' }),
    entry('/knowledge/linux/mmap.html', { title: '内存映射', tags: ['MMAP'], date: '2026-10-01' }),
    entry('/experiments/first.html', { title: 'Linux 采集验证', tags: ['Linux'], platform: ['RK3566'], status: 'doing', date: '2026-10-20' }),
    entry('/debug/error.html', { title: '内存问题', category: ['Linux'], platform: 'RK3566', status: 'solved', date: '2026-10-22' }),
  ])
  const original = JSON.stringify(articles)
  assert.equal(filterExplore(articles, { topic: 'linux' }).length, 3)
  assert.deepEqual(filterExplore(articles, { section: 'experiments', topic: 'linux', query: 'linux rk3566', status: 'doing' }).map(article => article.url), ['/experiments/first.html'])
  assert.deepEqual(filterExplore(articles, { query: 'mmap' }).map(article => article.url), ['/knowledge/linux/mmap.html'])
  assert.deepEqual(filterExplore(articles, { section: 'all', topic: 'unknown' }), [])
  assert.equal(JSON.stringify(articles), original)
})

test('recent and oldest sorting keep undated or invalid dates last and title sorting remains available', () => {
  const { articles } = collectExplore([
    entry('/debug/older.html', { title: 'B', date: '2026-01-01' }),
    entry('/debug/latest.html', { title: 'C', date: '2026-10-23' }),
    entry('/debug/no-date.html', { title: 'A' }),
    entry('/debug/invalid.html', { title: 'D', date: 'not-a-date' }),
  ])
  assert.deepEqual(filterExplore(articles).map(article => article.title), ['C', 'B', 'A', 'D'])
  assert.deepEqual(filterExplore(articles, { sort: 'oldest' }).map(article => article.title), ['B', 'C', 'A', 'D'])
  assert.deepEqual(filterExplore(articles, { sort: 'title' }).map(article => article.title), ['A', 'B', 'C', 'D'])
})

test('broad themes follow directories while free-form details remain tags and still connect across forms', () => {
  const data = collectExplore([
    entry('/knowledge/linux/', { title: '嵌入式 Linux' }),
    entry('/knowledge/linux/memory/note.html', { tags: ['Linux', 'mmap', 'rare-detail'], category: ['系统编程'] }),
    entry('/experiments/one.html', { category: ['Linux'], tags: ['mmap'] }),
    entry('/debug/robots/deeper/note.html'),
    entry('/knowledge/empty/', { title: '空主题' }),
    entry('/cheatsheet/plain.html'),
  ])
  assert.deepEqual(new Set(data.topics.filter(topic => topic.kind === 'theme').map(topic => topic.id)), new Set(['linux', 'robots']))
  for (const id of ['memory', 'mmap', 'rare-detail', '系统编程', 'deeper']) assert.equal(data.topics.find(topic => topic.id === id)?.kind, 'tag')
  assert.equal(filterExplore(data.articles, { topic: 'linux', tag: 'mmap' }).length, 2)
  assert.equal(filterExplore(data.articles, { topic: 'linux', tag: 'mmap', section: 'experiments' }).length, 1)
  assert.equal(filterExplore(data.articles, { topic: 'linux', tag: 'unknown' }).length, 0)
  assert.equal(data.topics.some(topic => topic.id === 'empty'), false)
  assert.equal(data.articles.find(article => article.url === '/cheatsheet/plain.html')?.topics.length, 0)
})

test('facet counts ignore only their own selection and keep search, other facets and real record identities', () => {
  const { articles } = collectExplore([
    entry('/knowledge/linux/', { title: 'Linux' }),
    entry('/knowledge/video/', { title: '视频' }),
    entry('/knowledge/linux/note.html', { title: '内存', tags: ['mmap'] }),
    entry('/experiments/linux/note.html', { title: '内存', tags: ['mmap'] }),
    entry('/experiments/video/note.html', { title: '内存', tags: ['mmap'] }),
    entry('/debug/linux/note.html', { title: '内存', tags: ['I2C'] }),
  ])
  const original = JSON.stringify(articles)
  const counts = countExploreFacets(articles, { topic: 'linux', section: 'experiments', tag: 'mmap', query: '内存' })
  assert.equal(counts.topics.get('linux'), 1)
  assert.equal(counts.topics.get('video'), 1)
  assert.equal(counts.allTopics, 2)
  assert.equal(counts.sections.get('knowledge'), 1)
  assert.equal(counts.sections.get('experiments'), 1)
  assert.equal(counts.sections.get('debug') || 0, 0)
  assert.equal(counts.allSections, 2)
  assert.equal(counts.tags.get('mmap'), 1)
  assert.equal(counts.tags.get('i2c') || 0, 0)
  assert.equal(countExploreFacets(articles, { section: 'debug' }).topics.get('linux'), 1)
  assert.equal(countExploreFacets(articles, { query: '无匹配词' }).allTopics, 0)
  assert.equal(JSON.stringify(articles), original)
})

test('related notes rank real shared topics, then prefer another record form and recency', () => {
  const { articles } = collectExplore([
    entry('/knowledge/current.html', { tags: ['Linux', 'MMAP'] }),
    entry('/knowledge/strong.html', { tags: ['Linux', 'MMAP'], date: '2026-01-01' }),
    entry('/knowledge/recent.html', { tags: ['Linux'], date: '2026-10-23' }),
    entry('/experiments/older.html', { tags: ['Linux'], date: '2026-10-01' }),
    entry('/debug/newer.html', { tags: ['MMAP'], date: '2026-10-20' }),
    entry('/cheatsheet/unrelated.html', { tags: ['Git'], date: '2026-10-24' }),
  ])
  const original = JSON.stringify(articles)
  assert.deepEqual(relatedExplore(articles, '/knowledge/current.html').map(article => article.url), [
    '/knowledge/strong.html', '/debug/newer.html', '/experiments/older.html',
  ])
  assert.equal(relatedExplore(articles, '/knowledge/current.html', 1)[0].url, '/knowledge/strong.html')
  assert.equal(relatedExplore(articles, '/knowledge/current.html', 10).length, 3)
  assert.equal(JSON.stringify(articles), original)
})

test('related notes match encoded Chinese URLs and keep same basenames in different directories distinct', () => {
  const { articles } = collectExplore([
    entry('/knowledge/控制/设置.html', { tags: ['电机'], date: '2026-10-23' }),
    entry('/experiments/控制/设置.html', { tags: ['电机'], date: '2026-10-22' }),
    entry('/debug/控制/设置.html', { tags: ['电机'], date: '2026-10-20' }),
  ])
  const duplicates = [...articles, { ...articles[0], url: encodeURI(articles[0].url) }]
  const result = relatedExplore(duplicates, '/knowledge/%E6%8E%A7%E5%88%B6/%E8%AE%BE%E7%BD%AE.html?view=1#result')
  assert.deepEqual(result.map(article => article.url), [
    '/experiments/控制/设置.html', '/debug/控制/设置.html',
  ])
})

test('related notes do not invent connections when the current note or shared topics are absent', () => {
  const { articles } = collectExplore([
    entry('/knowledge/current.html', { tags: ['Only-this-note'] }),
    entry('/experiments/other.html', { tags: ['Something-else'] }),
    entry('/debug/plain.html'),
  ])
  assert.deepEqual(relatedExplore(articles, '/knowledge/current.html'), [])
  assert.deepEqual(relatedExplore(articles, '/debug/plain.html'), [])
  assert.deepEqual(relatedExplore(articles, '/unknown.html'), [])
  assert.deepEqual(relatedExplore(articles, '/knowledge/current.html', 0), [])
})

test('the actual exploration loader watches new directories and refreshes topics on creation, update and deletion', async t => {
  const root = mkdtempSync(join(tmpdir(), 'astralleap-explore-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  const write = (path: string, src: string) => {
    const file = join(root, path)
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, src)
    return file
  }
  write('knowledge/novel/index.md', '# 新探索领域')
  write('knowledge/novel/first.md', '# 第一篇笔记')
  for (const section of ['experiments', 'debug', 'cheatsheet']) {
    write(`${section}/nested/first.md`, '# 普通记录')
    write(`${section}/nested/index.md`, '# 导航页')
  }
  const state = globalThis as any
  const previous = state.VITEPRESS_CONFIG
  state.VITEPRESS_CONFIG = {
    srcDir: root, publicDir: join(root, 'public'), markdown: {},
    site: { locales: {}, base: '/' }, rewrites: { map: {} }, buildConcurrency: 1,
  }
  t.after(() => {
    if (previous === undefined) delete state.VITEPRESS_CONFIG
    else state.VITEPRESS_CONFIG = previous
  })
  const { default: loader } = await import('../.vitepress/data/explore.data.ts')
  assert.equal((await loader.load()).articles.length, 4)
  const futureFile = write('experiments/future-topic/deeper/second.md', '# 后续实验')
  assert.ok(loader.watch.some((pattern: string) => matchesGlob(futureFile.replace(/\\/g, '/'), pattern)))
  const added = await loader.load()
  assert.equal(added.articles.length, 5)
  assert.ok(added.topics.some(topic => topic.id === 'future-topic'))
  write('knowledge/novel/index.md', '# 更新后的主题名')
  const changed = new Date(Date.now() + 2000)
  utimesSync(join(root, 'knowledge/novel/index.md'), changed, changed)
  assert.equal((await loader.load()).topics.find(topic => topic.id === 'novel')?.label, '更新后的主题名')
  rmSync(join(root, 'experiments/future-topic'), { recursive: true })
  rmSync(join(root, 'knowledge/novel'), { recursive: true })
  const removed = await loader.load()
  assert.equal(removed.articles.length, 3)
  assert.ok(!removed.topics.some(topic => ['future-topic', 'novel'].includes(topic.id)))
})
