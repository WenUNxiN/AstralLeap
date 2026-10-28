const defaults: Record<string, { emoji: string; name: string }> = {
  linux: { emoji: '🐧', name: 'terminal' },
  driver: { emoji: '🔌', name: 'chip' },
  camera: { emoji: '📷', name: 'camera' },
  video: { emoji: '🎬', name: 'film' },
  audio: { emoji: '🎵', name: 'radio' },
  ai: { emoji: '🤖', name: 'sparkles' },
  network: { emoji: '📡', name: 'radio' },
}

/** Retain the existing outline icons and respect a category's custom symbol. */
export function knowledgeIcon(category: { dir: string; icon?: unknown }): { emoji: string; name: string } {
  const fallback = Object.hasOwn(defaults, category.dir) ? defaults[category.dir] : { emoji: '📁', name: 'book' }
  const emoji = typeof category.icon === 'string' ? category.icon.trim() : ''
  return emoji && emoji !== '📁' && emoji !== fallback.emoji
    ? { emoji, name: '' }
    : { emoji: '', name: fallback.name }
}
