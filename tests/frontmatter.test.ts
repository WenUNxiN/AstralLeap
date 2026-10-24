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
