const workingDir = process.cwd()
const options = require(workingDir + '/config.json')

var config = {
  port: 4000
}

if (options) {
  Object.assign(config, options)
}

module.exports = config
