import cmd from 'cmdish'
import fse from 'fs-extra'
import path from 'path'
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
    return (await schema.parseAsync(file)) as ChillerJsonConfig
  }
})

export default chillerJson({
  cmd,
  fse
})
