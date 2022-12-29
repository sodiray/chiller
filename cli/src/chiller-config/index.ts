import cmd from 'cmdish'
import fse from 'fs-extra'
import path from 'path'
import { tryit } from 'radash'
import { ZodError } from 'zod'
import schema, { ChillerJsonConfig } from './schema'

type Services = {
  cmd: typeof cmd
  fse: typeof fse
}

export const chillerJson = ({ cmd, fse }: Services) => ({
  read: async () => {
    const file = await fse.readJson(path.join(process.cwd(), 'chiller.json'))
    if (!file) {
      throw new Error(
        'Chiller config file does not exist in the current directory'
      )
    }
    const [err, payload] = (await tryit(schema.parseAsync)(file)) as [
      ZodError,
      ChillerJsonConfig
    ]
    if (err) {
      throw new Error(
        'Invalid chiller.json: ' +
          err.issues
            .map(e => `${e.path.join('.')}: ${e.message.toLowerCase()}`)
            .join(', ')
      )
    }
    return payload
  }
})

export default chillerJson({
  cmd,
  fse
})
