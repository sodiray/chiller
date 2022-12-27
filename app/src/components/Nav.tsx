import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { objectify, sift, unique } from 'radash'
import { ChangeEventHandler, forwardRef, ReactNode, Ref, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Icon } from 'src/components/Icon'
import { SearchButton } from 'src/components/Search'
import config from 'src/config'
import { useActionKey } from 'src/hooks/useActionKey'
import { useIsomorphicLayoutEffect } from 'src/hooks/useIsomorphicLayoutEffect'
import { nav } from 'src/nav'
import { useSearch, useVersioning } from 'src/state'
import type { NavTree } from 'src/types'
import { twMerge } from 'tailwind-merge'

const NavItem = forwardRef(
  (
    {
      href,
      children,
      isActive,
      isPublished,
      fallbackHref
    }: {
      href: string
      children: ReactNode
      isActive: boolean
      isPublished: boolean
      fallbackHref: string
    },
    ref: Ref<any>
  ) => {
    return (
      <li
        ref={ref}
        data-active={isActive ? 'true' : undefined}
      >
        <Link href={isPublished ? href : fallbackHref}>
          <a
            data-is-selected={isActive ? 'true' : 'false'}
            className={twMerge(
              'block border-l pl-4 -ml-px border-transparent hover:border-slate-400 dark:hover:border-slate-500 data-selected:text-sky-500 data-selected:border-sky-500 data-selected:font-semibold data-selected:dark:text-sky-400 data-selected:dark:border-sky-400',
              config.theme?.['sidebar.group.link'] ?? ''
            )}
          >
            {children}
          </a>
        </Link>
      </li>
    )
  }
)

/**
 * Find the nearst scrollable ancestor (or self if scrollable)
 *
 * Code adapted and simplified from the smoothscroll polyfill
 *
 *
 * @param {Element} el
 */
function nearestScrollableContainer(el?: Element) {
  /**
   * indicates if an element can be scrolled
   *
   * @param {Node} el
   */
  function isScrollable(el: any) {
    const style = window.getComputedStyle(el)
    const overflowX = style['overflowX']
    const overflowY = style['overflowY']
    const canScrollY = el.clientHeight < el.scrollHeight
    const canScrollX = el.clientWidth < el.scrollWidth

    const isScrollableY =
      canScrollY && (overflowY === 'auto' || overflowY === 'scroll')
    const isScrollableX =
      canScrollX && (overflowX === 'auto' || overflowX === 'scroll')

    return isScrollableY || isScrollableX
  }

  while (el !== document.body && isScrollable(el) === false) {
    el = el?.parentNode || (el as any).host
  }

  return el
}

export const Nav = ({
  fallbackHref,
  mobile = false
}: {
  fallbackHref?: string
  mobile?: boolean
}) => {
  const router = useRouter()
  const activeItemRef = useRef<any>()
  const previousActiveItemRef = useRef<any>()
  const scrollRef = useRef<any>()
  const { filter } = useSearch()
  const { version } = useVersioning()

  useIsomorphicLayoutEffect(() => {
    if (activeItemRef.current) {
      previousActiveItemRef.current = activeItemRef.current
      if (activeItemRef.current === previousActiveItemRef.current) {
        return
      }

      const scrollable = nearestScrollableContainer(scrollRef?.current)

      const scrollRect = scrollable?.getBoundingClientRect()
      const activeItemRect = activeItemRef.current.getBoundingClientRect()

      const top = activeItemRef.current?.offsetTop
      const bottom = top - scrollRect!.height + activeItemRect.height

      if (scrollable!.scrollTop > top || scrollable!.scrollTop < bottom) {
        scrollable!.scrollTop =
          top - scrollRect!.height / 2 + activeItemRect.height / 2
      }
    }
  }, [router.pathname])

  const navigation = nav(version ?? 'default')

  const filtered = (n: NavTree) => {
    const allPages = Object.values(n).flat()
    const f = filter.trim().toLowerCase()
    const matchPages = allPages.filter(p => {
      return sift([p.meta.title, p.meta.description])
        .join(' ')
        .toLowerCase()
        .includes(f)
    })
    const groups = config.sidebar?.order
      ? (config.sidebar.order.filter(g =>
          matchPages.find(p => p.meta.group === g)
        ) as string[])
      : unique(sift(matchPages.map(p => p.meta.group)))
    return {
      pages: objectify(
        groups,
        g => g,
        g => matchPages.filter(p => p.meta.group === g)
      ),
      groups
    }
  }

  const filteredNav = filtered(navigation)

  return (
    <nav
      ref={scrollRef}
      id="nav"
      className="lg:text-sm lg:leading-6 relative"
    >
      <div className="sticky top-0 -ml-0.5 pointer-events-none">
        <div className="bg-white my-8 dark:bg-slate-900 relative pointer-events-auto">
          <DynamicSearchButton />
        </div>
      </div>
      <ul>
        <TopLevelNav mobile={mobile} />
        {filteredNav.groups
          .map(group => {
            const filteredPages = filteredNav.pages[group]
            return (
              <li
                key={group}
                className="mt-12 lg:mt-8"
              >
                <h5
                  className={clsx('mb-8 lg:mb-3 font-semibold', {
                    'text-slate-900 dark:text-slate-200':
                      filteredPages.length > 0,
                    'text-slate-400': filteredPages.length === 0
                  })}
                >
                  {group}
                </h5>
                <ul
                  className={clsx(
                    'space-y-6 lg:space-y-2 border-l border-slate-100',
                    mobile ? 'dark:border-slate-700' : 'dark:border-slate-800'
                  )}
                >
                  {filteredPages.map((item, i) => {
                    const isActive = item.meta.match
                      ? new RegExp(item.meta.match).test(router.pathname)
                      : item.href === router.pathname
                    return (
                      <NavItem
                        key={i}
                        href={item.href}
                        isActive={isActive}
                        ref={isActive ? activeItemRef : undefined}
                        isPublished={item.meta.published !== 'false'}
                        fallbackHref={fallbackHref ?? ''}
                      >
                        {item.meta.title}
                      </NavItem>
                    )
                  })}
                </ul>
              </li>
            )
          })
          .filter(Boolean)}
      </ul>
    </nav>
  )
}

