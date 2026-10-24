import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { checkSiteLinks } from '../.vitepress/utils/site-links.mjs'

function fixture(t: any) {
  const root = mkdtempSync(join(tmpdir(), 'astralleap-links-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  return (path: string, html: string) => {
    const file = join(root, path)
    mkdirSync(join(file, '..'), { recursive: true })
    writeFileSync(file, html)
    return root
  }
}

test('rendered cards, nested routes, encoded URLs and fragment links resolve under the site base', t => {
  const write = fixture(t)
  write('notes/index.html', `<h1 id="标题 &amp; 内容">Title</h1><a href='../'>Home</a>`)
  write('notes/中文 文件.html', `<h1 id='例子'>Title</h1><img src="../asset.svg">`)
  write('asset.svg', '<svg/>')
  const root = write('index.html', `<a href="/AstralLeap/notes/#${encodeURIComponent('标题 & 内容')}">Category</a>
    <a href='./notes/中文%20文件.html?x=1&amp;y=2#例子'>Note</a>
    <a href='/AstralLeap/notes/中文%20文件'>Extensionless</a>
    <a href='https://external.example/missing'>External</a>
    <a href='mailto:example@example.com'>Mail</a>
    <!-- <a href="missing">Not rendered</a> -->
    <script>const example = '<a href="missing">';</script>`)
  const result = checkSiteLinks(root, '/AstralLeap/')
  assert.equal(result.pages, 3)
  assert.equal(result.checked, 5)
  assert.deepEqual(result.errors, [])
})

test('rendered links report missing files, anchors, malformed encoding and wrong base paths', t => {
  const write = fixture(t)
  const root = write('index.html', `<h1 id="home">Home</h1>
    <a href='missing.html'>Missing</a><img src='/asset.svg'>Wrong base</a>
    <a href='#absent'>Missing heading</a><a href='%E0%A4%A'>Bad encoding</a>
    <a href='#home:~:text=Home'>Text fragment</a><a href='#TOP'>Top of document</a>`)
  const result = checkSiteLinks(root, '/AstralLeap/')
  assert.deepEqual(result.errors.map(error => error.reason), [
    '目标文件不存在', '链接超出站点 base /AstralLeap/', '锚点不存在：absent', '无效 URL 编码',
  ])
  assert.ok(result.errors.every(error => error.page === 'index.html'))
})
