#!/usr/bin/env node

import fs from 'fs-extra'
import colors from 'colors'

import { isSite, exists } from '../lib/etc'
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

etc.deleteDir(config.outputDir, false, () => console.log('Everything cleaned up!'.green))
