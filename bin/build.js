#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')

const config = require('../lib/config')
const output = process.cwd() + config.outputDir
const exists = require('../lib/etc').exists

const colors = require('colors')

const tags = {
  greeting: 'Hello!'
}

try {
  const timerStart = new Date().getTime()
  const files = fs.readdirSync(process.cwd() + '/pages')
} catch (err) {
  throw err
}

if (!exists(output)) {
  fs.mkdirSync(output)
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
  var outputPath = output + '/' + meta.name + '.html'

  fs.writeFile(outputPath, template(tags), function (err) {
    if (err) {
      throw err
    }
    resolve()
  })
}

const pages = files.reduce((promiseChain, file) => {
  return promiseChain.then(new Promise(compileFile.bind(file)))
}, Promise.resolve())

pages.then(function () {
  const timerEnd = new Date().getTime()
  console.log(`Built the site in ${timerEnd - timerStart}ms.`.green);
}, function (reason) {
  throw reason
})
