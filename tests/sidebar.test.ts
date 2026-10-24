import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { createSidebar, sidebarContentPlugin } from '../.vitepress/utils/sidebar.mjs'

function write(root: string, path: string, content: string) {
  const file = join(root, path)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content)
}

function links(items: any[]): string[] {
  return items.flatMap(item => [
    ...(item.link ? [item.link] : []),
    ...links(item.items || []),
  ])
}

test('new knowledge categories and notes appear without registering sidebar entries', t => {
  const root = mkdtempSync(join(tmpdir(), 'astralleap-sidebar-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  const before = createSidebar(root)
  assert.equal(before['/knowledge/new-topic/'], undefined)

  write(root, 'knowledge/new-topic/index.md', '---\ntitle: 新增知识分类\n---\n# 新增知识分类\n')
  write(root, 'knowledge/new-topic/first-note.md', '---\ntitle: 第一篇笔记\n---\n正文\n')
  const after = createSidebar(root)
  assert.ok(links(after['/knowledge/']).includes('/knowledge/new-topic/'))
  assert.ok(links(after['/knowledge/new-topic/']).includes('/knowledge/new-topic/first-note.html'))
  assert.equal(after['/knowledge/new-topic/'][0].items[0].text, '新增知识分类')

  write(root, 'knowledge/new-topic/second-note.md', '---\ntitle: 后续笔记\n---\n正文\n')
  assert.ok(links(createSidebar(root)['/knowledge/new-topic/']).includes('/knowledge/new-topic/second-note.html'))
})

test('new project configuration supplies its own sidebar without central registration', t => {
  const root = mkdtempSync(join(tmpdir(), 'astralleap-sidebar-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  assert.equal(createSidebar(root)['/projects/6-new-project/'], undefined)

  write(root, 'projects/6-new-project/project.json', JSON.stringify({
    name: '新增项目',
    sidebar: [{ text: '项目介绍', link: 'overview' }],
  }))
  write(root, 'projects/6-new-project/overview.md', '# 项目介绍\n')
  const sidebar = createSidebar(root)['/projects/6-new-project/']
  assert.equal(sidebar[0].text, '新增项目')
  assert.deepEqual(links(sidebar), ['/projects/6-new-project/overview.html'])
})

test('new cheatsheet notes appear by adding Markdown files alone', t => {
  const root = mkdtempSync(join(tmpdir(), 'astralleap-sidebar-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  assert.ok(!links(createSidebar(root)['/cheatsheet/']).includes('/cheatsheet/ssh.html'))

  write(root, 'cheatsheet/ssh.md', '---\ntitle: SSH 速查\n---\n正文\n')
  const sidebar = createSidebar(root)['/cheatsheet/']
  assert.ok(links(sidebar).includes('/cheatsheet/ssh.html'))
  assert.equal(sidebar[0].items[0].text, 'SSH 速查')
})


test('new project notes are appended without disturbing configured navigation', t => {
  const root = mkdtempSync(join(tmpdir(), 'astralleap-sidebar-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  write(root, 'projects/6-project/project.json', JSON.stringify({
    name: '项目',
    sidebar: [
      { text: '自定概述', link: 'overview.md#intro' },
      { text: '分组', items: [
        { text: '中文文章', link: '%E8%AF%B4%E6%98%8E.html?source=nav#intro' },
        { text: '项目首页', link: 'index.html' },
        { text: '外部链接', link: 'https://example.com/external' },
      ] },
    ],
  }))
  write(root, 'projects/6-project/overview.md', '# 概述\n')
  write(root, 'projects/6-project/说明.md', '# 说明\n')
  write(root, 'projects/6-project/index.md', '# 项目首页\n')
  const before = createSidebar(root)['/projects/6-project/'][0].items
  write(root, 'projects/6-project/hardware/new-note.md', '# 新硬件记录\n')
  const items = createSidebar(root)['/projects/6-project/'][0].items
  assert.deepEqual(items.slice(0, before.length), before)
  assert.equal(items.length, before.length + 1)
  assert.deepEqual(items.at(-1), { text: '新硬件记录', link: '/projects/6-project/hardware/new-note.html' })
  assert.equal(links(items).filter(link => link.includes('说明') || link.includes('%E8%AF%B4%E6%98%8E')).length, 1)
})

test('project Markdown without a sidebar configuration is discovered recursively', t => {
  const root = mkdtempSync(join(tmpdir(), 'astralleap-sidebar-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  write(root, 'projects/new-project/index.md', '# 项目介绍\n')
  write(root, 'projects/new-project/software/setup.md', '# 软件设置\n')
  assert.deepEqual(new Set(links(createSidebar(root)['/projects/new-project/'])), new Set([
    '/projects/new-project/', '/projects/new-project/software/setup.html',
  ]))
})

test('a configured directory index does not hide a different article with the same basename', t => {
  const root = mkdtempSync(join(tmpdir(), 'astralleap-sidebar-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  write(root, 'projects/project/project.json', JSON.stringify({
    sidebar: [{ text: '专题首页', link: 'setup/index.html' }],
  }))
  write(root, 'projects/project/setup/index.md', '# 专题首页\n')
  write(root, 'projects/project/setup.md', '# 设置记录\n')
  const sidebar = createSidebar(root)['/projects/project/']
  assert.deepEqual(links(sidebar), [
    '/projects/project/setup/index.html', '/projects/project/setup.html',
  ])
})

test('Debug notes inherit their directory group while explicit categories take precedence', t => {
  const root = mkdtempSync(join(tmpdir(), 'astralleap-sidebar-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  write(root, 'debug/camera.md', '---\ntitle: 相机\ncategoryPage: true\n---\n')
  write(root, 'debug/video/index.md', '---\ntitle: 视频\n---\n')
  write(root, 'debug/camera/new.md', '# 新相机问题\n')
  write(root, 'debug/camera/explicit.md', '---\ncategory: video\n---\n# 视频问题\n')
  const groups = createSidebar(root)['/debug/'][0].items
  assert.deepEqual(links(groups.find(item => item.text === '相机').items), ['/debug/camera/new.html'])
  assert.deepEqual(links(groups.find(item => item.text === '视频').items), ['/debug/camera/explicit.html'])
})

test('project note creation and deletion refresh the development sidebar', t => {
  const root = mkdtempSync(join(tmpdir(), 'astralleap-sidebar-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  const site = { themeConfig: { sidebar: createSidebar(root) } }
  const sent = []
  let invalidations = 0
  const module = {}
  const server = {
    config: { vitepress: { site } },
    environments: { client: { moduleGraph: {
      getModuleById: () => module,
      invalidateModule: value => { assert.equal(value, module); invalidations++ },
    } } },
    ws: { send: payload => sent.push(payload) },
  }
  const plugin = sidebarContentPlugin(root)
  const file = join(root, 'projects/new-project/new.md')
  write(root, 'projects/new-project/new.md', '# 新文章\n')
  plugin.hotUpdate.call({ environment: { name: 'client' } }, { type: 'create', file, server })
  assert.ok(links(site.themeConfig.sidebar['/projects/new-project/']).includes('/projects/new-project/new.html'))
  rmSync(file)
  plugin.hotUpdate.call({ environment: { name: 'client' } }, { type: 'delete', file, server })
  assert.deepEqual(links(site.themeConfig.sidebar['/projects/new-project/']), [])
  assert.equal(invalidations, 2)
  assert.equal(sent.length, 2)
  assert.ok(sent.every(payload => payload.type === 'full-reload'))
})


test('Debug explicit categories are trimmed and unknown values do not inherit their directory', t => {
  const root = mkdtempSync(join(tmpdir(), 'astralleap-sidebar-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  write(root, 'debug/camera.md', '---\ntitle: 相机\ncategoryPage: true\n---\n')
  write(root, 'debug/video.md', '---\ntitle: 视频\ncategoryPage: true\n---\n')
  write(root, 'debug/camera/unknown.md', '---\ncategory: other\n---\n# 未知分类\n')
  write(root, 'debug/camera/trimmed.md', '---\ncategory: " Video "\n---\n# 视频分类\n')
  write(root, 'debug/camera/blank.md', '---\ncategory: " "\n---\n# 目录继承\n')
  write(root, 'debug/camera/invalid.md', '---\ncategory: [null, 123, " "]\n---\n# 无有效分类\n')
  const groups = createSidebar(root)['/debug/'][0].items
  assert.deepEqual(new Set(links(groups.find(item => item.text === '相机').items)), new Set([
    '/debug/camera/blank.html', '/debug/camera/invalid.html',
  ]))
  assert.deepEqual(links(groups.find(item => item.text === '视频').items), ['/debug/camera/trimmed.html'])
  assert.deepEqual(links(groups.find(item => item.text === '其他记录').items), ['/debug/camera/unknown.html'])
})

test('nested Debug categories use full paths for explicit metadata and directory inheritance', t => {
  const root = mkdtempSync(join(tmpdir(), 'astralleap-sidebar-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  write(root, 'debug/camera.md', '---\ntitle: 一级相机\ncategoryPage: true\n---\n')
  write(root, 'debug/board/camera/index.md', '# 板卡相机\n')
  write(root, 'debug/host/camera.md', '---\ntitle: 主机相机\ncategoryPage: true\n---\n')
  write(root, 'debug/board/camera/inherited.md', '# 板卡目录记录\n')
  write(root, 'debug/host/camera/inherited.md', '# 主机目录记录\n')
  write(root, 'debug/board-explicit.md', '---\ncategory: " Board/Camera "\n---\n# 板卡显式记录\n')
  write(root, 'debug/host-explicit.md', '---\ncategory: host/camera\n---\n# 主机显式记录\n')
  write(root, 'debug/legacy.md', '---\ncategory: camera\n---\n# 原有一级分类\n')
  const groups = createSidebar(root)['/debug/'][0].items
  assert.deepEqual(new Set(links(groups.find(item => item.text === '板卡相机').items)), new Set([
    '/debug/board/camera/inherited.html', '/debug/board-explicit.html',
  ]))
  assert.deepEqual(new Set(links(groups.find(item => item.text === '主机相机').items)), new Set([
    '/debug/host/camera/inherited.html', '/debug/host-explicit.html',
  ]))
  assert.deepEqual(links(groups.find(item => item.text === '一级相机').items), ['/debug/legacy.html'])
  assert.equal(groups.some(item => item.text === '其他记录'), false)
})

test('new knowledge directories and record files refresh the development sidebar on create, rename and removal', t => {
  const root = mkdtempSync(join(tmpdir(), 'astralleap-sidebar-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  const site = { themeConfig: { sidebar: createSidebar(root) } }
  const sent: any[] = []
  const module = {}
  const server = {
    config: { vitepress: { site } },
    environments: { client: { moduleGraph: { getModuleById: () => module, invalidateModule: () => {} } } },
    ws: { send: (payload: any) => sent.push(payload) },
  }
  const plugin = sidebarContentPlugin(root)
  const update = (path: string, type = 'update') => plugin.hotUpdate.call(
    { environment: { name: 'client' } }, { type, file: join(root, path), server }
  )
  write(root, 'knowledge/foc/index.md', '# 电机控制探索\n')
  write(root, 'knowledge/foc/control/first.md', '# 第一次实验\n')
  update('knowledge/foc/control/first.md', 'create')
  assert.ok(links(site.themeConfig.sidebar['/knowledge/foc/']).includes('/knowledge/foc/control/first.html'))
  assert.equal(site.themeConfig.sidebar['/knowledge/foc/'][0].items[0].text, '电机控制探索')
  write(root, 'knowledge/foc/control/first.md', '---\ntitle: 更新后的标题\n---\n# 第一次实验\n')
  update('knowledge/foc/control/first.md')
  assert.equal(site.themeConfig.sidebar['/knowledge/foc/'][0].items[0].items[0].text, '更新后的标题')
  write(root, 'knowledge/foc/control/first.md', '---\ntitle: 更新后的标题\n---\n# 第一次实验\n新正文\n')
  const before = sent.length
  update('knowledge/foc/control/first.md')
  assert.equal(sent.length, before, 'body-only changes keep normal Markdown HMR without extra sidebar reloads')
  rmSync(join(root, 'knowledge/foc'), { recursive: true })
  update('knowledge/foc/index.md', 'delete')
  assert.equal(site.themeConfig.sidebar['/knowledge/foc/'], undefined)

  for (const section of ['experiments', 'debug', 'cheatsheet']) {
    const path = `${section}/new-topic/first.md`
    const link = `/${section}/new-topic/first.html`
    write(root, path, '# 新主题下的记录\n')
    update(path, 'create')
    assert.ok(links(site.themeConfig.sidebar[`/${section}/`]).includes(link))
    rmSync(join(root, path))
    update(path, 'delete')
    assert.ok(!links(site.themeConfig.sidebar[`/${section}/`]).includes(link))
  }
  assert.ok(sent.every(payload => payload.type === 'full-reload'))
})
