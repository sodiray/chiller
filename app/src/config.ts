const config = require('./chiller.json')

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T | undefined

export type ChillerConfig = {
  name: string
  version: string
  favicon: string
  domain: string
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
    links: {
      url: string
      label: string
      button: string
    }[]
  }
  sidebar: {
    links: {
      url: string
      label: string
      button: string
    }[]
  }
  search: {
    type: 'pages' | 'algolia'
    key: string
  }
  footer: {
    links: {
      url: string
      label: string
      button: string
    }[]
  }
}

export default config as DeepPartial<ChillerConfig>
