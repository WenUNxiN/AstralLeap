import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createMarkdownRenderer } from 'vitepress'
import config from '../.vitepress/config.mjs'

// Exercise the actual site Markdown configuration and VitePress fence renderer.
const renderer = createMarkdownRenderer(process.cwd(), config.markdown, '/AstralLeap/')

test('code titles preserve replacement tokens and apostrophes as literal text', async () => {
  const md = await renderer
  for (const title of ['echo $&', 'echo $1', "echo $'"]) {
    const html = await md.renderAsync('```bash title="' + title + '"\necho ok\n```')
    assert.ok(html.includes('<span class="title">' + md.utils.escapeHtml(title) + '</span>'), title)
    assert.equal((html.match(/<div class="language-bash">/g) || []).length, 1, title)
    assert.equal((html.match(/<pre\b/g) || []).length, 1, title)
    assert.ok(html.includes('class="copy"'), title)
  }
})

test('decoded code titles are escaped and quoted attributes retain their matching delimiter', async () => {
  const md = await renderer
  const title = '<img src="x" onerror="alert(1)"> & "quoted"'
  const encoded = encodeURIComponent(title)
  const html = await md.renderAsync('```bash title="' + encoded + '"\necho ok\n```')
  assert.ok(html.includes('<span class="title">' + md.utils.escapeHtml(title) + '</span>'))
  assert.ok(!html.includes('<img'))

  const quoted = await md.renderAsync('```bash title=\'say "hello"\'\necho ok\n```')
  assert.ok(quoted.includes('<span class="title">say &quot;hello&quot;</span>'))
})

test('ordinary fences and literal percent signs retain their original content', async () => {
  const md = await renderer
  const plain = await md.renderAsync('```bash\necho ok\n```')
  assert.ok(!plain.includes('<span class="title">'))
  const percent = await md.renderAsync('```bash title="100% complete"\necho ok\n```')
  assert.ok(percent.includes('<span class="title">100% complete</span>'))
})
