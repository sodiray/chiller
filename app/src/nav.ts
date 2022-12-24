import { objectify } from 'radash'
import config from 'src/config'

const context = require.context(
  `./pages/docs/?meta=title,shortTitle,published`,
  false,
  /\.mdx$/
)

const imported = context.keys().map(fileName => ({
  fileName,
  module: context(fileName),
  slug: fileName.substr(2).replace(/\.mdx$/, '')
}))

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
