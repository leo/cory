import path from 'path'
import { exists } from './etc'

const configFile = process.cwd() + '/config.json'
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

export default config
