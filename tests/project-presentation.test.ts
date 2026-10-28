import { test } from 'node:test'
import assert from 'node:assert/strict'
import { orderProjectPreview, projectStatusClass } from '../.vitepress/utils/project-presentation.ts'

test('the full project collection keeps its original numbered order by default', () => {
  const projects = [
    { folder: '5-scope', status: '构思中' },
    { folder: '4-home', status: '规划中' },
    { folder: '3-ai', status: '开发中' },
    { folder: '1-watch', status: '进行中' },
  ]
  assert.deepEqual(orderProjectPreview(projects).map(project => project.folder), [
    '5-scope', '4-home', '3-ai', '1-watch',
  ])
  assert.deepEqual(orderProjectPreview(projects, true).slice(0, 2).map(project => project.folder), ['3-ai', '1-watch'])
  assert.deepEqual(projects.map(project => project.folder), ['5-scope', '4-home', '3-ai', '1-watch'])
})

test('homepage priority only defers planned work and keeps all other statuses in their existing order', () => {
  const projects = [
    { folder: 'planning', status: '规划中' },
    { folder: 'verified', status: '已验证' },
    { folder: 'unspecified' },
    { folder: 'idea', status: '构思中' },
    { folder: 'active', status: '进行中' },
    { folder: 'unknown', status: '暂停整理' },
  ]
  const original = [...projects]
  assert.deepEqual(orderProjectPreview(projects, true).map(project => project.folder), [
    'verified', 'unspecified', 'active', 'unknown', 'planning', 'idea',
  ])
  assert.deepEqual(projects, original)
})

test('project display classes preserve existing status meanings with an active default', () => {
  assert.equal(projectStatusClass('开发中'), 'active')
  assert.equal(projectStatusClass('规划中'), 'planned')
  assert.equal(projectStatusClass('构思中'), 'planned')
  assert.equal(projectStatusClass('已发布'), 'complete')
  assert.equal(projectStatusClass('已验证'), 'complete')
  assert.equal(projectStatusClass(undefined), 'active')
  assert.equal(projectStatusClass('暂停整理'), 'active')
  assert.equal(projectStatusClass(123), 'active')
})
