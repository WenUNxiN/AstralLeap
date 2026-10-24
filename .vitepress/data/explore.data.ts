import { createContentLoader } from 'vitepress'
import { collectExplore } from '../utils/explore.ts'
import { exploreSections } from '../utils/sections.ts'

export type { ExploreArticle, ExploreTopic, ExploreData } from '../utils/explore.ts'

/** Native VitePress globs track recursive additions, changes and deletions. */
export default createContentLoader(exploreSections.map(section => `${section.id}/**/*.md`), {
  includeSrc: true,
  transform: collectExplore,
})
