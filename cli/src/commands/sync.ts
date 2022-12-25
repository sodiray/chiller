import cmd from 'cmdish'
import fse from 'fs-extra'
import glob from 'glob'
import path from 'path'
import { parallel, sift, trim, unique } from 'radash'
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
      throw new Error('Local .chiller does not exist. Run chiller install')
    }

    // - Read chiller json file to ensure it
    //   exists in the current directory
    const config = await cfg.read()

    // - Write the chiller config file into the
    //   .chiller directory
    await fse.writeJson(
      path.join(process.cwd(), '.chiller/app/src/chiller.json'),
      config
    )

    // - Find all mdx files that match the config
    //   glob. Find all matching and ignored
    //   files then diff to get the target files.
    const matches = config.pages
      .filter(p => !p.startsWith('!'))
      .flatMap(p => glob.sync(p))
      .map(p => path.join(process.cwd(), p))
    const ignored = config.pages
      .filter(p => p.startsWith('!'))
      .map(p => trim(p, '!'))
      .flatMap(p => glob.sync(p))
      .map(p => path.join(process.cwd(), p))
    const targets = matches.filter(m => !ignored.includes(m))

    // - Generate the path for each file in
    //   the .chiller dir.
    const files = targets.map(filePath => ({
      source: filePath,
      dest: path.join(
        process.cwd(),
        '.chiller/app/src/pages',
        reducePath(filePath)
      )
    }))

    // - Copy all the mdx files into the app directory
    await parallel(5, files, async ({ source, dest }) => {
      await fse.ensureDir(path.dirname(dest))
      await fse.copyFile(source, dest)
    })

    // - Copy all the static files (images) into the
    //   .chiller public directory
    const images = sift(
      unique([config.logo.light, config.logo.dark, config.favicon])
    )
    for (const img of images) {
      await fse.ensureDir(
        path.dirname(path.join(process.cwd(), '.chiller/app/public', img))
      )
      await fse.copyFile(
        img,
        path.join(process.cwd(), '.chiller/app/public', img)
      )
    }
  }

/**
 * Given an absolute path removes all parts
 * that match the path of the current working
 * directory.
 *
 * If cwd is
 *  - /User/john/folder
 *
 * The filePath input is
 *  - /User/john/folder/files/index.js
 *
 * The result will be
 *  - files/index.js
 */
const reducePath = (filePath: string) => {
  const cwdParts = process.cwd().split('/')
  const fileParts = filePath.split('/')
  const matchingParts: string[] = []
  for (const idx in fileParts) {
    if (cwdParts[idx] === fileParts[idx]) {
      matchingParts.push(fileParts[idx])
      continue
    }
    break
  }
  const sharedPath = matchingParts.join('/')
  return filePath.replace(sharedPath, '')
}

export default sync({
  cmd,
  cfg,
  fse
})
