import { defineLoader } from 'vitepress'
import { collectProjectCards } from '../utils/project-collections.mjs'

/** Watch configuration and recursive Markdown changes, including new files. */
export default defineLoader({
  watch: ['../../src/projects/*/project.json', '../../src/projects/**/*.md'],
  load: collectProjectCards,
})
