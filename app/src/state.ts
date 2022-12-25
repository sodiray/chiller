import { sift, unique } from 'radash'
import { createContext } from 'react'
import create from 'zustand'
import config from './config'
import { pages } from './nav'

export const ContentsContext = createContext({})
export const SidebarContext = createContext({})

type Theme = 'light' | 'dark' | 'system'
type SettingState = {
  setting: Theme | null
  setSetting: (setting: Theme) => void
}

type VersionState = {
  version: string | null
  versions: string[]
  isVersioned: boolean
  setVersion: (version: string) => void
}

export const useSetting = create<SettingState>()(set => ({
  setting: null,
  setSetting: (setting: Theme) => set({ setting })
}))

export const useVersioning = create<VersionState>()(set => ({
  version: config.version ?? null,
  versions: sift(unique([config.version, ...pages.map(p => p.meta.version)])),
  isVersioned:
    sift(unique([config.version, ...pages.map(p => p.meta.version)])).length >
    1,
  setVersion: (version: string) => {
    set({ version })
  }
}))
