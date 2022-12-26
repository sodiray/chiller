export type TableOfContentsItem = {
  title: string
  slug: string
  children: TableOfContentsItem[]
}
export type TableOfContentsList = TableOfContentsItem[]

export type Meta = {
  title: string
  group: string
  hidden?: 'true' | 'false'
  version?: string
  source?: string
} & Record<string, string>

export type LayoutProps = {
  meta: Meta
  tableOfContents: TableOfContentsList
}

export type Page = {
  id: string
  tableOfContents: TableOfContentsList
  meta: Meta
  href: string
}

export type NavTree = Record<string, Page[]>
