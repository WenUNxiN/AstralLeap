import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import loader from '../.vitepress/data/projects.data.ts'

function files(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap(entry => {
    const file = join(root, entry.name)
    return entry.isDirectory() ? files(file) : [file]
  })
}

function fixture(t: any) {
  const root = mkdtempSync(join(tmpdir(), 'astralleap-projects-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  return {
    root,
    write(path: string, source: string) {
      const file = join(root, path)
      mkdirSync(dirname(file), { recursive: true })
      writeFileSync(file, source)
    },
    cards: () => loader.load(files(root)),
  }
}

test('project cards select a real index without requiring a configured link or optional styling', t => {
  const { write, cards } = fixture(t)
  write('6-new/project.json', JSON.stringify({ name: '新项目', sidebar: [{ link: 'setup' }] }))
  write('6-new/index.md', '# 新项目首页\nPrivate article body')
  write('6-new/setup.md', '# 设置')
  const [card] = cards()
  assert.equal(card.link, '/projects/6-new/')
  assert.equal(card.number, '06')
  assert.equal(card.name, '新项目')
  assert.equal('sidebar' in card, false)
  assert.equal(JSON.stringify(card).includes('Private article body'), false)
})

test('project entry fallback uses a valid configured nested page before another discovered note', t => {
  const { write, cards } = fixture(t)
  write('project/project.json', JSON.stringify({ sidebar: [
    { link: 'https://example.com/reference' },
    { link: 'missing-page' },
    { text: '分组', items: [{ link: 'hardware/%E8%AE%BE%E7%BD%AE.md?view=1#first' }] },
  ] }))
  write('project/first.md', '# 普通记录')
  write('project/hardware/设置.md', '# 硬件设置')
  assert.equal(cards()[0].link, '/projects/project/hardware/%E8%AE%BE%E7%BD%AE.html?view=1#first')
})

test('a configured article does not resolve to a different directory page with the same basename', t => {
  const { write, cards } = fixture(t)
  write('project/project.json', JSON.stringify({ sidebar: [
    { link: 'setup.html' }, { link: 'real.md' },
  ] }))
  write('project/setup/index.md', '# 专题首页')
  write('project/real.md', '# 真实入口')
  assert.equal(cards()[0].link, '/projects/project/real.html')
})

test('new nested Markdown and deletion refresh project fallback entries without modifying configuration', t => {
  const { root, write, cards } = fixture(t)
  write('project/project.json', '{}')
  assert.deepEqual(cards(), [])
  write('project/software/setup.md', '# 软件设置')
  assert.equal(cards()[0].link, '/projects/project/software/setup.html')
  write('project/index.md', '# 项目首页')
  assert.equal(cards()[0].link, '/projects/project/')
  rmSync(join(root, 'project/index.md'))
  assert.equal(cards()[0].link, '/projects/project/software/setup.html')
  rmSync(join(root, 'project/software'), { recursive: true })
  assert.deepEqual(cards(), [])
})

test('project cards retain configured local and external routes and sort by project number', t => {
  const { write, cards } = fixture(t)
  write('2-local/project.json', JSON.stringify({ link: '/projects/2-local/说明.md?view=1#intro' }))
  write('10-external/project.json', JSON.stringify({ link: 'https://example.com/project' }))
  write('1-directory/project.json', JSON.stringify({ link: '/projects/1-directory/' }))
  write('unlisted/note.md', '# 没有配置的项目不会产生展示卡片')
  assert.deepEqual(cards().map(({ folder, link }) => ({ folder, link })), [
    { folder: '10-external', link: 'https://example.com/project' },
    { folder: '2-local', link: '/projects/2-local/说明.html?view=1#intro' },
    { folder: '1-directory', link: '/projects/1-directory/' },
  ])
})
