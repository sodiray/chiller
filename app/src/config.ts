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
  repo: {
    url: string
    branch: string
  }
  thumbnail: string
  description: string
  pages: string | string[]
  logo: {
    light: string
    dark: string
  }
  theme: {
    primary: string
    trim: string
    fonts: {
      header: string
      body: string
    }
  }
  header: {
    links: ChillerLink[]
  }
  sidebar: {
    links: ChillerLink[]
  }
  search: {
    type: 'pages' | 'algolia'
    key: string
  }
  footer: {
    links: ChillerLink[]
  }
}

export default config as DeepPartial<ChillerConfig>
