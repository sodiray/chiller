import clsx from 'clsx'
import { Head, Html, Main, NextScript } from 'next/document'
import config from 'src/config'

export default function Document() {
  const favicon = config.favicon
    ? config.favicon.startsWith('/')
      ? config.favicon
      : '/' + config.favicon
    : null
  return (
    <Html
      lang="en"
      className="dark [--scroll-mt:9.875rem] lg:[--scroll-mt:6.3125rem]"
    >
      <Head>
        {favicon && (
          <>
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href={favicon}
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href={favicon}
            />
            <link
              rel="shortcut icon"
              href={favicon}
            />
          </>
        )}
        <meta
          name="apple-mobile-web-app-title"
          content={config.name}
        />
        <meta
          name="application-name"
          content={config.name}
        />
        <meta
          name="theme-color"
          content="#f8fafc"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '#0B1120')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `
          }}
        />
      </Head>
      <body className={clsx('antialiased text-slate-500 dark:text-slate-400')}>
        <Main />
        <NextScript />
        <script> </script>
      </body>
    </Html>
  )
}
