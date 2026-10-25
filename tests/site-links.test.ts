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

test('the configured origin checks absolute and protocol-relative self-links alongside relative links', t => {
  const write = fixture(t)
  write('notes/index.html', '<h1 id="target">Note</h1>')
  write('asset.svg', '<svg/>')
  const root = write('index.html', `
    <a href="https://wenunxin.github.io/AstralLeap/notes/#target">Absolute</a>
    <a href="//wenunxin.github.io/AstralLeap/notes/">Protocol relative</a>
    <a href="./notes/#target">Relative</a>
    <img src="https://wenunxin.github.io/AstralLeap/asset.svg">
    <a href="https://external.example/AstralLeap/missing.html">External</a>
    <a href="https://wenunxin.github.io.external.example/AstralLeap/missing.html">Different host</a>
    <a href="https://wenunxin.github.io:444/AstralLeap/missing.html">Different port</a>`)
  const result = checkSiteLinks(root, '/AstralLeap/', 'https://wenunxin.github.io')
  assert.equal(result.checked, 4)
  assert.deepEqual(result.errors, [])
})

test('absolute self-links report missing files, missing fragments and paths outside the configured base', t => {
  const write = fixture(t)
  const root = write('index.html', `
    <a href="https://wenunxin.github.io/AstralLeap/nonexistent.html">Missing</a>
    <a href="//wenunxin.github.io/another-site/">Wrong base</a>
    <a href="https://wenunxin.github.io/AstralLeap/#missing">Missing anchor</a>`)
  const result = checkSiteLinks(root, '/AstralLeap/', 'https://wenunxin.github.io')
  assert.equal(result.checked, 3)
  assert.deepEqual(result.errors.map(error => error.reason), [
    '目标文件不存在', '链接超出站点 base /AstralLeap/', '锚点不存在：missing'
  ])
})

test('raw-text examples cannot create links or anchor targets while their own attributes remain visible', t => {
  const write = fixture(t)
  write('app.js', '// script')
  write('asset.svg', '<svg/>')
  write('embedded.html', '<p>Frame</p>')
  const elements = ['textarea', 'title', 'style', 'xmp', 'iframe', 'noembed', 'noframes', 'noscript']
  const root = write('index.html', elements.map(name => `
    <${name.toUpperCase()} id="real-${name}" data-note="a > b" ${name === 'iframe' ? 'src="./embedded.html"' : ''}>
      <a href="missing-in-${name}.html"><span id="fake-${name}">Literal markup</span></a>
      </${name}-example><img src="also-missing-${name}.png">
    </${name.toUpperCase()} >
    <a href="#real-${name}">Real element</a><a href="#fake-${name}">Not a real target</a>`).join('') + `
    <script src="./app.js" id="real-script"><a href="missing-in-script.html" id="fake-script">Literal</a></script>
    <a href="#real-script">Script element</a><a href="#fake-script">Not a real target</a>
    <textarea href="./asset.svg">An opening href is still inspected.</textarea>`)
  const result = checkSiteLinks(root, '/AstralLeap/')
  assert.equal(result.checked, elements.length * 2 + 5)
  assert.deepEqual(result.errors.map(error => error.reason), [
    ...elements.map(name => `锚点不存在：fake-${name}`), '锚点不存在：fake-script'
  ])
})

test('raw-text resource attributes are still checked for missing files', t => {
  const write = fixture(t)
  const root = write('index.html', `
    <script src="missing-script.js">'<a href="ignored.html">'</script>
    <iframe src="missing-frame.html"><a href="ignored-frame.html">Fallback</a></iframe>
    <textarea href="missing-own-link.html"><a href="ignored-textarea.html">Example</a></textarea>`)
  const result = checkSiteLinks(root, '/AstralLeap/')
  assert.deepEqual(result.errors.map(error => error.link), ['missing-script.js', 'missing-frame.html', 'missing-own-link.html'])
})

test('comments inside scripts and raw text do not remove subsequent real HTML', t => {
  const write = fixture(t)
  const root = write('index.html', `
    <script data-note="x > y">const start = '<!--'; const end = '</script-example>';</script >
    <h1 id="visible">Real heading between script and later comment</h1>
    <textarea><!-- <a href="missing-example.html">Literal</a></textarea>
    <style>.example::after { content: '<!-- <a href="missing-css.html">'; }</style>
    <!-- <a href="missing-comment.html">Ignored comment</a> -->
    <a href="#visible">Visible link</a>`)
  const result = checkSiteLinks(root, '/AstralLeap/')
  assert.equal(result.checked, 1)
  assert.deepEqual(result.errors, [])
})

test('script double-escaped end tags stay literal until the real script end', t => {
  const write = fixture(t)
  const root = write('index.html', `
    <script><!--<script>const example = "</script><a href='missing-example.html' id='fake'>literal</a>";--></script>
    <h1 id="real">Real</h1><a href="#real">Real target</a><a href="#fake">Missing target</a>`)
  const result = checkSiteLinks(root, '/AstralLeap/')
  assert.equal(result.checked, 2)
  assert.deepEqual(result.errors.map(error => error.reason), ['锚点不存在：fake'])
})

test('unclosed raw text consumes the remaining document and HTML comment endings resume scanning', t => {
  const write = fixture(t)
  for (const tag of ['textarea', 'style', 'script', 'plaintext']) {
    write(`${tag}.html`, `<${tag}><a href="missing-${tag}.html">Literal until EOF</a>`)
  }
  const root = write('index.html', `
    <!--><h1 id="one">One</h1><!---><h2 id="two">Two</h2>
    <!-- example --!><h2 id="three">Three</h2>
    <a href="#one">One</a><a href="#two">Two</a><a href="#three">Three</a>`)
  const result = checkSiteLinks(root, '/AstralLeap/')
  assert.equal(result.checked, 3)
  assert.deepEqual(result.errors, [])
})