const DynamicSearchButton = () => {
  const actionKey = useActionKey()
  const ref = useRef<HTMLInputElement | null>(null)
  const focus = () => ref.current?.focus()
  useHotkeys('Meta+k', focus)
  const { setFilter } = useSearch()
  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    setFilter(e.target.value ?? '')
  }
  if (config.algolia)
    return (
      <SearchButton className="hidden w-full lg:flex items-center text-sm leading-6 text-slate-400 rounded-md ring-1 ring-slate-900/10 shadow-sm py-1.5 pl-2 pr-3 hover:ring-slate-300 dark:bg-slate-800 dark:highlight-white/5 dark:hover:bg-slate-700">
        {() => (
          <>
            <svg
              width="24"
              height="24"
              fill="none"
              aria-hidden="true"
              className="mr-3 flex-none"
            >
              <path
                d="m19 19-3.5-3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="11"
                cy="11"
                r="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Quick search...
            {actionKey && (
              <span className="ml-auto pl-3 flex-none text-xs font-semibold">
                {actionKey[0]}K
              </span>
            )}
          </>
        )}
      </SearchButton>
    )
  return (
    <div
      onClick={focus}
      className="relative w-full flex items-center"
    >
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          width="24"
          height="24"
          fill="none"
          aria-hidden="true"
          className="mr-3 flex-none"
        >
          <path
            d="m19 19-3.5-3.5"
            strokeWidth="2"
            className="stroke-slate-400"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="11"
            cy="11"
            r="6"
            strokeWidth="2"
            className="stroke-slate-400"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <input
        className="pl-10 p-2.5 grow w-full rounded border border-slate-200 hover:border-slate-300 dark:border-slate-900 hover:dark:border-slate-800 dark:bg-slate-800"
        type="text"
        ref={ref}
        onChange={handleChange}
        placeholder="Quick search..."
      />
      {actionKey && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="ml-auto pl-3 flex-none text-xs font-semibold text-slate-400">
            {actionKey[0]}K
          </span>
        </div>
      )}
    </div>
  )
}

const TopLevelAnchor = forwardRef(
  (
    {
      children,
      href,
      icon,
      isActive,
      onClick,
      mobile
    }: {
      children: ReactNode
      href: string
      icon: string
      isActive: boolean
      onClick?: () => void
      mobile: boolean
    },
    ref
  ) => {
    return (
      <li>
        <a
          ref={ref as any}
          href={href}
          onClick={onClick}
          data-is-selected={isActive ? 'true' : 'false'}
          className={clsx(
            'group flex items-center lg:text-sm lg:leading-6 mb-4',
            twMerge(
              'data-selected:font-semibold font-medium text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300',
              config.theme?.['sidebar.link'] ?? ''
            )
          )}
        >
          <div
            data-is-selected={isActive ? 'true' : 'false'}
            className={twMerge(
              clsx(
                'mr-4 p-1 rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 dark:ring-0 dark:shadow-none dark:group-hover:shadow-none dark:group-hover:highlight-white/10',
                'group-hover:text-slate-50 dark:group-hover:text-slate-900 data-selected:dark:text-slate-900 data-selected:text-slate-50 data-selected:dark:highlight-white/10 dark:bg-slate-800 dark:highlight-white/5'
              ),
              config.theme?.['sidebar.link.icon'] ?? ''
            )}
          >
            <Icon
              icon={icon as any}
              size={18}
            />
          </div>
          {children}
        </a>
      </li>
    )
  }
)

function TopLevelLink({
  href,
  as,
  ...props
}: {
  href: string
  as?: string
  children: ReactNode
  icon: ReactNode
  isActive: boolean
  onClick?: () => void
  mobile: boolean
}) {
  if (/^https?:\/\//.test(href)) {
    return (
      <TopLevelAnchor
        href={href}
        {...(props as any)}
      />
    )
  }

  return (
    <Link
      href={href}
      as={as}
      passHref
    >
      <TopLevelAnchor {...(props as any)} />
    </Link>
  )
}

function TopLevelNav({ mobile }: { mobile: boolean }) {
  const { pathname } = useRouter()

  return (
    <>
      {config.sidebar?.links!.map((link, idx) => (
        <TopLevelLink
          key={idx}
          mobile={mobile}
          href={link!.url ?? ''}
          isActive={pathname.startsWith(link!.url ?? '')}
          icon={link?.icon ?? 'book'}
        >
          {link!.label}
        </TopLevelLink>
      ))}
    </>
  )
}
