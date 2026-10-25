import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getExcerpt, getMarkdownTitle } from '../.vitepress/utils/frontmatter.ts'

test('longer closing fences hide example headings and preserve the actual article title', () => {
  for (const marker of ['`', '~']) {
    const source = `${marker.repeat(3)}md\n# Example heading\n${marker.repeat(5)}\n# Actual heading\nActual prose`
    assert.equal(getMarkdownTitle(source), 'Actual heading')
    assert.equal(getExcerpt(source), 'Actual heading。Actual prose')
  }
})

test('short or mismatched fences stay inside code and unclosed examples do not become content', () => {
  const source = '````md\n```\n# Example heading\n~~~\n# Still inside example\n````\n# Actual heading'
  assert.equal(getMarkdownTitle(source), 'Actual heading')
  assert.equal(getExcerpt(source), 'Actual heading')
  assert.equal(getMarkdownTitle('```md\n# Unclosed example'), '')
  assert.equal(getExcerpt('~~~md\n# Unclosed example'), '暂无摘要')
})

test('inline code keeps generics, operators and Markdown characters literal in titles and excerpts', () => {
  const source = '# 使用 `std::vector<int>` 与 `a*b*`\n查看 `[x](path)` 和 `a & b`。'
  assert.equal(getMarkdownTitle(source), '使用 std::vector<int> 与 a*b*')
  assert.equal(getExcerpt(source), '使用 std::vector<int> 与 a*b*。查看 [x](path) 和 a & b')
  assert.equal(getMarkdownTitle('# [使用 `std::vector<int>`](https://example.com) **笔记**'), '使用 std::vector<int> 笔记')
  assert.equal(getMarkdownTitle('# <em>介绍</em> `std::vector<int>`'), '介绍 std::vector<int>')
})

test('code spans use matching delimiter lengths and normalize only surrounding code-span spaces', () => {
  assert.equal(getMarkdownTitle('# `` std::vector<int> `value` `` 笔记'), 'std::vector<int> `value` 笔记')
  assert.equal(getMarkdownTitle('# `std::vector<int>`` 笔记'), '`std::vector`` 笔记')
  assert.equal(getExcerpt('# 笔记\n`std::vector<\nint>`'), '笔记。std::vector< int>')
  assert.equal(getMarkdownTitle('# `&amp;` 与 `<span>`'), '&amp; 与 <span>')
})
