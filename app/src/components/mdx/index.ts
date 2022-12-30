import { Option } from './Option'

/**
 * This object is made available to the clients .mdx
 * docs. To keep our code/builds simple and to keep
 * references in the clients .mdx files standard
 * we only export this one object.
 *
 * ```mdx
 * ## Title
 * This is text
 *
 * <Chiller.Option name="apiKey" />
 * ```
 */
export const Chiller = {
  Option
}
