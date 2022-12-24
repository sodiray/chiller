export type TableOfContentsItem = {
  title: string
  slug: string
  children: TableOfContentsItem[]
}
export type TableOfContentsList = TableOfContentsItem[]
