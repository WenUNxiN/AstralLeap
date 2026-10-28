import { test } from 'node:test'
import assert from 'node:assert/strict'
import { knowledgeIcon } from '../.vitepress/utils/knowledge-icons.ts'

test('new categories respect their custom icons while existing outlines remain consistent', () => {
  assert.deepEqual(knowledgeIcon({ dir: 'tools', icon: ' 🛠️ ' }), { emoji: '🛠️', name: '' })
  assert.deepEqual(knowledgeIcon({ dir: 'linux', icon: '🌱' }), { emoji: '🌱', name: '' })
  assert.deepEqual(knowledgeIcon({ dir: 'linux', icon: '🐧' }), { emoji: '', name: 'terminal' })
  assert.deepEqual(knowledgeIcon({ dir: 'camera', icon: '📷' }), { emoji: '', name: 'camera' })
})

test('absent and invalid category icons have a safe default, including reserved object names', () => {
  for (const icon of [undefined, '', ' ', '📁', true, {}]) {
    assert.deepEqual(knowledgeIcon({ dir: 'new-category', icon }), { emoji: '', name: 'book' })
  }
  assert.deepEqual(knowledgeIcon({ dir: 'constructor' }), { emoji: '', name: 'book' })
  assert.deepEqual(knowledgeIcon({ dir: 'linux' }), { emoji: '', name: 'terminal' })
})
