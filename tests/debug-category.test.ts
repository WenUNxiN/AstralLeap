import { test } from 'node:test'
import assert from 'node:assert/strict'
import { debugCategoryId, matchesDebugCategory } from '../.vitepress/utils/debug-category.ts'

test('Debug classification accepts existing category strings and arrays case-insensitively', () => {
  assert.equal(matchesDebugCategory({ url: '/debug/note.html', category: ' Camera ' }, 'camera'), true)
  assert.equal(matchesDebugCategory({ url: '/debug/note.html', category: ['V4L2', 'Camera'] }, 'CAMERA'), true)
  assert.equal(matchesDebugCategory({ url: '/debug/note.html', category: ['MPP', null, 12] }, 'Camera'), false)
  assert.equal(matchesDebugCategory({ url: '/debug/camera/note.html', category: 'video' }, 'camera'), false)
  assert.equal(matchesDebugCategory({ url: '/debug/camera/note.html', category: 'video' }, 'video'), true)
})

test('new Debug notes inherit classification from their directory without metadata', () => {
  assert.equal(matchesDebugCategory({ url: '/debug/camera/new-note.html' }, 'Camera'), true)
  assert.equal(matchesDebugCategory({ url: '/debug/camera/sensor/new-note.html' }, 'camera'), true)
  assert.equal(matchesDebugCategory({ url: '/debug/camera-2/new-note.html' }, 'camera'), false)
  assert.equal(matchesDebugCategory({ url: '/debug/new-note.html' }, 'camera'), false)
  assert.equal(matchesDebugCategory({ url: '/debug/camera/new-note.html' }, ''), false)
})

test('Debug directory matching handles encoded Unicode and URL suffixes', () => {
  assert.equal(matchesDebugCategory({ url: '/debug/%E7%9B%B8%E6%9C%BA/note.html?view=1#section' }, '相机'), true)
})

test('nested Debug category pages retain their full path and distinguish repeated names', () => {
  const board = debugCategoryId('/debug/board/camera/index.html')
  const host = debugCategoryId('/debug/host/camera/')
  assert.equal(board, 'board/camera')
  assert.equal(host, 'host/camera')
  assert.equal(debugCategoryId('/debug/camera.html'), 'camera')
  assert.equal(debugCategoryId('debug/board/camera.md'), board)
  assert.equal(matchesDebugCategory({ url: '/debug/board/camera/note.html' }, board), true)
  assert.equal(matchesDebugCategory({ url: '/debug/board/camera/note.html' }, host), false)
  assert.equal(matchesDebugCategory({ url: '/debug/note.html', category: ' Board/Camera ' }, board), true)
  assert.equal(matchesDebugCategory({ url: '/debug/note.html', category: 'board/camera' }, host), false)
})
