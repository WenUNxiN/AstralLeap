/** Normalize both configured and discovered project links in one place. */
export function projectLink(base, target) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(target)) return target
  const link = target.startsWith('/') ? target : base + target
  const [, path, suffix = ''] = link.match(/^([^?#]*)([?#].*)?$/)
  if (!path || path.endsWith('/') || /\.[a-z\d]+$/i.test(path) && !path.endsWith('.md')) return link
  return path.replace(/\.md$/, '') + '.html' + suffix
}

/** Compare page identities rather than anchor/query variants or encoded paths. */
export function projectPageKey(link) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(link)) return null
  let path = new URL(link, 'https://astralleap.invalid').pathname
  try { path = decodeURIComponent(path) } catch { /* Preserve malformed escapes as-is. */ }
  // /topic.html and /topic/ can be two different Markdown pages. Only an
  // explicit index filename aliases the directory route.
  return path.replace(/\.(?:md|html)$/, '').replace(/\/index$/, '/')
}
