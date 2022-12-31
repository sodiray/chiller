#!/usr/bin/env node

import chalk from 'chalk'
import { program } from 'commander'
import build from './commands/build'
import dev from './commands/dev'
import install from './commands/install'
import sync from './commands/sync'
import pkg from './package'

program
  .version(pkg.version)
  .name('chiller')
  .description('CLI to run and build chiller docs')

program
  .command('dev')
  .description('Authenticate with exobase to enable publish and deploy')
  .action(async (args: { url: string }) => {
    console.log('🥶 starting your local chiller app...')
    await dev()
  })

program
  .command('sync')
  .description('Authenticate with exobase to enable publish and deploy')
  .option(
    '-d, --dest [destination]',
    "Optional, override the default destination to sync the current directory into a different chiller directory. Should be a relative path to a directory containing the chiller app's source files of the chiller app",
    './.chiller/app'
  )
  .option(
    '-w, --watch',
    "Optional, if set process will stay open and re-execute when files change",
    false
  )
  .action(async ({ dest, watch }: { dest: string; watch: boolean }) => {
    console.log('🥶 syncing your files with your chiller app...')
    await sync({ dest, watch })
  })

program
  .command('build')
  .description(
    'Initalize configuration for the project in the current directory'
  )
  .option(
    '--ci',
    "Optional, if set the build will force install and sync before running build",
    false
  )
  .action(async ({ ci }: { ci: boolean }) => {
    console.log('🥶 building your chiller app...')
    await build({ ci })
  })

program
  .command('install')
  .option(
    '-f, --force',
    'Optional, go through install even if chiller app is already installed',
    false
  )
  .option(
    '--source [source]',
    'Optional, override the default source to get the chiller app from. Should be a relative path to a directory containing the source files of the chiller app'
  )
  .description(
    'Initalize configuration for the project in the current directory'
  )
  .action(async (args: { force: boolean; source?: string }) => {
    console.log('🥶 installing chiller app in .chiller directory...')
    await install(args)
  })

program
  .parseAsync(process.argv)
  .then(() => {
    console.log(chalk.green('🥶 done!'))
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
