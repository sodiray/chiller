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
  .action(async (args: { url: string }) => {
    console.log('🥶 syncing your files with your chiller app...')
    await sync()
  })

program
  .command('build')
  .option(
    '--ci',
    'Optional, tells the build to operate in ci mode. Useful when running build in Vercel',
    false
  )
  .description(
    'Initalize configuration for the project in the current directory'
  )
  .action(async (args: { ci: boolean }) => {
    console.log('🥶 building your chiller app...')
    await build(args)
  })

program
  .command('install')
  .option(
    '-f, --force',
    'Optional, go through install even if chiller app is already installed',
    false
  )
  .description(
    'Initalize configuration for the project in the current directory'
  )
  .action(async (args: { force: boolean }) => {
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
