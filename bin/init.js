#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const walk = require('walk')

const template = __dirname + '/../template'
const walker = walk.walk(template)

function dirExists (folder) {
  try {
    return fs.statSync(folder).isDirectory()
  } catch (err) {
    return false
  }
}

walker.on('file', function (root, fileStats, next) {
  const way = root + '/' + fileStats.name
  const subPath = root.replace(template, '')
  const folder = process.cwd() + subPath

  if (!dirExists(folder)) {
    fs.mkdirSync(folder)
  }

  const targetPath = process.cwd() +  '/' + subPath + '/' + fileStats.name
  const target = fs.createWriteStream(targetPath)

  fs.createReadStream(way).pipe(target)
  next()
})
