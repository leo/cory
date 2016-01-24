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

function abort (response, msg, code) {
  response.writeHead(code || 404, {'Content-Type': 'text/plain'})
  response.write(msg || 'Not Found')
  response.end()
}

const server = http.createServer(function (request, response) {

  const uri = url.parse(request.url).pathname
  var filename = path.join(process.cwd() + '/dist', uri)

  try {
    const stats = fs.statSync(filename)
  } catch (err) {
    return abort(response)
  }

  if (stats.isDirectory()) {
    filename += 'index.html'
  }

  if (!fs.statSync(filename).isFile()) {
    return abort(response)
  }

  const type = mime.lookup(filename)
  const encoding = type == 'text/html' ? 'utf8' : 'binary'

  fs.readFile(filename, encoding, function(err, file) {
    if (err) {
      return abort(response, err, 500)
    }

    response.writeHead(200, {'Content-Type': type})
    response.write(file, encoding)
    response.end()
  })

})

server.listen(config.port, function () {
  const port = this.address().port
  const url = 'http://localhost:' + port

  console.log('Your site is running at ' + url)
  open(url)
})
