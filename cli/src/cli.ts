#!/usr/bin/env node

// import prompt from 'prompt-sync'
import chalk from 'chalk'
import { program } from 'commander'
import build from './commands/build'
import dev from './commands/dev'
import install from './commands/install'

program
  .version('0.1.0')
  .name('mojito')
  .description('CLI to run and build mojito docs')

program
  .command('dev')
  .description('Authenticate with exobase to enable publish and deploy')
  //   .option('-u, --url <url>', 'Optional, override the exobase api url', API_URL)
  .action(async (args: { url: string }) => {
    await dev()
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
  //   .option('-u, --url <url>', 'Optional, override the exobase api url', API_URL)
  .description(
    'Initalize configuration for the project in the current directory'
  )
  .action(async (args: { url: string }) => {
    await install()
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
