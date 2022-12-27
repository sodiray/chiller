const config = require('./chiller.json')

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T | undefined

export type ChillerLink = {
  url: string
  label: string
  button: string
  icon: 'book'
}

export type ChillerConfig = {
  name: string
  version: string
  favicon: string
  domain: string
  branch: string
  repo: string
  thumbnail: string
  description: string
  pages: string | string[]
  logo: {
    light: string
    dark: string
  }
  header: {
    links: ChillerLink[]
  }
  sidebar: {
    links: ChillerLink[]
    order: string[]
  }
  algolia: {
    key: string
    index: string
    id: string
  }
  footer: {
    links: ChillerLink[]
  }
  theme: {
    primary: string
    'sidebar.link': string
    'sidebar.link.icon': string
    'sidebar.group': string
    'sidebar.group.link': string
    'theme.icon.stroke': string
    'theme.icon.fill': string
    'theme.label': string
    'mdx.section.heading': string
    'toc.section.title': string
    'header.link': string
  }
}

export default config as DeepPartial<ChillerConfig>
