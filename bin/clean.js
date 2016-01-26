#!/usr/bin/env node

const fs = require('fs')
const colors = require('colors')

const etc = require('../lib/etc')
const exists = etc.exists
const output = process.cwd() + '/dist'

if (!exists(process.cwd() + '/config.json')) {
  console.error('No site in here!'.red)
  process.exit(1)
}

if (!exists(output)) {
  console.error('There\'s a site in here, but it hasn\'t been built yet.')
  console.error('Run ' + 'dago build'.gray + ' to build it.')
  process.exit(1)
}

etc.deleteDir(output, function () {
  console.log('Everything cleaned up!'.green)
})
