
export type TableOfContentsList = {
  title: string
  slug: string
  children: TableOfContentsList[0][]
}[]
