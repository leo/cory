#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const walk = require('walk')
const colors = require('colors')

const template = __dirname + '/../template'
const exists = require('../lib/etc').exists

const walker = walk.walk(template, {
  filters: ['dist']
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

  fs.createReadStream(way).pipe(target)
  next()
})

walker.on('end', function() {
  console.log('Generated new dago site in ' + process.cwd().gray)
})
