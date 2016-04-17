#!/usr/bin/env node

import fs from 'fs-extra'
import path from 'path'
import inst from 'commander'
import colors from 'colors'
import chokidar from 'chokidar'
import walk from 'walk'
import ncp from 'ncp'
import broccoli from 'broccoli'
import Watcher from 'broccoli-sane-watcher'

import config from '../lib/config'
import { isSite as exists } from '../lib/etc'
import { compile } from '../lib/compiler'

inst
  .option('-w, --watch', 'Rebuild site if files change')
  .parse(process.argv)

if (!exists()) {
  console.error('No site in here!'.red)
  process.exit(1)
}

const timerStart = new Date().getTime()

const walker = walk.walk(process.cwd(), {
  filters: [
    'layouts',
    'dist',
    '.git',
    'node_modules',
    path.parse(config.assetDir).base
  ]
})

walker.on('file', function (root, fileStat, next) {
  const ignored = [
    'package.json',
    'config.json'
  ]

  if (ignored.indexOf(fileStat.name) > -1 || fileStat.name.charAt(0) == '.') {
    return next()
  }

  // You can't reference a object property within itself
  // So it's better to do it like this
  const paths = new function () {
    this.full = path.resolve(root, fileStat.name)
    this.relative = this.full.replace(process.cwd(), '').replace('scss', 'css')
  }

  compile(paths, function () {
    next()
  })
})

walker.on('end', () => {
  const timerEnd = new Date().getTime()
  const initialBuild = parseInt(timerEnd - timerStart)*1000000

  const tree = broccoli.loadBrocfile()
  const builder = new broccoli.Builder(tree)

  builder.build().then(results => {
    const dir = typeof results === 'string' ? results : results.directory
    let buildTime = results.totalTime

    // Copy files from tmp folder to the destination directory
    // And make sure to follow symlinks while doing so
    ncp(dir, config.outputDir + '/assets', {dereference: true}, err => {
      if (err) throw err

      if (buildTime) {
        // The original built time is in nanoseconds, so we need to convert it to milliseconds
        buildTime += initialBuild
        console.log(`Finished building after ${Math.floor(buildTime / 1e6)}ms.`.green)
      } else {
        console.log('Finished building.'.green)
      }

      if (!inst.watch) {
        builder.cleanup().catch(err => console.error(err))
      }
    })
  }).catch(err => console.error(err))

  if (inst.watch) {
    const watcher = chokidar.watch(process.cwd(), {
      ignored: /dist|.DS_Store|.git/
    })

    console.log('Watching for changes...')

    process.on('SIGINT', () => {
      watcher.close()
      process.exit(0)
    })

    watcher.on('change', (file) => {
      require('../lib/watch')('change', file)
    })
  }
})
