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
  async ({ ci }: { ci: boolean }) => {
    // - Read chiller json file to ensure it
    //   exists in the current directory
    await cfg.read()

    const exists = await fse.pathExists(
      path.join(process.cwd(), '.chiller/app/node_modules')
    )
    if (!exists) {
      throw new Error('First run chiller install and chiller sync')
    }

    // - If in CI mode, install Next at the correct
    //   version (matching the version the app uses)
    //   so platforms like Vercel know what version
    //   of next is being used. They can't see it
    //   because we do the build down in the .chiller
    //   directory.
    if (ci) {
      await cmd('yarn add --dev next@12.3.4')
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

    // - Copy the public directory from the .chiller
    //   directory up to the current working directory
    //   next needs it to be next door to .next when it
    //   reads the build output
    await fse.ensureDir(path.join(process.cwd(), 'public'))
    await fse.copy(
      path.join(process.cwd(), '.chiller/app/public'),
      path.join(process.cwd(), 'public')
    )
  }

export default build({
  cmd,
  fse,
  cfg
})
