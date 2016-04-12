#!/usr/bin/env node

import path from 'path'
import fs from 'fs-extra'
import colors from 'colors'
import walk from 'walk'
import { exists } from '../lib/etc'
import config from '../lib/config'

const template = path.resolve(__dirname + '/../../template')

if (path.basename(process.cwd()) == 'template') {
  console.log('You shouldn\'t run ' + 'init'.gray + ' in here.')
  console.log('Please run it somewhere outside of the project.')

  process.exit(0)
}

const walker = walk.walk(template, {
  filters: [
    path.parse(config.outputDir).base,
    'node_modules'
  ]
})

walker.on('file', (root, fileStats, next) => {
  const way = root + '/' + fileStats.name
  const subPath = root.replace(template, '')
  const folder = process.cwd() + subPath

  if (!exists(folder)) {
    fs.ensureDirSync(folder)
  }

  const targetPath = process.cwd() +  '/' + subPath + '/' + fileStats.name
  const target = fs.createWriteStream(targetPath)

  const original = fs.createReadStream(way).pipe(target)

  target.on('error', console.error)
  original.on('error', console.error)

  next()
})

walker.on('end', () => console.log('Generated new site in ' + process.cwd().gray))
