import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getExcerpt, getMarkdownTitle } from '../.vitepress/utils/frontmatter.ts'
import { normalizeDate, sortByDateDesc, toContentItem, formatDate, getStatusText, getDifficultyText, firstOf } from '../.vitepress/utils/content-loader.ts'
import { collectExplore, filterExplore } from '../.vitepress/utils/explore.ts'

test('article previews preserve useful inline code and link text without exposing URLs', () => {
  assert.equal(getExcerpt('# 调试笔记\n使用 `mmap` 和 [V4L2](https://example.com) 采集。\n![截图](./capture.png)'), '调试笔记。使用 mmap 和 V4L2 采集')
})

test('BOM and CRLF metadata, scripts, comments and both fence styles stay out of previews', () => {
  const source = '\uFEFF---\r\ntitle: hidden\r\n---\r\n<script setup>const secret = 1</script>\n<!-- hidden -->\n~~~sh\nnot prose\n~~~\n```js\nalso hidden\n```\n# 可见标题\n实际内容。'
  assert.equal(getExcerpt(source), '可见标题。实际内容')
})

test('empty and long previews have a predictable fallback and length', () => {
  assert.equal(getExcerpt(null), '暂无摘要')
  assert.equal(getExcerpt('```sh\ncode\n```'), '暂无摘要')
  assert.equal(getExcerpt('一'.repeat(200), 10), '一'.repeat(10) + '...')
})

test('single YAML tags and arrays normalize to usable tag lists', () => {
  const item = (tags: unknown) => toContentItem({ url: '/knowledge/linux/mmap.html', frontmatter: { tags } })
  assert.deepEqual(item(' Linux ').tags, ['Linux'])
  assert.deepEqual(item(['camera', null, 123, '', ' C ']).tags, ['camera', 'C'])
  assert.deepEqual(item(undefined).tags, [])
  assert.equal(item('Linux').slug, 'mmap')
})

test('plain Markdown articles get a title without editing metadata or configuration', () => {
  const src = '\uFEFF---\r\ndescription: example\r\n---\r\n```md\n# Example code\n```\n<script setup>\n# Script content\n</script>\n# 使用 `mmap` **采集** ##\n正文'
  assert.equal(getMarkdownTitle(src), '使用 mmap 采集')
  assert.equal(toContentItem({ url: '/knowledge/linux/new-note.html', frontmatter: {}, src }).title, '使用 mmap 采集')
  assert.equal(toContentItem({ url: '/new-note.html', frontmatter: { title: '自定义标题' }, src }).title, '自定义标题')
  assert.equal(getMarkdownTitle('Setext title\n===\nBody'), 'Setext title')
  assert.equal(getMarkdownTitle('No heading'), '')
})

test('date display uses UTC and sorting keeps valid recent entries first', () => {
  assert.equal(normalizeDate(new Date('2026-10-23T23:00:00-08:00')), '2026-10-24')
  assert.equal(formatDate('2026-10-24'), '2026年10月24日')
  const entries = [{date:'broken'}, {date:'2025-01-01'}, {date:''}, {date:'2026-10-23'}]
  assert.deepEqual(sortByDateDesc(entries).map(item => item.date), ['2026-10-23', '2025-01-01', 'broken', ''])
})

test('optional metadata keeps text and string lists usable while ignoring other YAML types', () => {
  const item = toContentItem({
    url: '/knowledge/linux/safe.html', src: '# 正文标题\n记录内容。',
    frontmatter: {
      title: { unexpected: 'object' }, description: true, date: { year: 2026 },
      category: [' Linux ', null, 123, {}, ''], platform: [' RK3566 ', false, null],
      status: true, difficulty: ['beginner'], excerpt: { text: 'invalid' },
    }
  })
  assert.equal(item.title, '正文标题')
  assert.equal(item.description, '')
  assert.equal(item.date, '')
  assert.deepEqual(item.category, ['Linux'])
  assert.deepEqual(item.platform, ['RK3566'])
  assert.equal(item.status, '')
  assert.equal(item.difficulty, '')
  assert.equal(typeof item.excerpt, 'string')
  assert.ok(item.excerpt.includes('记录内容'))
  const scalar = toContentItem({ url: '/knowledge/linux/scalar.html', frontmatter: { category: ' Linux ', platform: ' RK3566 ' } })
  assert.equal(scalar.category, 'Linux')
  assert.equal(scalar.platform, 'RK3566')
  assert.equal(firstOf([null, '', ' RK3566 ']), 'RK3566')
  assert.equal(firstOf({ name: 'unexpected' }), '')
})

test('numeric titles and malformed optional metadata survive collection, filtering and display', () => {
  const { articles } = collectExplore([
    { url: '/knowledge/linux/recent.html', src: '# 正文标题', frontmatter: { title: 2026, status: true, tags: ['Linux'], platform: ['RK3566', {}] } },
    { url: '/experiments/older.html', src: '# 另一个标题', frontmatter: { title: 2025, status: {}, description: ['invalid'], category: ['Linux'] } },
    { url: '/debug/plain.html', src: '# 回退标题', frontmatter: { title: false, status: 'constructor' } },
  ])
  assert.deepEqual(filterExplore(articles, { sort: 'title' }).map(article => article.title), ['2025', '2026', '回退标题'])
  assert.deepEqual(filterExplore(articles, { query: '2026 rk3566' }).map(article => article.url), ['/knowledge/linux/recent.html'])
  assert.ok(articles.every(article => typeof article.title === 'string' && typeof article.status === 'string'))
  assert.doesNotThrow(() => articles.map(article => getStatusText(article.status).replace(/^(?:✓|⟳|🔍|📖)\s*/u, '')))
})

test('status and difficulty lookups ignore inherited properties and non-text values', () => {
  assert.equal(getStatusText(' done '), '✓ 已验证')
  assert.equal(getDifficultyText('beginner'), '入门')
  for (const value of ['constructor', 'toString', '__proto__']) {
    assert.equal(getStatusText(value), value)
    assert.equal(getDifficultyText(value), value)
  }
  for (const value of [true, 123, null, undefined, {}, ['done']]) {
    assert.equal(getStatusText(value), '')
    assert.equal(getDifficultyText(value), '')
  }
})
