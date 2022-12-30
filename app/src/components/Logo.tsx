import { trim } from 'radash'
import { useEffect, useMemo, useState } from 'react'
import config from 'src/config'

export function Logo({ className }: { className: string }) {
  const [theme, setTheme] = useState<null | 'light' | 'dark'>(null)

  const updateTheme = () => {
    const isDark = document.documentElement.classList.contains('dark')
    if (isDark && theme === 'dark') return
    if (!isDark && theme === 'light') return
    setTheme(isDark ? 'dark' : 'light')
  }

  const observer = useMemo(
    () => () => {
      return new MutationObserver(mutations => {
        mutations.forEach(mu => {
          if (mu.type !== 'attributes' && mu.attributeName !== 'class') return
          updateTheme()
        })
      })
    },
    []
  )

  useEffect(() => {
    const ob = observer()
    ob.observe(document.documentElement, { attributes: true })
    return () => {
      ob.disconnect()
    }
  }, [])

  useEffect(() => {
    updateTheme()
  }, [])

  if (theme === null) return null
  const logo = theme === 'light' ? config.logo!.light : config.logo!.dark
  return (
    <img
      src={'/' + trim(logo, '/')}
      className={className}
    />
  )
}
