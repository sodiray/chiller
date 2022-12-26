import clsx from 'clsx'
import { useContext, useEffect, useRef } from 'react'
import config from 'src/config'
import { useTop } from 'src/hooks/useTop'
import { ContentsContext } from 'src/state'
import { twMerge } from 'tailwind-merge'

export function Heading({
  level,
  id,
  children,
  number,
  badge,
  className = '',
  hidden = false,
  ignore = false,
  style = {},
  nextElement,
  ...props
}: any) {
  let Component = `h${level}`
  const context = useContext(ContentsContext) as any

  let ref = useRef()
  let top = useTop(ref)

  useEffect(() => {
    if (!context) return
    if (typeof top !== 'undefined') {
      context.registerHeading(id, top)
    }
    return () => {
      context.unregisterHeading(id)
    }
  }, [top, id, context?.registerHeading, context?.unregisterHeading])

  return (
    <Component
      className={twMerge(
        clsx('group flex whitespace-pre-wrap', className, {
          '-ml-4 pl-4': !hidden,
          'mb-2 text-sm leading-6 font-semibold tracking-normal':
            level === 2 &&
            nextElement?.type === 'heading' &&
            nextElement?.depth === 3
        }),
        (level === 2 &&
          nextElement?.type === 'heading' &&
          nextElement?.depth === 3 &&
          config.theme?.['mdx.section.heading']) ??
          ''
      )}
      id={id}
      ref={ref}
      style={{ ...(hidden ? { marginBottom: 0 } : {}), ...style }}
      data-docsearch-ignore={ignore ? '' : undefined}
      {...props}
    >
      {!hidden && (
        <a
          href={`#${id}`}
          className="absolute -ml-10 flex items-center opacity-0 border-0 group-hover:opacity-100"
          aria-label="Anchor"
        >
          &#8203;
          <div className="w-6 h-6 text-slate-400 ring-1 ring-slate-900/5 rounded-md shadow-sm flex items-center justify-center hover:ring-slate-900/10 hover:shadow hover:text-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:shadow-none dark:ring-0">
            <svg
              width="12"
              height="12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3.75 1v10M8.25 1v10M1 3.75h10M1 8.25h10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </a>
      )}
      {number && (
        <span className="bg-cyan-100 w-8 h-8 inline-flex items-center justify-center rounded-full text-cyan-700 text-xl mr-3 flex-none">
          {number}
        </span>
      )}
      <span className={hidden ? 'sr-only' : undefined}>{children}</span>
      {badge && (
        <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium leading-4 bg-green-150 text-green-900">
          {badge}
        </span>
      )}
    </Component>
  )
}
