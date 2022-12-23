import { createPageList } from 'src/utils/createPageList'
import { objectify } from 'radash'
import config from 'src/config'

const pages = createPageList(
  require.context(`../pages/docs/?meta=title,shortTitle,published`, false, /\.mdx$/),
  'docs'
)

export const documentationNav = objectify(
  config.sidebar.groups,
  g => g.label,
  g => g.pages.map(p => pages[p])
)
