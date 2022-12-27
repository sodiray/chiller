import { objectify, sift, unique } from 'radash'
import config from 'src/config'
import { LayoutProps, NavTree, Page } from 'src/types'

const context = require.context(`./pages/`, true, /\.mdx?$/)

export const pages = context
  .keys()
  .filter(fileName => fileName.startsWith('./'))
  .map((fileName): Page => {
    const module = context(fileName)
    const lp = module.default.layoutProps as LayoutProps
    const toc = module.default.layoutProps.tableOfContents
    return {
      id: `${lp.meta.group}:${lp.meta.title}`,
      meta: lp.meta,
      tableOfContents: toc,
      href: fileName.replace(/.mdx$/, '').replace(/^\.\//, '/')
    }
  })
  .filter(page => page.meta.hidden !== 'true')

export const groups = sift(unique(pages.map(p => p.meta.group)))

export const versions = sift(
  unique([config.version, ...pages.map(p => p.meta.version)])
)

const pagesByVersion = config.version
  ? objectify(
      versions,
      v => v,
      v => {
        const nonVersionedPages = pages.filter(p => !p.meta.version)
        const thisVersionedPages = pages.filter(p => p.meta.version === v)
        const overridenPages = nonVersionedPages.map(p => {
          const override = thisVersionedPages.find(x => x.id === p.id)
          return override ?? p
        })
        return [
          ...overridenPages,
          ...thisVersionedPages.filter(
            p => !nonVersionedPages.find(x => x.id === p.id)
          )
        ]
      }
    )
  : {
      default: pages
    }

export const nav = (version: string): NavTree => {
  return objectify(
    groups,
    g => g,
    g => pagesByVersion[version].filter(p => p.meta.group === g)
  )
}
