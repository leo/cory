#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')

const config = require('../lib/config')
const exists = require('../lib/etc').exists
const compile = require('../lib/compile')

const inst = require('commander')
const colors = require('colors')

inst
  .option('-w, --watch', 'Rebuild site if files change')
  .parse(process.argv)

function doneCompiling(file) {
  const which = file.replace(process.cwd(), '')
  console.log('File ' + which.gray + ' changed, rebuilt finished')
}

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
    const details = path.parse(which)
    const type = details.ext.split('.')[1]

    switch (type) {
      case 'scss':
        compile.sass(doneCompiling, console.log, which)
        break
      case 'js':
        compile.js(doneCompiling, console.log, which)
        break
    }
    console.log(type)
  })
}

const tags = {
  greeting: 'Hello!',
  package: require(process.cwd() + '/package.json')
}

if (!exists(process.cwd() + '/config.json')) {
  console.error('No site in here!'.red)
  process.exit(1)
}

const timerStart = new Date().getTime()

try {
  const views = fs.readdirSync(process.cwd() + '/pages')
} catch (err) {
  throw err
}

const defaultLayout = fs.readFileSync(process.cwd() + '/layouts/default.hbs', 'utf8')
const styles = fs.readdirSync(process.cwd() + '/assets/styles')

if (!exists(config.outputDir)) {
  const dir = config.outputDir

  fs.mkdirSync(dir)
  fs.mkdirSync(dir + '/assets')
}

function compileFile (resolve) {
  var meta = path.parse(process.cwd() + '/pages/' + this)
  var fullPath = meta.dir + '/' + meta.base

  try {
    var content = fs.readFileSync(fullPath, 'utf8')
  } catch (err) {
    reject(err)
  }

  var layout = handlebars.compile(defaultLayout)({
    body: handlebars.compile(content)(tags)
  })

  var outputPath = config.outputDir + '/' + meta.name + '.html'

  fs.writeFile(outputPath, layout, function (err) {
    if (err) {
      throw err
    }
    resolve()
  })
}

const assets = views.reduce((promiseChain, file) => {
  return promiseChain.then(new Promise(compileFile.bind(file)))
}, Promise.resolve())

assets.then(new Promise((resolve, reject) => {
  compile.js(resolve, reject)
}))

assets.then(new Promise(function (resolve, reject) {
  styles.forEach((file) => {
    compile.sass(resolve, reject, file)
  })
}))

assets.then(function () {
  const timerEnd = new Date().getTime()
  console.log(`Built the site in ${timerEnd - timerStart}ms.`.green);
}, function (reason) {
  throw reason
})
