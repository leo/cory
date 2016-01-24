#!/usr/bin/env node

const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
const open = require('open')
const mime = require('mime')

const params = process.argv.slice(2)
const workingDir = process.cwd()
const options = require(workingDir + '/config.json')

const config = {
  port: 4000
}

if (options) {
  Object.assign(config, options)
}

function should (param) {
  return params.indexOf(param) > -1
}

if (!should('serve')) {
  return
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
