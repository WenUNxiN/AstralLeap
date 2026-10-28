export interface ExploreQuery {
  query: string
  section: string
  topic: string
  tag: string
  state: 'all' | 'doing' | 'done'
  sort: 'recent' | 'oldest' | 'title'
}

/** Keep shared links and browser history independent from display labels. */
export function readExploreQuery(search: string): ExploreQuery {
  const params = new URLSearchParams(search)
  const sort = params.get('sort')
  const state = params.get('state')
  return {
    query: params.get('q') || '',
    section: params.get('type')?.trim() || 'all',
    topic: params.get('topic')?.trim() || 'all',
    tag: params.get('tag')?.trim() || 'all',
    state: state === 'doing' || state === 'done' ? state : 'all',
    sort: sort === 'oldest' || sort === 'title' ? sort : 'recent'
  }
}

/** Change only exploration filters, retaining unrelated parameters and anchors. */
export function writeExploreQuery(href: string, filters: ExploreQuery): string {
  const url = new URL(href, 'https://explore.invalid')
  const values = {
    q: filters.query.trim() ? filters.query : '',
    type: filters.section === 'all' ? '' : filters.section,
    topic: filters.topic === 'all' ? '' : filters.topic,
    tag: filters.tag === 'all' ? '' : filters.tag,
    state: filters.state === 'all' ? '' : filters.state,
    sort: filters.sort === 'recent' ? '' : filters.sort
  }
  for (const [key, value] of Object.entries(values)) {
    if (value) url.searchParams.set(key, value)
    else url.searchParams.delete(key)
  }
  return url.pathname + url.search + url.hash
}

/** Old links used topic for every tag. Keep them useful after separating facets. */
export function resolveExploreQuery(search: string, topics: readonly { id: string; kind: 'theme' | 'tag' }[]): ExploreQuery {
  const filters = readExploreQuery(search)
  const normalize = (value: string) => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en')
  filters.topic = normalize(filters.topic)
  filters.tag = normalize(filters.tag)
  if (topics.find(topic => topic.id === filters.topic)?.kind === 'tag') {
    if (filters.tag === 'all') filters.tag = filters.topic
    filters.topic = 'all'
  }
  return filters
}
