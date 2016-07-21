// Native
import path from 'path'

// Ours
import { exists } from './etc'

const configFile = process.cwd() + '/config.json'
const options = exists(configFile) ? require(configFile) : false

let config = {
  port: 4000,
  outputDir: process.cwd() + '/dist',
  sourceMaps: true,
  defaultLayout: 'main',
  assetDir: process.cwd() + '/assets'
}

const toResolve = [
  'outputDir',
  'assetDir'
]

if (options) {
  for (let property of toResolve) {
    if (options[property]) {
      options[property] = path.resolve(options[property])
    }
  }

  Object.assign(config, options)
}

export default config
