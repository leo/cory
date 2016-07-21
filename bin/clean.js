#!/usr/bin/env node

// Packages
import fs from 'fs-extra'
import colors from 'colors'

// Ours
import { exists, isSite } from '../lib/etc'
import config from '../lib/config'

if (!isSite()) {
  console.error('No site in here!'.red)
  process.exit(1)
}

if (!exists(config.outputDir)) {
  console.error('There\'s a site in here, but it hasn\'t been built yet.')
  console.error('Run ' + 'cory build'.gray + ' to build it.')

  process.exit(1)
}

fs.remove(config.outputDir, err => {
  if (err) throw err
  console.log('Everything cleaned up!'.green)
})
