/** Reuse the project's existing display statuses without inferring progress. */
export function projectStatusClass(status: unknown): 'complete' | 'planned' | 'active' {
  const text = typeof status === 'string' ? status : ''
  return /完成|发布|已验证/.test(text) ? 'complete' : /规划|构思/.test(text) ? 'planned' : 'active'
}

/** A homepage preview may defer planned work while preserving each group's order. */
export function orderProjectPreview<T extends { status?: unknown }>(projects: readonly T[], preferActive = false): T[] {
  const ordered = [...projects]
  if (preferActive) ordered.sort((a, b) =>
    Number(projectStatusClass(a.status) === 'planned') - Number(projectStatusClass(b.status) === 'planned'))
  return ordered
}
