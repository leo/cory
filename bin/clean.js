#!/usr/bin/env node

const fs = require('fs')
const colors = require('colors')

const etc = require('../lib/etc')
const config = require('../lib/config')
const exists = etc.exists

if (!etc.isSite()) {
  console.error('No site in here!'.red)
  process.exit(1)
}

if (!exists(config.outputDir)) {
  console.error('There\'s a site in here, but it hasn\'t been built yet.')
  console.error('Run ' + 'cory build'.gray + ' to build it.')
  process.exit(1)
}

etc.deleteDir(config.outputDir, false, function () {
  console.log('Everything cleaned up!'.green)
})
