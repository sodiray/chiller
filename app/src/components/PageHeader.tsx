import config from 'src/config'
import { twMerge } from 'tailwind-merge'

export function PageHeader({
  title,
  description,
  repo,
  badge,
  section
}: {
  title: string
  description: string
  repo: string
  section: string
  badge?: string
}) {
  if (!title && !description) return null

  return (
    <header
      id="header"
      className="relative z-20"
    >
      <div>
        {section && (
          <p
            className={twMerge(
              'mb-2 text-sm leading-6 font-semibold',
              config.theme?.['mdx.section.heading'] ?? ''
            )}
          >
            {section}
          </p>
        )}
        <div className="flex items-center">
          <h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
            {title}
          </h1>
        </div>
        {badge && (
          <dl className="mt-1.5 align-top inline-flex items-center px-3 py-1 rounded-full text-sm font-medium leading-4 bg-cyan-100 text-cyan-900 tracking-tight">
            <dd>{badge}</dd>
          </dl>
        )}
      </div>
      {description && (
        <p className="mt-2 text-lg text-slate-700 dark:text-slate-400">
          {description}
        </p>
      )}
    </header>
  )
}
