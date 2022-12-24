import { isObject } from 'radash'
import z from 'zod'

const schema = z.object({
  name: z.string().nullable(),
  version: z.string().nullable(),
  favicon: z.string().nullable(),
  domain: z.string().nullable(),
  description: z.string().nullable(),
  pages: z.array(z.string()),
  logo: z
    .union([
      z.string(),
      z.object({
        light: z.string(),
        dark: z.string()
      })
    ])
    .nullable()
    .transform(value => {
      if (!value) return null
      if (isObject(value)) return value
      return { light: value, dark: value }
    })
})

export type ChillerJsonConfig = z.infer<typeof schema>

export default schema
