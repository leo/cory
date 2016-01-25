#!/usr/bin/env node

const app = require('commander')

app
  .version(require(__dirname + '/package.json').version)
  .command('serve', 'Serve your site locally')
  .parse(process.argv)
