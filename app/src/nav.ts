import { objectify } from 'radash'
import config from 'src/config'
import * as glob from 'glob'

const files = glob.sync('./pages/docs/**/*.mdx')

console.log('x--> files: ', files)

const context = require.context(
  `./pages/docs/**/*.mdx`,
  false,
  /\.mdx$/
)

const imported = context.keys().map(fileName => ({
  fileName,
  module: context(fileName),
  slug: fileName.substr(2).replace(/\.mdx$/, '')
}))

console.log('x--> imported', imported)

const pages = objectify(
  imported,
  x => x.slug,
  x => ({
    ...x.module.default,
    href: `/docs/${x.slug}`
  })
)

export const documentationNav = objectify(
  config.sidebar.groups,
  g => g.label,
  g => g.pages.map(p => pages[p])
)
