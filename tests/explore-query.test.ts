import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readExploreQuery, resolveExploreQuery, writeExploreQuery } from '../.vitepress/utils/explore-query.ts'

test('exploration filters survive a URL round trip with Unicode and nested topic IDs', () => {
  const filters = { query: '电机 FOC & ROS', section: 'knowledge', topic: 'topic/电机控制', tag: '电流环', sort: 'oldest' as const }
  const href = writeExploreQuery('/AstralLeap/explore/', filters)
  assert.deepEqual(readExploreQuery(new URL(href, 'https://example.com').search), filters)
})

test('clearing exploration filters retains unrelated URL parameters and anchors', () => {
  const defaults = readExploreQuery('')
  assert.equal(writeExploreQuery('/AstralLeap/explore/?q=Linux&type=debug&topic=camera&tag=mmap&sort=title&from=nav#records', defaults),
    '/AstralLeap/explore/?from=nav#records')
  assert.deepEqual(readExploreQuery('?type=&topic=&sort=invalid'), defaults)
})

test('legacy detail-topic links restore a visible tag while broad themes and unknown values stay removable', () => {
  const topics = [{ id: 'linux', kind: 'theme' as const }, { id: 'mmap', kind: 'tag' as const }]
  assert.deepEqual(resolveExploreQuery('?topic=MMAP&type=experiments', topics), {
    ...readExploreQuery(''), section: 'experiments', topic: 'all', tag: 'mmap',
  })
  assert.equal(resolveExploreQuery('?topic=Linux&tag=MMAP', topics).topic, 'linux')
  assert.equal(resolveExploreQuery('?topic=Linux&tag=MMAP', topics).tag, 'mmap')
  assert.equal(resolveExploreQuery('?topic=unknown', topics).topic, 'unknown')
})

test('search text preserves internal and trailing spaces while empty filters stay out of shared URLs', () => {
  const filters = { ...readExploreQuery(''), query: 'Linux  mmap ' }
  const href = writeExploreQuery('/AstralLeap/explore/', filters)
  assert.equal(readExploreQuery(new URL(href, 'https://example.com').search).query, 'Linux  mmap ')
  assert.equal(writeExploreQuery('/AstralLeap/explore/', { ...filters, query: '   ' }), '/AstralLeap/explore/')
})

test('escaped all names survive shared URLs and legacy tag links without colliding with defaults', () => {
  const topics = [
    { id: '~all', kind: 'theme' as const },
    { id: '~~all', kind: 'theme' as const },
    { id: '~~~all', kind: 'tag' as const },
  ]
  const filters = { ...readExploreQuery(''), topic: '~all', tag: '~~~all', query: 'all ~all' }
  const href = writeExploreQuery('/AstralLeap/explore/?from=nav#records', filters)
  const url = new URL(href, 'https://example.com')
  assert.deepEqual(resolveExploreQuery(url.search, topics), filters)
  assert.equal(url.searchParams.get('topic'), '~all')
  assert.equal(url.searchParams.get('tag'), '~~~all')
  assert.equal(resolveExploreQuery('?topic=~~all', topics).topic, '~~all')
  assert.deepEqual(resolveExploreQuery('?topic=~~~all', topics), {
    ...readExploreQuery(''), topic: 'all', tag: '~~~all',
  })
  assert.deepEqual(resolveExploreQuery('?topic=~all', [{ id: '~all', kind: 'tag' }]), {
    ...readExploreQuery(''), topic: 'all', tag: '~all',
  })
  assert.deepEqual(resolveExploreQuery('?topic=all&tag=all', topics), readExploreQuery(''))
  assert.equal(writeExploreQuery(href, readExploreQuery('')), '/AstralLeap/explore/?from=nav#records')
})
