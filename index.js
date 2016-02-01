#!/usr/bin/env node

const app = require('commander')

app
  .version(require(__dirname + '/package.json').version)

app
  .command('serve', 'Serve your site locally')
  .command('build', 'Buily your site')
  .command('init', 'Generate a new site in the current directory')
  .command('clean', 'Remove the generated output')
  .command('deploy', 'Deploy your site to GitHub Pages')

app.parse(process.argv)
