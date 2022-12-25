import { useRouter } from 'next/router'
import { pages } from 'src/nav'

export function usePrevNext() {
  const router = useRouter()
  const pageIndex = pages.findIndex(page => page.href === router.pathname)
  return {
    prev: pageIndex > -1 ? pages[pageIndex - 1] : undefined,
    next: pageIndex > -1 ? pages[pageIndex + 1] : undefined,
    current: pages[pageIndex]
  }
}
