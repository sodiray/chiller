import clsx from 'clsx'
import Link from 'next/link'
import config from 'src/config'
import { Page } from 'src/types'

export function DocsFooter({
  previous,
  next,
  current
}: {
  previous: Page | undefined
  next: Page | undefined
  current: Page | undefined
}) {
  if (!current) return null
  return (
    <footer
      className={clsx(
        'text-sm leading-6',
        previous || next ? 'mt-12' : 'mt-16'
      )}
    >
      {(previous || next) && (
        <div className="mb-10 text-slate-700 font-semibold flex items-center dark:text-slate-200">
          {previous && (
            <Link href={previous.href}>
              <a className="group flex items-center hover:text-slate-900 dark:hover:text-white">
                <svg
                  viewBox="0 0 3 6"
                  className="mr-3 w-auto h-1.5 text-slate-400 overflow-visible group-hover:text-slate-600 dark:group-hover:text-slate-300"
                >
                  <path
                    d="M3 0L0 3L3 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {previous.meta.title}
              </a>
            </Link>
          )}
          {next && (
            <Link href={next.href}>
              <a className="group ml-auto flex items-center hover:text-slate-900 dark:hover:text-white">
                {next.meta.title}
                <svg
                  viewBox="0 0 3 6"
                  className="ml-3 w-auto h-1.5 text-slate-400 overflow-visible group-hover:text-slate-600 dark:group-hover:text-slate-300"
                >
                  <path
                    d="M0 0L3 3L0 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </Link>
          )}
        </div>
      )}
      <div className="pt-10 pb-28 border-t border-slate-200 sm:flex justify-between text-slate-500 dark:border-slate-200/5">
        <div className="mb-6 sm:mb-0 sm:flex">
          <p className="group">
            Powered By{' '}
            <a
              href="https://github.com/rayepps/chiller"
              target="_blank"
              className="group-hover:underline"
            >
              Chiller
            </a>
          </p>
        </div>
        {config.repo && (
          <Link
            href={`${config.repo}/edit/${config.branch ?? 'main'}${
              current?.meta.source ?? current?.href ?? ''
            }.mdx`}
          >
            <a
              className="hover:text-slate-900 dark:hover:text-slate-400"
              target="_blank"
            >
              Edit this page on GitHub
            </a>
          </Link>
        )}
      </div>
    </footer>
  )
}
