import cmd from 'cmdish'
import fse from 'fs-extra'
import path from 'path'
import cfg from '../chiller-config'

type Services = {
  cmd: typeof cmd
  fse: typeof fse
  cfg: typeof cfg
}

export const dev =
  ({ cmd, fse, cfg }: Services) =>
  async () => {
    // - Read chiller json file to ensure it
    //   exists in the current directory
    await cfg.read()

    const exists = await fse.pathExists(
      path.join(process.cwd(), '.chiller/app/node_modules')
    )
    if (!exists) {
      throw new Error('First run chiller install and chiller sync')
    }

    // - Install dependencies
    await cmd('yarn dev', {
      cwd: path.join(process.cwd(), '.chiller/app')
    })
  }

export default dev({
  cmd,
  fse,
  cfg
})
