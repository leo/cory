#!/usr/bin/env node

import app from 'commander'
import updateNotifier from 'update-notifier'
import pkg from '../../package.json'

updateNotifier({ pkg }).notify()

app
  .version(pkg.version)

app
  .command('serve', 'Serve your site locally')
  .command('build', 'Buily your site')
  .command('init', 'Generate a new site in the current directory')
  .command('clean', 'Remove the generated output')
  .command('deploy', 'Deploy your site to GitHub Pages')

app.parse(process.argv)
