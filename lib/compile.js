const path = require('path')
const fs = require('fs')

const makeDir = require('mkdirp').sync
const sass = require('node-sass')
const babel = require('babel-core')
const handlebars = require('handlebars')

const config = require('../lib/config')

exports.sass = function (paths) {
  const meta = path.parse(paths.full)
  const output = config.outputDir + paths.relative

  const result = sass.renderSync({
    file: paths.full,
    outFile: output,
    sourceMap: true,
    outputStyle: 'compressed'
  })

  try {
    makeDir(path.dirname(output))
    fs.writeFileSync(output, result.css)
  } catch (err) {
    throw err
  }
}

exports.js = function (paths) {
  const result = babel.transformFileSync(paths.full, {
    presets: ['es2015']
  }).code

  const output = config.outputDir + paths.relative

  try {
    makeDir(path.dirname(output))
    fs.writeFileSync(output, result)
  } catch (err) {
    throw err
  }
}

exports.handlebars = function (paths) {
  const layout = fs.readFileSync(process.cwd() + '/layouts/default.hbs', 'utf8')
  const name = path.parse(paths.full).name
  const output = config.outputDir + '/' + name + '.html'

  const tags = {
    greeting: 'Hello!',
    package: require(process.cwd() + '/package.json')
  }

  try {
    const content = fs.readFileSync(paths.full, 'utf8')
  } catch (err) {
    throw err
  }

  const page = handlebars.compile(layout)({
    body: handlebars.compile(content)(tags)
  })

  try {
    makeDir(path.dirname(output))
    fs.writeFileSync(output, page)
  } catch (err) {
    throw err
  }
}
