#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')

const workingDir = process.cwd()
const output = workingDir + '/dist'
const exists = require('../lib/etc').exists

const tags = {
  greeting: 'Hello!'
}

try {
  const timerStart = new Date().getTime()
  const files = fs.readdirSync(workingDir + '/pages')
} catch (err) {
  throw err
}

if (!exists(output)) {
  fs.mkdirSync(output)
}

function compileFile (resolve) {
  var meta = path.parse(workingDir + '/pages/' + this)
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
  console.log(`Built the site in ${timerEnd - timerStart}ms.`);
}, function (reason) {
  throw reason
})
