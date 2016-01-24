#!/usr/bin/env node

const app = require('koa')()
const serve = require('koa-static')
const open = require('open')

const params = process.argv.slice(2)
const workingDir = process.cwd()

function should (param) {
  return params.indexOf(param) > -1
}

if (!should('serve')) {
  return
}

app.use(serve(workingDir + '/dist'))

app.listen(4000, function () {
  const port = this.address().port
  const url = 'http://localhost:' + port

  console.log('Your site is running at ' + url)
  open(url)
})
