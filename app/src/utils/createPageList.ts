import { importAll } from 'src/utils/importAll'

export function createPageList(files, base: string) {
  return importAll(files).reduce((acc, cur) => {
    let slug = cur.fileName.substr(2).replace(/\.mdx$/, '')
    return {
      ...acc,
      [slug]: { ...cur.module.default, href: `/${base}/${slug}` },
    }
  }, {})
}
