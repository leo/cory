#!/usr/bin/env node

const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
const exec = require('child_process').execSync

const open = require('open')
const mime = require('mime')
const colors = require('colors')

const config = require('../lib/config')
const exists = require('../lib/etc').exists

if (!exists(process.cwd() + '/config.json')) {
  console.error('No site in here!'.red)
  process.exit(1)
}

if (!exists(process.cwd() + '/dist')) {
  try {
    exec('dago build', {stdio: [0, 1]})
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
  var filename = path.join(process.cwd() + '/dist', uri)

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

server.listen(config.port, function () {
  const port = this.address().port
  const url = 'http://localhost:' + port

  console.log('Your site is running at ' + url)
  open(url)
})
