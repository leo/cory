#!/usr/bin/env node

const runner = require('commander')

runner
  .version(require(__dirname + '/package.json').version)
  .command('serve', 'Serve your site locally')
  .parse(process.argv)
