import { DocSearchModal } from '@docsearch/react'
import clsx from 'clsx'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { createPortal } from 'react-dom'
import config from 'src/config'
import { useActionKey } from 'src/hooks/useActionKey'
import { useDocSearchKeyboardEvents } from 'src/hooks/useDocSearchKeyboardEvents'

const SearchContext = createContext({
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
  onInput: (event: { key: string }) => {}
})

export function SearchProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [initialQuery, setInitialQuery] = useState<string | null>(null)

  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const onInput = useCallback(
    (event: { key: string }) => {
      setIsOpen(true)
      setInitialQuery(event.key)
    },
    [setIsOpen, setInitialQuery]
  )

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose
  })

  return (
    <>
      <Head>
        <link
          rel="preconnect"
          href={`https://${config.algolia?.id!}-dsn.algolia.net`}
          crossOrigin="true"
        />
      </Head>
      <SearchContext.Provider
        value={{
          isOpen,
          onOpen,
          onClose,
          onInput
        }}
      >
        {children}
      </SearchContext.Provider>
      {config.algolia &&
        isOpen &&
        createPortal(
          <DocSearchModal
            initialQuery={initialQuery as string}
            initialScrollY={window.scrollY}
            searchParameters={{
              facetFilters: 'version:v3',
              distinct: 1
            }}
            placeholder="Search documentation"
            onClose={onClose}
            indexName={config.algolia?.index!}
            apiKey={config.algolia?.key!}
            appId={config.algolia?.id!}
            navigator={{
              navigate({ itemUrl }: { itemUrl: string }) {
                setIsOpen(false)
                router.push(itemUrl)
              }
            }}
            hitComponent={Hit}
            transformItems={items => {
              return items.map((item, index) => {
                // We transform the absolute URL into a relative URL to
                // leverage Next's preloading.
                const a = document.createElement('a')
                a.href = item.url

                const hash =
                  a.hash === '#content-wrapper' || a.hash === '#header'
                    ? ''
                    : a.hash

                if (item.hierarchy?.lvl0) {
                  item.hierarchy.lvl0 = item.hierarchy.lvl0.replace(
                    /&amp;/g,
                    '&'
                  )
                }

                if (item._highlightResult?.hierarchy?.lvl0?.value) {
                  item._highlightResult.hierarchy.lvl0.value =
                    item._highlightResult.hierarchy.lvl0.value.replace(
                      /&amp;/g,
                      '&'
                    )
                }

                return {
                  ...item,
                  url: `${a.pathname}${hash}`,
                  __is_result: () => true,
                  __is_parent: () =>
                    item.type === 'lvl1' && items.length > 1 && index === 0,
                  __is_child: () =>
                    item.type !== 'lvl1' &&
                    items.length > 1 &&
                    items[0].type === 'lvl1' &&
                    index !== 0,
                  __is_first: () => index === 1,
                  __is_last: () => index === items.length - 1 && index !== 0
                }
              })
            }}
          />,
          document.body
        )}
    </>
  )
}

function Hit({ hit, children }: { hit: any; children: ReactNode }) {
  return (
    <Link href={hit.url}>
      <a
        className={clsx({
          'DocSearch-Hit--Result': hit.__is_result?.(),
          'DocSearch-Hit--Parent': hit.__is_parent?.(),
          'DocSearch-Hit--FirstChild': hit.__is_first?.(),
          'DocSearch-Hit--LastChild': hit.__is_last?.(),
          'DocSearch-Hit--Child': hit.__is_child?.()
        })}
      >
        {children}
      </a>
    </Link>
  )
}

export function SearchButton({ children, ...props }: any) {
  let searchButtonRef = useRef()
  let actionKey = useActionKey()
  let { onOpen, onInput } = useContext(SearchContext)

  useEffect(() => {
    function onKeyDown(event: any) {
      if (
        searchButtonRef &&
        searchButtonRef.current === document.activeElement &&
        onInput
      ) {
        if (/[a-zA-Z0-9]/.test(String.fromCharCode(event.keyCode))) {
          onInput(event)
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onInput, searchButtonRef])

  return (
    <button
      type="button"
      ref={searchButtonRef}
      onClick={onOpen}
      {...props}
    >
      {typeof children === 'function' ? children({ actionKey }) : children}
    </button>
  )
}
