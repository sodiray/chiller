import cmd from 'cmdish'
import cfg from '../chiller-config'
import pkg from '../package'

type Services = {
  cmd: typeof cmd
  cfg: typeof cfg
}

const install =
  ({ cmd, cfg }: Services) =>
  async () => {
    // - Read chiller json file to ensure it
    //   exists in the current directory
    await cfg.read()

    // - Create .mojito directory and enter it
    await cmd('mkdir .chiller')
    await cmd('cd .chiller')

    // - Clone the rayepps/mojito repo into .mojito
    await cmd('git clone https://github.com/rayepps/chiller.git')

    // - Checkout the ref/tag matching the currently
    //   installed mojito cli version
    await cmd(`git checkout ref/${pkg.version}`)

    // - Enter the app directory where the actual
    //   nextjs/react app is
    await cmd('cd app')

    // - Install dependencies
    await cmd('yarn')
  }

export default install({
  cmd,
  cfg
})
