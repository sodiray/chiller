import cmd from 'cmdish'
import fse from 'fs-extra'
import path from 'path'
import cj from '../chiller-config'

type Services = {
  cmd: typeof cmd
  fse: typeof fse
  cj: typeof cj
}

const install =
  ({ cmd, fse, cj }: Services) =>
  async () => {
    // - Read chiller json file
    const chiller = await cj.read()

    // - Create .mojito directory and enter it
    await fse.ensureDir(path.join('~', '.chiller'))
    await cmd('cd .chiller')

    // - Clone the rayepps/mojito repo into .mojito
    await cmd('git clone https://github.com/rayepps/chiller.git')

    // - Checkout the ref/tag matching the currently
    //   installed mojito cli version
    await cmd(`git checkout ref/${chiller.version}`)

    // - Enter the app directory where the actual
    //   nextjs/react app is
    await cmd('cd app')

    // - Install dependencies
    await cmd('yarn')
  }

export default install({
  cmd,
  fse,
  cj
})
