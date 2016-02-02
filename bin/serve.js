#!/usr/bin/env node

const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
const exec = require('child_process').execSync

const inst = require('commander')
const open = require('open')
const mime = require('mime')
const colors = require('colors')

const etc = require('../lib/etc')
var config = require('../lib/config')

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

function respond(status, message, type, encoding) {
  var request = this

  request.writeHead(status, {'Content-Type': type || 'text/plain'})
  request.write(message || 'Not Found', encoding || 'utf8')
  request.end()
}

http.ServerResponse.prototype.send = respond

const server = http.createServer(function (request, response) {

  const uri = url.parse(request.url).pathname
  var filename = path.join(config.outputDir, uri)

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

  fs.readFile(filename, 'binary', function(err, file) {
    if (err) {
      return response.send(500, err)
    }

    response.send(200, file, type, encoding)
  })

})

const subPort = parseInt(config.port) - 1

server.listen(inst.watch ? subPort : config.port, function () {
  const port = this.address().port
  const url = 'http://localhost:' + port

  if (inst.watch) {
    const browserSync = require('browser-sync').create()

    browserSync.init({
      proxy: 'http://localhost:' + subPort,
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

    require('../lib/watch')(browserSync)

    process.on('SIGINT', () => {
      browserSync.exit()
      process.exit(0)
    })
  } else {
    console.log('Your site is running at ' + url)
    open(url)
  }
})
