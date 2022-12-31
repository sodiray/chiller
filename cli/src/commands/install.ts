import cmd from 'cmdish'
import fse from 'fs-extra'
import path from 'path'
import cfg from '../chiller-config'
import pkg from '../package'

type Services = {
  cmd: typeof cmd
  fse: typeof fse
  cfg: typeof cfg
}

export const install =
  ({ cmd, fse, cfg }: Services) =>
  async ({ force = false, source }: { force?: boolean; source?: string }) => {
    // - Read chiller json file to ensure it
    //   exists in the current directory
    await cfg.read()

    const Sourcer = {
      github: async (version: string) => {
        // - Clone the rayepps/chiller repo into .chiller
        await cmd('git clone https://github.com/rayepps/chiller.git .chiller')

        // - Pull the tags
        await cmd('git fetch --tags', {
          cwd: path.join(process.cwd(), '.chiller')
        })

        // - Checkout the ref/tag matching the currently
        //   installed chiller cli version
        await cmd(`git checkout tags/${version} -b ${version}`, {
          cwd: path.join(process.cwd(), '.chiller')
        })
      },
      path: async (relativePath: string) => {
        await fse.ensureDir(path.join(process.cwd(), '.chiller/app'))
        await fse.copy(
          path.join(process.cwd(), relativePath),
          path.join(process.cwd(), '.chiller/app')
        )
      }
    }

    const exists = await fse.pathExists('./.chiller')
    if (exists) {
      if (force) await fse.remove('.chiller')
      else return
    }

    // - Create .chiller directory and enter it
    await fse.ensureDir('./.chiller')

    if (source) await Sourcer.path(source)
    else await Sourcer.github(pkg.version)

    // - Install dependencies. Force turn of production. In
    //   production mode yarn will not install the dev deps
    await cmd('yarn --production=false', {
      cwd: path.join(process.cwd(), '.chiller/app')
    })
  }

export default install({
  cmd,
  fse,
  cfg
})
