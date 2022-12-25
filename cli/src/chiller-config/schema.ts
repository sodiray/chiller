import { isArray, isObject } from 'radash'
import z from 'zod'

const schema = z.object({
  name: z.string().optional(),
  version: z.string().optional(),
  favicon: z.string().optional(),
  domain: z.string().optional(),
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
        .optional()
    })
    .optional()
})

export type ChillerJsonConfig = z.infer<typeof schema>

export default schema
