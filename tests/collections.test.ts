import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { collectArticles, collectKnowledge } from '../.vitepress/utils/content-collections.ts'

const entry = (url: string, frontmatter = {}) => ({ url, frontmatter })

test('collection cards retain nested articles with duplicate basenames and exclude navigation pages', () => {
  const articles = collectArticles([
    entry('/experiments/'), entry('/experiments/camera/'),
    entry('/experiments/category.html', { categoryPage: true }),
    entry('/experiments/camera/setup.html', { date: '2026-10-23' }),
    entry('/experiments/audio/setup.html', { date: '2026-10-22' }),
  ])
  assert.deepEqual(articles.map(article => article.url), [
    '/experiments/camera/setup.html', '/experiments/audio/setup.html'
  ])
  assert.equal(articles[0].slug, articles[1].slug)
})

test('nested knowledge indexes do not override category metadata or become articles', () => {
  const data = collectKnowledge([
    entry('/knowledge/'),
    entry('/knowledge/linux/', { title: '嵌入式 Linux', icon: '🐧' }),
    entry('/knowledge/linux/memory/', { title: '内存专题' }),
    entry('/knowledge/linux/memory/mmap.html'),
    entry('/knowledge/linux/process/mmap.html'),
    entry('/knowledge/linux/navigation.html', { categoryPage: true }),
  ])
  assert.deepEqual(data.categories, [{
    dir: 'linux', name: '嵌入式 Linux', icon: '🐧', description: '', count: 2, url: '/knowledge/linux/'
  }])
  assert.equal(data.articles.length, 2)
  assert.ok(data.articles.every(article => article.dir === 'linux'))
})

test('knowledge categories use Markdown headings and a default icon when metadata is absent', () => {
  const data = collectKnowledge([
    { ...entry('/knowledge/foc/'), src: '# 电机控制探索\n' },
    { ...entry('/knowledge/foc/first.html'), src: '# 第一次记录\n' },
    { ...entry('/knowledge/ros/'), src: '分类介绍\n' },
    { ...entry('/knowledge/ros/first.html'), src: '# ROS 记录\n' },
  ])
  assert.deepEqual(data.categories.map(({ name, icon }) => ({ name, icon })), [
    { name: '电机控制探索', icon: '📁' }, { name: 'ros', icon: '📁' },
  ])
})

test('actual VitePress loaders discover files placed in nested directories without registration', async t => {
  const root = mkdtempSync(join(tmpdir(), 'astralleap-collections-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  const write = (path: string, source: string) => {
    const file = join(root, path)
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, source)
  }
  for (const section of ['experiments', 'debug', 'cheatsheet']) {
    write(`${section}/index.md`, '# 首页')
    write(`${section}/topic/index.md`, '# 专题首页')
    write(`${section}/topic/first.md`, '# 首篇')
    write(`${section}/other/first.md`, '# 同名文章')
    write(`${section}/category.md`, '---\ncategoryPage: true\n---\n# 导航页')
  }
  write('knowledge/linux/index.md', '---\ntitle: 嵌入式 Linux\n---\n')
  write('knowledge/linux/memory/index.md', '---\ntitle: 内存专题\n---\n')
  write('knowledge/linux/memory/mmap.md', '# MMAP')
  const state = globalThis as any
  const previous = state.VITEPRESS_CONFIG
  state.VITEPRESS_CONFIG = {
    srcDir: root, publicDir: join(root, 'public'), markdown: {},
    site: { locales: {}, base: '/' }, rewrites: { map: {} }, buildConcurrency: 1
  }
  t.after(() => {
    if (previous === undefined) delete state.VITEPRESS_CONFIG
    else state.VITEPRESS_CONFIG = previous
  })
  for (const section of ['experiments', 'debug', 'cheatsheet']) {
    const { default: loader } = await import(`../.vitepress/data/${section}.data.ts`)
    const articles = await loader.load()
    assert.deepEqual(articles.map((article: any) => article.url).sort(), [
      `/${section}/other/first.html`, `/${section}/topic/first.html`
    ])
    // Repeat after adding a file: no loader/config edits are needed.
    write(`${section}/topic/later.md`, '# 后续文章')
    assert.equal((await loader.load()).length, 3)
    rmSync(join(root, section, 'topic/later.md'))
    assert.equal((await loader.load()).length, 2)
  }
  const { default: knowledge } = await import('../.vitepress/data/knowledge.data.ts')
  const data = await knowledge.load()
  assert.equal(data.articles[0].url, '/knowledge/linux/memory/mmap.html')
  assert.equal(data.categories[0].name, '嵌入式 Linux')
  assert.equal(data.categories[0].count, 1)
  write('knowledge/foc/index.md', '# 电机控制探索')
  write('knowledge/foc/control/setup.md', '# 控制环境')
  write('knowledge/foc/hardware/setup.md', '# 硬件环境')
  const expanded = await knowledge.load()
  const category = expanded.categories.find((category: any) => category.dir === 'foc')
  assert.equal(category.name, '电机控制探索')
  assert.equal(category.count, 2)
  assert.deepEqual(expanded.articles.filter((article: any) => article.dir === 'foc').map((article: any) => article.url).sort(), [
    '/knowledge/foc/control/setup.html', '/knowledge/foc/hardware/setup.html',
  ])
  rmSync(join(root, 'knowledge/foc'), { recursive: true })
  assert.equal((await knowledge.load()).categories.length, 1)
})
