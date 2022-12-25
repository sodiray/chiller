import { useRect } from '@reach/rect'
import { useEffect, useState } from 'react'

export function useTop(ref: any) {
  let [top, setTop] = useState()
  let rect = useRect(ref)
  let rectTop = rect ? rect.top : undefined
  useEffect(() => {
    if (typeof rectTop === 'undefined') return
    let newTop = rectTop + window.pageYOffset
    if (newTop !== top) {
      setTop(newTop as any)
    }
  }, [rectTop, top])
  return top
}
