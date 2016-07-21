#!/usr/bin/env node

// Packages
import args from 'args'
import updateNotifier from 'update-notifier'

// Ours
import pkg from '../../package.json'

updateNotifier({ pkg }).notify()

args
  .command('serve', 'Serve your site locally')
  .command('build', 'Buily your site')
  .command('init', 'Generate a new site in the current directory')
  .command('clean', 'Remove the generated output')

args.parse(process.argv)
