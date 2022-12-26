export type ColorLevel =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'

export const COLOR_LEVELS: Record<ColorLevel, boolean> = {
  '50': true,
  '100': true,
  '200': true,
  '300': true,
  '400': true,
  '500': true,
  '600': true,
  '700': true,
  '800': true,
  '900': true,
}

export const isColorLevel = (str: string) => {
  return COLOR_LEVELS[str] ?? false
}

export type ColorHue =
  | 'black'
  | 'white'
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'

const COLOR_HUES: Record<ColorHue, boolean> = {
  'black': true,
  'white': true,
  'slate': true,
  'gray': true,
  'zinc': true,
  'neutral': true,
  'stone': true,
  'red': true,
  'orange': true,
  'amber': true,
  'yellow': true,
  'lime': true,
  'green': true,
  'emerald': true,
  'teal': true,
  'cyan': true,
  'sky': true,
  'blue': true,
  'indigo': true,
  'violet': true,
  'purple': true,
  'fuchsia': true,
  'pink': true,
  'rose': true,
}

export const isColorHue = (str: string) => {
  return COLOR_HUES[str] ?? false
}

export type ColorStyle = ColorHue | `${ColorHue}-${ColorLevel}` | `#${string}`

export const create = (input: ColorStyle) => {
  const style = (() => {
    if (input.startsWith('#')) return `[${input}]`
    if (input.includes('-')) return input
    return `${input}-400`
  })()
  return {
    'mdx.section.heading': `text-${style} dark:text-${style}`,
    'sidebar.link': `hover:text-${style} dark:hover:text-${style} data-selected:text-${style} data-selected:dark:text-${style}`,
    'sidebar.link.icon': `group-hover:bg-${style} dark:group-hover:bg-${style} data-selected:bg-${style} dark:data-selected:bg-${style}`,
    'sidebar.group': `border-slate-300 dark:border-slate-800`,
    'sidebar.group.link': `hover:border-${style} dark:hover:border-${style} hover:text-${style} dark:hover:text-${style} data-selected:text-${style} data-selected:border-${style} data-selected:dark:text-${style} data-selected:dark:border-${style}`,
    'theme.icon.fill': `data-selected:fill-${style} dark:data-selected:fill-${style}`,
    'theme.icon.stroke': `data-selected:stroke-${style} dark:data-selected:stroke-${style}`,
    'theme.label': `data-selected:text-${style} dark:data-selected:text-${style}`
  }
}
