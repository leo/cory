const configFile = process.cwd() + '/config.json'
const exists = require('./etc').exists

const options = exists(configFile) ? require(configFile) : false

var config = {
  port: 4000,
  outputDir: '/dist'
}

if (options) {
  Object.assign(config, options)
}

module.exports = config
