#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const handlebars = require('handlebars')
const workingDir = process.cwd()
const output = workingDir + '/dist'

const tags = {
  greeting: 'Hello!'
}

try {
  const files = fs.readdirSync(workingDir + '/pages')
} catch (err) {
  throw err
}

files.forEach(function (file) {
  var meta = path.parse(workingDir + '/pages/' + file)
  var fullPath = meta.dir + '/' + meta.base

  fs.readFile(fullPath, 'utf8', function (err, content) {
    if (err) {
      throw err
    }

    var template = handlebars.compile(content)
    var outputPath = output + '/' + meta.name + '.html'

    try {
      fs.writeFileSync(outputPath, template(tags))
    } catch(err) {
      throw err
    }
  })
})
