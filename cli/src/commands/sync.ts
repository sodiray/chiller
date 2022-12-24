import cmd from 'cmdish'
import fse from 'fs-extra'
import glob from 'glob'
import path from 'path'
import { parallel, trim } from 'radash'
import cfg from '../chiller-config'

type Services = {
  cmd: typeof cmd
  cfg: typeof cfg
  fse: typeof fse
}

const sync =
  ({ cmd, fse, cfg }: Services) =>
  async () => {
    // - Ensure .chiller is installed
    const installed = fse.pathExists(
      path.join(process.cwd(), '.chiller/app/node_modules')
    )
    if (!installed) {
      throw new Error('A .chiller app was not found. Run chiller install')
    }

    // - Read chiller json file to ensure it
    //   exists in the current directory
    const config = await cfg.read()

    // - Find all mdx files that match the config
    //   glob. Find all matching and ignored
    //   files then diff to get the target files.
    const matches = config.pages
      .filter(p => !p.startsWith('!'))
      .flatMap(p => glob.sync(p))
    // .map(p => path.join(process.cwd(), p))
    const ignored = config.pages
      .filter(p => p.startsWith('!'))
      .flatMap(p => glob.sync(p))
    // .map(p => path.join(process.cwd(), p))
    const targets = matches.filter(m => !ignored.includes(m))

    // - Flatten the nested file names, replacing
    //   "/" with "_". The chiller app requires all
    //   mdx files to be in a single directory.
    const files = targets.map(filePath => ({
      source: filePath,
      dest: path.join(
        process.cwd(),
        '.chiller/app/src/pages/docs',
        trim(filePath.replace(process.cwd(), ''), '/').replace(/[\/\\]/g, '_')
      )
    }))

    // - Copy all the mdx files into the app directory
    await parallel(5, files, async ({ source, dest }) => {
      fse.copyFile(source, dest)
    })
  }

export default sync({
  cmd,
  cfg,
  fse
})
