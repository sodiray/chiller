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

const install =
  ({ cmd, fse, cfg }: Services) =>
  async ({ force }: { force: boolean }) => {
    // - Read chiller json file to ensure it
    //   exists in the current directory
    await cfg.read()

    const exists = await fse.pathExists('./.chiller')
    if (exists) {
      if (force) await fse.remove('.chiller')
      else return
    }

    // - Create .chiller directory and enter it
    await fse.ensureDir('./.chiller')

    // - Clone the rayepps/chiller repo into .chiller
    await cmd('git clone https://github.com/rayepps/chiller.git .chiller')

    // - Pull the tags
    await cmd('git fetch --tags', {
      cwd: path.join(process.cwd(), '.chiller')
    })

    // - Checkout the ref/tag matching the currently
    //   installed chiller cli version
    await cmd(`git checkout tags/${pkg.version} -b working`, {
      cwd: path.join(process.cwd(), '.chiller')
    })

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
