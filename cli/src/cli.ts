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
  //   .option('-u, --url <url>', 'Optional, override the exobase api url', API_URL)
  .action(async (args: { url: string }) => {
    await dev()
  })

program
  .command('sync')
  .description('Authenticate with exobase to enable publish and deploy')
  //   .option('-u, --url <url>', 'Optional, override the exobase api url', API_URL)
  .action(async (args: { url: string }) => {
    await sync()
  })

program
  .command('build')
  //   .option('-u, --url <url>', 'Optional, override the exobase api url', API_URL)
  .description(
    'Initalize configuration for the project in the current directory'
  )
  .action(async (args: { url: string }) => {
    await build()
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
    console.log(args)
    await install(args)
  })

// program.command('deploy')
//   .description('Deploy a service to via exobase')
//   .option('-u, --url <url>', 'Optional, override the exobase api url', API_URL)
//   .option('-f, --follow', 'Optional, listen for logs and stream to console', false)
//   .argument('[path]', 'Optional directory path to the service source. Default: cwd', process.cwd())
//   .action(async (root, args) => {
//     await deploy({
//       url: args.url,
//       root: root,
//       follow: args.follow
//     })
//   })

program
  .parseAsync(process.argv)
  .then(() => {
    console.log(chalk.green('done!'))
  })
  .catch(err => {
    console.error(err)
  })
