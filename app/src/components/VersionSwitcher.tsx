import { Menu } from '@headlessui/react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useVersioning } from 'src/state'

export function VersionSwitcher({ className = '' }: { className?: string }) {
  const { version, versions, setVersion } = useVersioning()
  const router = useRouter()
  const isMultiVersion = versions.length > 1
  return (
    <Menu
      as="div"
      className={clsx(className, 'relative')}
    >
      <Menu.Button
        disabled={!isMultiVersion}
        className="text-xs leading-5 font-semibold bg-slate-400/10 rounded-full py-1 px-3 flex items-center space-x-2 hover:bg-slate-400/20 dark:highlight-white/5"
      >
        {version}
        {isMultiVersion && (
          <svg
            width="6"
            height="3"
            className="ml-2 overflow-visible"
            aria-hidden="true"
          >
            <path
              d="M0 0L3 3L6 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </Menu.Button>
      <Menu.Items className="absolute top-full mt-1 py-2 w-40 rounded-lg bg-white shadow ring-1 ring-slate-900/5 text-sm leading-6 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:highlight-white/5">
        {versions.map(v =>
          v === version ? (
            <Menu.Item
              disabled
              key={v}
            >
              <span className="flex items-center justify-between px-3 py-1 text-sky-500 dark:text-sky-400">
                {v}
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="m7.75 12.75 2.25 2.5 6.25-6.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Menu.Item>
          ) : (
            <Menu.Item key={v}>
              {({ active }) => (
                <a
                  onClick={() => {
                    setVersion(v)
                    router.push('/')
                  }}
                  className={clsx(
                    'block px-3 py-1',
                    active &&
                      'bg-slate-50 text-slate-900 dark:bg-slate-600/30 dark:text-white'
                  )}
                >
                  {v}
                </a>
              )}
            </Menu.Item>
          )
        )}
      </Menu.Items>
    </Menu>
  )
}
