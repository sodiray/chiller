import { sift, unique } from 'radash'
import { createContext } from 'react'
import create from 'zustand'
import config from './config'
import { pages } from './nav'

// TODO: Remove context and go all
// in with zustand

export const ContentsContext = createContext({})
export const SidebarContext = createContext({})

export const useSetting = create<{
  setting: 'light' | 'dark' | 'system' | null
  setSetting: (setting: 'light' | 'dark' | 'system') => void
}>()(set => ({
  setting: null,
  setSetting: (setting: 'light' | 'dark' | 'system') => set({ setting })
}))

export const useVersioning = create<{
  version: string | null
  versions: string[]
  setVersion: (version: string) => void
}>()(set => ({
  version: config.version ?? null,
  versions: unique(sift([config.version, ...pages.map(p => p.meta.version)])),
  setVersion: (version: string) => {
    set({ version })
  }
}))

export const useSearch = create<{
  filter: string
  setFilter: (filter: string) => void
}>()(set => ({
  filter: '',
  setFilter: filter => set({ filter })
}))
