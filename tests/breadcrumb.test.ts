import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildBreadcrumbs } from '../.vitepress/utils/breadcrumb.ts'

const categories = [{ dir: 'linux', name: '嵌入式 Linux', url: '/knowledge/linux/' }]

test('section and category indexes have exactly their own current crumb', () => {
  assert.deepEqual(buildBreadcrumbs('knowledge/index.md', '知识库', categories), [
    { label: '探索', url: '/explore/' },
    { label: '知识库', url: null }
  ])
  assert.deepEqual(buildBreadcrumbs('knowledge/linux/index.md', '嵌入式 Linux', categories), [
    { label: '探索', url: '/explore/' },
    { label: '知识库', url: '/knowledge/' }, { label: '嵌入式 Linux', url: null }
  ])
})

test('deep directory indexes keep their current title and the containing category link', () => {
  assert.deepEqual(buildBreadcrumbs('knowledge/linux/memory/index.md', '内存专题', categories), [
    { label: '探索', url: '/explore/' },
    { label: '知识库', url: '/knowledge/' },
    { label: '嵌入式 Linux', url: '/knowledge/linux/' },
    { label: '内存专题', url: null }
  ])
  assert.deepEqual(buildBreadcrumbs('projects/motor/index.md', '电机控制项目'), [
    { label: '项目', url: '/projects/' }, { label: '电机控制项目', url: null }
  ])
  assert.deepEqual(buildBreadcrumbs('experiments/motor/index.md', '电机实验'), [
    { label: '探索', url: '/explore/' },
    { label: '实验记录', url: '/experiments/' }, { label: '电机实验', url: null }
  ])
})

test('article and standalone breadcrumbs preserve page labels and normalize Windows paths', () => {
  assert.deepEqual(buildBreadcrumbs('knowledge\\linux\\memory\\mmap.md', 'MMAP', categories), [
    { label: '探索', url: '/explore/' },
    { label: '知识库', url: '/knowledge/' },
    { label: '嵌入式 Linux', url: '/knowledge/linux/' },
    { label: 'MMAP', url: null }
  ])
  assert.deepEqual(buildBreadcrumbs('about.md', '关于我'), [{ label: '关于我', url: null }])
  assert.deepEqual(buildBreadcrumbs('index.md', '首页'), [])
  assert.deepEqual(buildBreadcrumbs('explore/index.md', '探索'), [{ label: '探索', url: null }])
})
