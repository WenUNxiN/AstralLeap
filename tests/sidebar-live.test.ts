import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rename, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { createServer, resolveConfig } from 'vitepress'
import { createSidebar, sidebarContentPlugin } from '../.vitepress/utils/sidebar.mjs'

async function waitFor(check: () => boolean | Promise<boolean>, message: string) {
  const deadline = Date.now() + 8000
  while (Date.now() < deadline) {
    if (await check()) return
    await new Promise(done => setTimeout(done, 40))
  }
  assert.fail(message)
}

test('real development watcher refreshes cached site data for nested notes without config edits', { timeout: 30000 }, async () => {
  const root = await mkdtemp(join(tmpdir(), 'astralleap-sidebar-live-'))
  const srcDir = join(root, 'src')
  const state = globalThis as any
  const previous = state.VITEPRESS_CONFIG
  let server: Awaited<ReturnType<typeof createServer>> | undefined
  try {
    await mkdir(join(root, '.vitepress'), { recursive: true })
    await mkdir(srcDir)
    await writeFile(join(root, '.vitepress/config.mjs'), 'export default { srcDir: "src", lastUpdated: false, vite: { logLevel: "silent" } }\n')
    await writeFile(join(srcDir, 'index.md'), '# Fixture homepage\n')
    const config = await resolveConfig(root)
    config.site.themeConfig.sidebar = createSidebar(srcDir)
    config.vite = { ...config.vite, plugins: [sidebarContentPlugin(srcDir)] }
    server = await createServer(root, { host: '127.0.0.1', port: 0 }, undefined, config)
    await server.listen()
    await waitFor(() => Object.keys(server!.watcher.getWatched()).some(path => resolve(path) === srcDir), 'source directory was not watched')

    // Populate the real module graph and transform cache before changing files.
    const initial = await server.transformRequest('/@siteData')
    assert.ok(initial)
    let reloads = 0
    const send = server.ws.send.bind(server.ws)
    server.ws.send = ((...args: any[]) => {
      if (args[0]?.type === 'full-reload') reloads++
      return (send as any)(...args)
    }) as typeof server.ws.send
    const siteData = async () => (await server!.transformRequest('/@siteData'))!.code

    const category = join(srcDir, 'knowledge/new-topic')
    await mkdir(join(category, 'nested'), { recursive: true })
    await writeFile(join(category, 'index.md'), '# New category\n')
    await writeFile(join(category, 'nested/note.md'), '# First nested note\n')
    const firstUrl = '/knowledge/new-topic/nested/note.html'
    assert.equal(initial.code.includes(firstUrl), false)
    await waitFor(async () => (await siteData()).includes(firstUrl), 'new nested note was not published through cached @siteData')
    assert.ok(reloads > 0, 'new category and note should notify connected clients')

    await writeFile(join(category, 'nested/note.md'), '# Updated nested title\n')
    await waitFor(async () => (await siteData()).includes('Updated nested title'), 'heading changes did not refresh the sidebar')

    await rename(join(category, 'nested/note.md'), join(category, 'nested/renamed.md'))
    const renamedUrl = '/knowledge/new-topic/nested/renamed.html'
    await waitFor(async () => {
      const data = await siteData()
      return data.includes(renamedUrl) && !data.includes(firstUrl)
    }, 'renamed note did not replace its previous sidebar URL')

    await rm(category, { recursive: true })
    await waitFor(async () => !(await siteData()).includes('/knowledge/new-topic/'), 'removed category remained in cached @siteData')
  } finally {
    await server?.close()
    if (previous === undefined) delete state.VITEPRESS_CONFIG
    else state.VITEPRESS_CONFIG = previous
    await rm(root, { recursive: true, force: true })
  }
})
