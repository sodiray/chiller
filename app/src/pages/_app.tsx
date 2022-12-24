import ProgressBar from '@badrap/bar-of-progress'
import { ResizeObserver } from '@juggle/resize-observer'
// @ts-ignore
import { MDXProvider } from '@mdx-js/react'
import 'focus-visible'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import { FunctionComponent, useEffect, useState } from 'react'
import { DocsFooter } from 'src/components/DocsFooter'
import { Header } from 'src/components/Header'
import { Heading } from 'src/components/Heading'
import { PageHeader } from 'src/components/PageHeader'
import { SearchProvider } from 'src/components/Search'
import { TableOfContents } from 'src/components/TableOfContents'
import config from 'src/config'
import { usePrevNext } from 'src/hooks/usePrevNext'
import { useTableOfContents } from 'src/hooks/useTableOfContents'
import { SidebarLayout } from 'src/layouts/SidebarLayout'
import { documentationNav } from 'src/nav'
import { ContentsContext } from 'src/state'
import { Meta, TableOfContentsList } from 'src/types'
import '../css/fonts.css'
import '../css/main.css'

declare global {
  interface Window {
    ResizeObserver?: typeof ResizeObserver
  }
}

if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  window.ResizeObserver = ResizeObserver
}

const progress = new ProgressBar({
  size: 2,
  color: '#38bdf8',
  className: 'bar-of-progress',
  delay: 100
})

// this fixes safari jumping to the bottom of the page
// when closing the search modal using the `esc` key
if (typeof window !== 'undefined') {
  progress.start()
  progress.finish()
}

Router.events.on('routeChangeStart', () => progress.start())
Router.events.on('routeChangeComplete', () => progress.finish())
Router.events.on('routeChangeError', () => progress.finish())

type Props = AppProps & {
  Component: AppProps['Component'] & {
    layoutProps?: {
      meta: Meta
      tableOfContents: TableOfContentsList
    }
  }
}

export default function App({ Component, pageProps, router }: Props) {
  let [navIsOpen, setNavIsOpen] = useState(false)

  useEffect(() => {
    if (!navIsOpen) return
    function handleRouteChange() {
      setNavIsOpen(false)
    }
    Router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [navIsOpen])

  const meta: Partial<Meta> = Component.layoutProps?.meta || {}
  const section = meta.group ?? ''

  const { currentSection, registerHeading, unregisterHeading } =
    useTableOfContents(Component.layoutProps?.tableOfContents ?? [])
  const { prev, next, current } = usePrevNext()

  return (
    <>
      <Head>
        <title>{meta.title || config.name}</title>
        <meta
          name="description"
          content={meta.description || config.description || config.name}
        />
        <meta
          key="og:url"
          property="og:url"
          content={`${config.domain}${router.pathname}`}
        />
        <meta
          key="og:type"
          property="og:type"
          content="article"
        />
        {config.thumbnail && (
          <>
            <meta
              key="twitter:image"
              name="twitter:image"
              content={`${config.domain}${config.thumbnail}`}
            />
            <meta
              key="og:image"
              property="og:image"
              content={`${config.domain}${config.thumbnail}`}
            />
          </>
        )}
      </Head>
      <SearchProvider>
        <Header
          hasNav={Boolean(documentationNav)}
          navIsOpen={navIsOpen}
          onNavToggle={isOpen => setNavIsOpen(isOpen)}
          title={meta.title ?? ''}
          section={section}
        />
        <SidebarLayout
          nav={documentationNav}
          navIsOpen={navIsOpen}
          setNavIsOpen={setNavIsOpen}
          section={section}
          tableOfContents={Component.layoutProps?.tableOfContents!}
        >
          <div className="max-w-3xl mx-auto pt-10 xl:max-w-none xl:ml-0 xl:mr-[15.5rem] xl:pr-16">
            <PageHeader
              title={meta.title ?? ''}
              description={meta.description ?? ''}
              repo={meta.repo ?? ''}
              badge={meta.badge}
              section={section}
            />
            <ContentsContext.Provider
              value={{ registerHeading, unregisterHeading }}
            >
              <div
                id="content-wrapper"
                className="relative z-20 prose prose-slate mt-8 dark:prose-dark"
              >
                <MDXProvider components={{ Heading }}>
                  <Component
                    section={section}
                    {...pageProps}
                  />
                </MDXProvider>
              </div>
            </ContentsContext.Provider>

            <DocsFooter
              previous={prev}
              next={next}
              current={current}
            />

            <div className="fixed z-20 top-[3.8125rem] bottom-0 right-[max(0px,calc(50%-45rem))] w-[19.5rem] py-10 overflow-y-auto hidden xl:block">
              {(Component.layoutProps?.tableOfContents?.length ?? 0) > 0 && (
                <TableOfContents
                  tableOfContents={Component.layoutProps?.tableOfContents ?? []}
                  currentSection={currentSection}
                />
              )}
            </div>
          </div>
        </SidebarLayout>
      </SearchProvider>
    </>
  )
}
