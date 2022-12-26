import { isArray, isObject, trim } from 'radash'
import z from 'zod'
import * as theme from './theme'

const schema = z.object({
  name: z.string().optional(),
  version: z.string().optional(),
  favicon: z.string().optional(),
  domain: z.string().optional(),
  index: z.string().optional(),
  description: z.string().optional(),
  pages: z.union([z.array(z.string()), z.string()]).transform(value => {
    return isArray(value) ? value : [value]
  }),
  logo: z
    .union([
      z.string(),
      z.object({
        light: z.string(),
        dark: z.string()
      })
    ])
    .optional()
    .transform(value => {
      if (!value) return null
      if (isObject(value)) return value
      return { light: value, dark: value }
    }),
  sidebar: z
    .object({
      links: z
        .array(
          z.object({
            url: z.string(),
            icon: z.string().optional(),
            label: z.string().optional()
          })
        )
        .optional(),
      order: z.array(z.string()).optional()
    })
    .optional(),
  theme: z
    .union([
      z
        .string()
        .refine(str => {
          // Validate case where theme is a hex: #fff
          if (str.startsWith('#')) {
            return /^#(?:[0-9a-f]{3}){1,2}$/i.test(trim(str, '#'))
          }
          // Validate case where theme is a tailwind
          // color: green-400
          if (str.includes('-')) {
            const parts = str.split('-')
            if (parts.length > 2) return false
            const [color, level] = parts
            return theme.isColorHue(color) && theme.isColorLevel(level)
          }
          // Validate case where theme is a tailwind
          // color name: green
          return theme.isColorHue(str)
        }, 'When theme is a string it must be a tailwind color name (green, blue, etc.), tailwind color (green-200, cyan-50, etc.), or a hex (#a3b, #fffa1, etc.)')
        .transform(style => theme.create(style as theme.ColorStyle)),
      z.object({
        'sidebar.link': z.string().optional(),
        'sidebar.link.icon': z.string().optional(),
        'sidebar.group': z.string().optional(),
        'sidebar.group.link': z.string().optional(),
        'theme.icon.stroke': z.string().optional(),
        'theme.icon.fill': z.string().optional(),
        'theme.label': z.string().optional(),
        'mdx.section.heading': z.string().optional()
      })
    ])
    .default(theme.create('blue-400'))
})

export type ChillerJsonConfig = z.infer<typeof schema>

export default schema
