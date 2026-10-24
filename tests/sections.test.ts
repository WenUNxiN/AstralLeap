import { test } from 'node:test'
import assert from 'node:assert/strict'
import { exploreSections, sectionForPath, sections } from '../.vitepress/utils/sections.ts'

test('shared section declarations keep paths unique and select only the four record types for exploration', () => {
  assert.equal(new Set(sections.map(section => section.id)).size, sections.length)
  assert.equal(new Set(sections.map(section => section.path)).size, sections.length)
  assert.deepEqual(exploreSections.map(section => section.id), ['knowledge', 'experiments', 'debug', 'cheatsheet'])
  for (const section of sections) {
    assert.equal(sectionForPath(section.path), section)
    assert.ok(section.label && section.title && section.icon && section.context)
  }
})

test('section resolution supports source paths, deployment bases and Windows paths without claiming unknown columns', () => {
  assert.equal(sectionForPath('knowledge\\linux\\mmap.md')?.id, 'knowledge')
  assert.equal(sectionForPath('/debug/camera/note.html?view=1#result')?.id, 'debug')
  assert.equal(sectionForPath('/AstralLeap/experiments/new/note.html', '/AstralLeap/')?.id, 'experiments')
  assert.equal(sectionForPath('https://example.com/AstralLeap/cheatsheet/new.html', '/AstralLeap/')?.id, 'cheatsheet')
  assert.equal(sectionForPath('/knowledge-archive/note.html'), undefined)
  assert.equal(sectionForPath('/new-column/knowledge/note.html'), undefined)
  assert.equal(sectionForPath('/explore/'), undefined)
})
