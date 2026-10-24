/** Add optional file names to VitePress code fences without treating titles as replacement syntax. */
export function codeTitles(md) {
  const originalFence = md.renderer.rules.fence
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const rendered = originalFence(tokens, idx, options, env, self)
    const match = (tokens[idx].info || '').match(/\btitle\s*=\s*(?:"([^"]*)"|'([^']*)')/)
    if (!match) return rendered
    let title = match[1] ?? match[2]
    try { title = decodeURIComponent(title) } catch { /* Preserve literal percent signs. */ }
    const escaped = md.utils.escapeHtml(title)
    return rendered.replace(
      /<div class="language-[^"]*"[^>]*>/,
      wrapper => `${wrapper}<span class="title">${escaped}</span>`
    )
  }
}
