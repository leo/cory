#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const walk = require('walk')
const colors = require('colors')

const template = __dirname + '/../template'
const config = require('../lib/config')
const exists = require('../lib/etc').exists

if (path.basename(process.cwd()) == 'template') {
  console.log('You shouldn\'t run ' + 'init'.gray + ' in here.')
  console.log('Please run it somewhere outside of the project.')
  process.exit(0)
}

const walker = walk.walk(template, {
  filters: [path.parse(config.outputDir).base]
})

walker.on('file', function (root, fileStats, next) {
  const way = root + '/' + fileStats.name
  const subPath = root.replace(template, '')
  const folder = process.cwd() + subPath

  if (!exists(folder)) {
    fs.mkdirSync(folder)
  }

  const targetPath = process.cwd() +  '/' + subPath + '/' + fileStats.name
  const target = fs.createWriteStream(targetPath)

  const original = fs.createReadStream(way).pipe(target)

  target.on('error', console.error)
  original.on('error', console.error)

  next()
})

walker.on('end', function() {
  console.log('Generated new site in ' + process.cwd().gray)
})
