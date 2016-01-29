#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const walk = require('walk')

const config = require('../lib/config')
const exists = require('../lib/etc').exists
const compile = require('../lib/compile')

const inst = require('commander')
const colors = require('colors')

inst
  .option('-w, --watch', 'Rebuild site if files change')
  .parse(process.argv)

if (!exists(process.cwd() + '/config.json')) {
  console.error('No site in here!'.red)
  process.exit(1)
}

const timerStart = new Date().getTime()

const walker = walk.walk(process.cwd(), {
  filters: ['layouts', 'dist']
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

  const ext = path.basename(paths.full).split('.')[1]

  switch (ext) {
    case 'js':
      compile.js(paths)
      break
    case 'scss':
      compile.sass(paths)
      break
    case 'hbs':
      compile.handlebars(paths)
      break
  }

  next()
})

walker.on('end', function () {
  const timerEnd = new Date().getTime()
  console.log(`Built the site in ${timerEnd - timerStart}ms.`.green);
})

if (inst.watch) {
  const chokidar = require('chokidar')

  const watcher = chokidar.watch(process.cwd(), {
    ignored: /dist/
  })

  process.on('SIGINT', function () {
    watcher.close()
    process.exit(0)
  })

  watcher.on('change', (which) => {
    const paths = new function () {
      this.full = which
      this.relative = this.full.replace(process.cwd(), '').replace('scss', 'css')
    }

    const ext = path.parse(paths.full).ext.split('.')[1]

    switch (ext) {
      case 'scss':
        compile.sass(paths)
        break
      case 'js':
        compile.js(paths)
        break
      case 'hbs':
        compile.handlebars(paths)
        break
    }

    console.log('File ' + paths.relative.gray + ' changed, rebuilt finished')
  })
}
