import chokidar from 'chokidar'
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

export const sync =
  ({ cmd, fse, cfg }: Services) =>
  async ({
    dest = './.chiller/app',
    watch = false
  }: {
    dest?: string
    watch?: boolean
  }) => {
    // - Ensure .chiller is installed
    const installed = fse.pathExists(
      path.join(process.cwd(), dest, 'node_modules')
    )
    if (!installed) {
      throw new Error(
        `Directory ${path.join(dest, 'node_modules')} does not exist. ` +
          'You probably need to run chiller install'
      )
    }

    // - Read chiller json file to ensure it
    //   exists in the current directory
    const config = await cfg.read()

    // - Write the chiller config file into the
    //   .chiller directory
    await fse.writeJson(
      path.join(process.cwd(), dest, 'src/chiller.json'),
      config
    )
    const doSync = async () => {
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

      const nonMarkdownTargets = targets.filter(t => !/\.mdx?$/.test(t))
      if (nonMarkdownTargets.length > 0) {
        throw new Error(
          'Documentation files must be either .md or .mdx. Found: ' +
            nonMarkdownTargets.join(', ')
        )
      }

      // - Generate the path for each file in
      //   the .chiller dir, always force
      //   renaming them to .mdx extension
      const files = targets.map(filePath => ({
        source: filePath,
        dest: path
          .join(process.cwd(), dest, 'src/pages', reducePath(filePath))
          .replace(/\.md$/, '.mdx')
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
          path.dirname(path.join(process.cwd(), dest, 'public', img))
        )
        await fse.copyFile(img, path.join(process.cwd(), dest, 'public', img))
      }
    }

    if (watch) {
      chokidar
        .watch([
          ...config.pages.filter(p => !p.startsWith('!')),
          'chiller.json'
        ])
        .on('all', doSync)
    } else {
      await doSync()
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
