#!/usr/bin/env node

import http from 'http'
import url from 'url'
import path from 'path'
import fs from 'fs-extra'
import { execSync as exec } from 'child_process'

import inst from 'commander'
import open from 'open'
import mime from 'mime'
import colors from 'colors'

import etc from '../lib/etc'
import config from '../lib/config'

inst
  .option('-p, --port <port>', 'The port on which your site will be available')
  .option('-w, --watch', 'Rebuild site if files change')
  .parse(process.argv)

if (inst.port) {
  config.port = inst.port
}

if (!etc.isSite()) {
  console.error('No site in here!'.red)
  process.exit(1)
}

if (!etc.exists(config.outputDir)) {
  try {
    exec('cory build', {stdio: [0, 1]})
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

function respond (status, message, type, encoding) {
  let request = this

  request.writeHead(status, {'Content-Type': type || 'text/plain'})
  request.write(message || 'Not Found', encoding || 'utf8')
  request.end()
}

http.ServerResponse.prototype.send = respond

function middleware (request, response) {
  const uri = url.parse(request.url).pathname
  let filename = path.join(config.outputDir, uri)

  try {
    const stats = fs.statSync(filename)
  } catch (err) {
    return response.send(404)
  }

  if (stats.isDirectory()) {
    filename += 'index.html'
  }

  if (!fs.statSync(filename).isFile()) {
    return response.send(404)
  }

  const type = mime.lookup(filename)
  const encoding = type !== 'text/html' && 'binary'

  fs.readFile(filename, 'binary', (err, file) => {
    if (err) {
      return response.send(500, err)
    }

    response.send(200, file, type, encoding)
  })
}

if (inst.watch) {
  const browserSync = require('browser-sync').create()

  browserSync.init({
    server: {
      baseDir: path.parse(config.outputDir).base
    },
    ui: false,
    port: config.port,
    notify: false,
    logPrefix: 'cory',
    watchOptions: {
      ignored: /dist|.DS_Store|.git/
    },
    files: [{
      match: [process.cwd()],
      fn: require('../lib/watch')
    }]
  })

  process.on('SIGINT', () => {
    browserSync.exit()
    process.exit(0)
  })
} else {
  const server = http.createServer(middleware)

  server.listen(config.port, function () {
    const port = this.address().port
    const url = 'http://localhost:' + port

    console.log('Your site is running at ' + url)
    open(url)
  })
}
