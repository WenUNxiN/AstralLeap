/** Match metadata from existing notes or the directory chosen for new notes. */
export function matchesDebugCategory(
  article: { category?: unknown; url: string },
  category: string
): boolean {
  const target = category.trim().toLowerCase()
  if (!target) return false
  const categories = Array.isArray(article.category) ? article.category : [article.category]
  const explicit = categories.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
  if (explicit.length) return explicit.some(value => value.trim().toLowerCase() === target)

  // A note placed under debug/camera/ belongs to Camera without extra metadata.
  let path = article.url.split(/[?#]/, 1)[0]
  try { path = decodeURIComponent(path) } catch { /* Keep valid unescaped paths usable. */ }
  return path.toLowerCase().startsWith(`/debug/${target}/`)
}
