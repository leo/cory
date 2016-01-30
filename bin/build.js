#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const walk = require('walk')

const config = require('../lib/config')
const exists = require('../lib/etc').exists
const compiler = require('../lib/compile')

const inst = require('commander')
const colors = require('colors')

inst
  .option('-w, --watch', 'Rebuild site if files change')
  .parse(process.argv)

if (!exists(process.cwd() + '/config.json')) {
  console.error('No site in here!'.red)
  process.exit(1)
}

function compile (paths, callback) {
  const ext = path.parse(paths.full).ext.split('.')[1]

  switch (ext) {
    case 'scss':
      compiler.sass(paths)
      break
    case 'js':
      compiler.js(paths)
      break
    case 'hbs':
      compiler.handlebars(paths)
      break
  }

  if (typeof callback === 'function') {
    callback()
  }
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

  compile(paths, function () {
    next()
  })
})

walker.on('end', function () {
  const timerEnd = new Date().getTime()
  console.log(`Built the site in ${timerEnd - timerStart}ms.`.green);
})

if (inst.watch) {
  const chokidar = require('chokidar')

  const watcher = chokidar.watch(process.cwd(), {
    ignored: /dist|layouts|.DS_Store/
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

    compile(paths, () => {
      console.log('File ' + paths.relative.gray + ' changed, rebuilt finished')
    })
  })
}
