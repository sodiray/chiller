import cmd from 'cmdish'
import fse from 'fs-extra'
import path from 'path'
import cfg from '../chiller-config'

type Services = {
  cmd: typeof cmd
  fse: typeof fse
  cfg: typeof cfg
}

const build =
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

    // - Run the build
    await cmd('yarn build', {
      cwd: path.join(process.cwd(), '.chiller/app')
    })

    // - Copy the build output (.next directory)
    //   from the .chiller directory up to the
    //   current working directory
    await fse.ensureDir(path.join(process.cwd(), '.next'))
    await fse.copy(
      path.join(process.cwd(), '.chiller/app/.next'),
      path.join(process.cwd(), '.next')
    )
  }

export default build({
  cmd,
  fse,
  cfg
})
