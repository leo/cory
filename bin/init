#!/usr/bin/env node

// Native
import path from 'path'
import {exec} from 'child_process'

// Packages
import fs from 'fs-extra'
import chalk from 'chalk'
import walk from 'walk'
import ora from 'ora'

// Ours
import {exists} from '../lib/etc'
import config from '../lib/config'

const template = path.resolve(path.join(__dirname, '/../../template'))

if (path.basename(process.cwd()) === 'template') {
  console.log('You shouldn\'t run ' + chalk.gray('init') + ' in here.')
  console.log('Please run it somewhere outside of the project.')

  process.exit(0)
}

const walker = walk.walk(template, {
  filters: [
    path.parse(config.outputDir).base,
    'node_modules'
  ]
})

function done() {
  console.log('Generated new site in ' + process.cwd().gray)
}

walker.on('file', (root, fileStats, next) => {
  const way = root + '/' + fileStats.name
  const subPath = root.replace(template, '')
  const folder = process.cwd() + subPath

  if (!exists(folder)) {
    fs.ensureDirSync(folder)
  }

  const targetPath = process.cwd() + '/' + subPath + '/' + fileStats.name
  const target = fs.createWriteStream(targetPath)

  const original = fs.createReadStream(way).pipe(target)

  target.on('error', console.error)
  original.on('error', console.error)

  next()
})

walker.on('end', () => {
  const spinner = ora(chalk.green('Installing missing packages via npm'))

  spinner.color = 'green'
  spinner.start()

  exec('npm install', (err, stdout, stderr) => {
    if (err) {
      throw err
    }

    if (stdout && stdout.indexOf('example@1.0.0') > -1) {
      spinner.stop()
      done()
    }

    if (stderr) {
      console.error(stderr)
    }
  })
})
