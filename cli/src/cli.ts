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
  .action(async ({ dest }: { dest: string }) => {
    console.log('🥶 syncing your files with your chiller app...')
    await sync({ dest })
  })

program
  .command('build')
  .description(
    'Initalize configuration for the project in the current directory'
  )
  .action(async () => {
    console.log('🥶 building your chiller app...')
    await build()
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
    'Optional, override the default source to get the chiller app from. Should be a relative path to a directory containing the source files of the chiller app',
    null
  )
  .description(
    'Initalize configuration for the project in the current directory'
  )
  .action(async (args: { force: boolean; source: string | null }) => {
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
