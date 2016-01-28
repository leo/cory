#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')

const config = require('../lib/config')
const exists = require('../lib/etc').exists

const colors = require('colors')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const sass = require('node-sass')

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

const styles = fs.readdirSync(process.cwd() + '/assets/styles')

if (!exists(config.outputDir)) {
  fs.mkdirSync(config.outputDir)
}

function compileFile (resolve) {
  var meta = path.parse(process.cwd() + '/pages/' + this)
  var fullPath = meta.dir + '/' + meta.base

  try {
    var content = fs.readFileSync(fullPath, 'utf8')
  } catch (err) {
    reject(err)
  }

  var template = handlebars.compile(content)
  var outputPath = config.outputDir + '/' + meta.name + '.html'

  fs.writeFile(outputPath, template(tags), function (err) {
    if (err) {
      throw err
    }
    resolve()
  })
}

const assets = views.reduce((promiseChain, file) => {
  return promiseChain.then(new Promise(compileFile.bind(file)))
}, Promise.resolve())

rollup.rollup({
  entry: process.cwd() + '/assets/scripts/main.js',
  plugins: [
    babel()
  ]
}).then(function (bundle) {
  assets.then(bundle.write({
    dest: config.outputDir + '/assets/app.js',
    sourceMap: true
  }))
})

assets.then(new Promise(function (resolve, reject) {
  styles.forEach(function (file) {
    const outputFile = config.outputDir + '/assets/styles.css'

    sass.render({
      file: path.resolve( 'assets/styles/' + file),
      outFile: outputFile,
      outputStyle: 'compressed'
    }, function (err, result) {
      if (err) {
        reject(err)
      }

      fs.writeFile(outputFile, result.css, function (err) {
        if (err) {
          reject(err)
        }
        resolve()
      });
    })
  })
}))

assets.then(function () {
  const timerEnd = new Date().getTime()
  console.log(`Built the site in ${timerEnd - timerStart}ms.`.green);
}, function (reason) {
  throw reason
})
