const path = require('path')

const configFile = process.cwd() + '/config.json'
const exists = require('./etc').exists
const options = exists(configFile) ? require(configFile) : false

var config = {
  port: 4000,
  outputDir: process.cwd() + '/dist',
  sourceMaps: true,
  defaultLayout: 'main'
}

if (options) {
  if (options.outputDir) {
    options.outputDir = path.resolve(options.outputDir)
  }

  Object.assign(config, options)
}

module.exports = config
