const path = require('path')
const fs = require('fs')

const sass = require('node-sass')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')

const config = require('../lib/config')

exports.sass = function (resolve, reject, file) {
  const meta = path.parse(file)
  const outputFile = config.outputDir + '/assets/' + meta.name + '.css'

  sass.render({
    file: path.resolve('assets/styles/' + meta.base),
    outFile: outputFile,
    outputStyle: 'compressed'
  }, function (err, result) {
    if (err) {
      reject(err)
    }

    fs.writeFile(outputFile, result.css, function (err) {
      if (err) {
        reject(err)
      }
      resolve(file)
    });
  })
}

exports.js = function (resolve, reject, file) {
  const outFile = config.outputDir + '/assets/app.js'

  rollup.rollup({
    entry: process.cwd() + '/assets/scripts/main.js',
    plugins: [
      babel()
    ]
  }).then(function (bundle) {
    const result = bundle.generate({
      sourceMap: true
    })

    fs.writeFile(outFile, result.code, function (err) {
      if (err) {
        throw err
      }
      resolve(file || '')
    })

  })
}
