#!/usr/bin/env node

// Packages
import fs from 'fs-extra'
import chalk from 'chalk'

// Ours
import {exists, isSite} from '../lib/etc'
import config from '../lib/config'

if (!isSite()) {
  console.error(chalk.red('No site in here!'))
  process.exit(1)
}

if (!exists(config.outputDir)) {
  console.error('There\'s a site in here, but it hasn\'t been built yet.')
  console.error('Run ' + chalk.gray('cory build') + ' to build it.')

  process.exit(1)
}

fs.remove(config.outputDir, err => {
  if (err) {
    throw err
  }

  console.log(chalk.green('Everything cleaned up!'))
})
