import clsx from 'clsx'
import type { ReactNode } from 'react'

export type ParamProps = {
  name: string
  description?: string
  type?: string
  default?: string
  required?: boolean
  children?: ReactNode
}

export const Option = ({
  name,
  type,
  description,
  default: defaultValue,
  required = false,
  children
}: ParamProps) => {
  return (
    <div
      className={clsx(
        'pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0'
      )}
    >
      <div className="flex font-mono text-sm">
        <div className="py-0.5 flex-1 space-x-2 truncate">
          <span
            className={clsx('font-bold text-slate-800 dark:text-slate-100')}
          >
            {name}
          </span>
          {type && (
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-600">
              {type}
            </span>
          )}
        </div>
        {defaultValue && (
          <span className="text-slate-500 dark:text-slate-300">
            Default: {defaultValue}
          </span>
        )}
        {required && (
          <div className="text-red-500 text-xs font-bold">required</div>
        )}
      </div>
      <div className="mt-2 prose-sm prose-slate dark:prose-dark">
        <p>{description}</p>
      </div>
      {children && (
        <div className="mt-3 ml-1 pl-3 border-l border-slate-200 dark:border-slate-700">
          {children}
        </div>
      )}
    </div>
  )
}
