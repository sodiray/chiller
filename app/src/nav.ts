import { objectify, sift, unique } from 'radash'
import { LayoutProps, Nav } from './types'

const context = require.context(`./pages/`, true, /\.mdx$/)

export const pages = context
  .keys()
  .filter(fileName => fileName.startsWith('./'))
  .map((fileName): Nav[0][0] => {
    console.log('x--> fileName: ', fileName)
    const module = context(fileName)
    const lp = module.default.layoutProps as LayoutProps
    const toc = module.default.layoutProps.tableOfContents
    return {
      meta: lp.meta,
      tableOfContents: toc,
      href: fileName.replace(/.mdx$/, '').replace(/^\.\//, '/')
    }
  })
  .filter(page => page.meta.hidden !== 'true')

export const groups = sift(unique(pages.map(p => p.meta.group)))

export const documentationNav: Nav = objectify(
  groups,
  g => g,
  g => pages.filter(p => p.meta.group === g)
)

console.log('x--> documentationNav:', documentationNav)
