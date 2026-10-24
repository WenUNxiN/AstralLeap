function normalizeCategory(category: string): string {
  return category.trim().replace(/^\/+|\/+$/g, '').toLowerCase()
}

function debugPath(url: string): string {
  const path = url.split(/[?#]/, 1)[0]
  try { return decodeURIComponent(path) } catch { return path }
}

/** Both flat category pages and nested indexes identify their full Debug path. */
export function debugCategoryId(page: string): string {
  return normalizeCategory(debugPath(page)
    .replace(/^\/?debug\//i, '')
    .replace(/(?:^|\/)index\.(?:md|html)$/i, '/')
    .replace(/\.(?:md|html)$/i, ''))
}

/** Match metadata from existing notes or the directory chosen for new notes. */
export function matchesDebugCategory(
  article: { category?: unknown; url: string },
  category: string
): boolean {
  const target = normalizeCategory(category)
  if (!target) return false
  const categories = Array.isArray(article.category) ? article.category : [article.category]
  const explicit = categories.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
  if (explicit.length) return explicit.some(value => normalizeCategory(value) === target)

  // A note placed under debug/camera/ belongs to Camera without extra metadata.
  return debugPath(article.url).toLowerCase().startsWith(`/debug/${target}/`)
}
