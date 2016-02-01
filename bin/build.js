#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const walk = require('walk')

const config = require('../lib/config')
const exists = require('../lib/etc').isSite
const compile = require('../lib/compiler').run

const inst = require('commander')
const colors = require('colors')

inst
  .option('-w, --watch', 'Rebuild site if files change')
  .parse(process.argv)

if (!exists()) {
  console.error('No site in here!'.red)
  process.exit(1)
}

const timerStart = new Date().getTime()

const walker = walk.walk(process.cwd(), {
  filters: ['layouts', 'dist', '.git']
})

walker.on('file', function (root, fileStat, next) {
  const ignored = [
    'package.json',
    'config.json'
  ]

  if (ignored.indexOf(fileStat.name) > -1 || fileStat.name.charAt(0) == '.') {
    return next()
  }

  // You can't reference a object property within itself
  // So it's better to do it like this
  const paths = new function () {
    this.full = path.resolve(root, fileStat.name)
    this.relative = this.full.replace(process.cwd(), '').replace('scss', 'css')
  }

  compile(paths, function () {
    next()
  })
})

walker.on('end', function () {
  const timerEnd = new Date().getTime()
  console.log(`Built the site in ${timerEnd - timerStart}ms.`.green)

  // Start watching now
  if (inst.watch) require('../lib/watch')()
})
