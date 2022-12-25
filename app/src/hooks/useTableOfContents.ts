import { useCallback, useEffect, useState } from 'react'
import type { TableOfContentsList } from 'src/types'

export function useTableOfContents(tableOfContents: TableOfContentsList) {
  const [currentSection, setCurrentSection] = useState(tableOfContents[0]?.slug)
  const [headings, setHeadings] = useState([]) as any

  const registerHeading = useCallback((id: string, top: any) => {
    setHeadings((headings: any) => [
      ...headings.filter((h: any) => id !== h.id),
      { id, top }
    ])
  }, [])

  const unregisterHeading = useCallback((id: string) => {
    setHeadings((headings: any) => headings.filter((h: any) => id !== h.id))
  }, [])

  useEffect(() => {
    if (tableOfContents.length === 0 || headings.length === 0) return
    function onScroll() {
      let style = window.getComputedStyle(document.documentElement) as any
      let scrollMt = parseFloat(
        style.getPropertyValue('--scroll-mt').match(/[\d.]+/)?.[0] ?? 0
      )
      let fontSize = parseFloat(style.fontSize.match(/[\d.]+/)?.[0] ?? 16)
      scrollMt = scrollMt * fontSize

      let sortedHeadings = headings
        .concat([])
        .sort((a: any, b: any) => a.top - b.top)
      let top = window.pageYOffset + scrollMt + 1
      let current = sortedHeadings[0].id
      for (let i = 0; i < sortedHeadings.length; i++) {
        if (top >= sortedHeadings[i].top) {
          current = sortedHeadings[i].id
        }
      }
      setCurrentSection(current)
    }
    window.addEventListener('scroll', onScroll, {
      capture: true,
      passive: true
    })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll, {
        capture: true,
        passive: true
      } as any)
    }
  }, [headings, tableOfContents])

  return { currentSection, registerHeading, unregisterHeading }
}
