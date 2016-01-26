#!/usr/bin/env node

const fs = require('fs')
const colors = require('colors')

const exists = require('../lib/etc').exists
const output = process.cwd() + '/dist'

if (!exists(process.cwd() + '/config.json')) {
  console.error('No site in here!'.red)
  process.exit(1)
}

if (!exists(output)) {
  console.error('There\'s a site in here, but it hasn\'t been built yet.')
  console.error('Run ' + 'dago build'.gray + ' to build it.')
  process.exit(1)
}

function deleteOutput(path) {
  fs.readdirSync(output).forEach(function (file, index) {
    var curPath = path + '/' + file

    if (fs.statSync(curPath).isDirectory()) {
      deleteOutput(curPath)
    } else {
      fs.unlinkSync(curPath)
    }
  })
  fs.rmdirSync(path)
}

deleteOutput(output)
