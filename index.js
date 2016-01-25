#!/usr/bin/env node

const app = require('commander')

app
  .version(require(__dirname + '/package.json').version)

app
  .command('serve', 'Serve your site locally')
  .option('-p, --port <port>', 'The port on which your site will be available')
  .option('-w, --watch', 'Rebuild site if files change')

app
  .command('build', 'Buily your site')

app
  .command('init', 'Generate a new site in the current directory')

app.parse(process.argv)
