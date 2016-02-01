#!/usr/bin/env node

const colors = require('colors')
const git = require('nodegit')
const etc = require('../lib/etc')
const exec = require('child_process').execSync;
const walk = require('walk')
const makeDir = require('mkdirp').sync

const path = require('path')
const fs = require('fs')

const Branch = git.Branch
const Repository = git.Repository
const Commit = git.Commit

if (!etc.isSite()) {
  console.error('No site in here!'.red)
  process.exit(1)
}

try {
  exec('cory build', {stdio: [0, 1]})
} catch (err) {
  console.error(err)
  process.exit(1)
}

var repo

Repository.open(process.cwd())

const found = new Promise(function (resolve, reject) {
  Repository.open(process.cwd()).then(function (repoRef) {

    repo = repoRef

    Branch.lookup(repo, 'gh-pages', 1).then(function (reference) {
      resolve()
    }).catch(function (reason) {
      reject(reason.toString())
    })

  }).catch(function (reason) {
    const stringErr = reason.toString()

    if (stringErr.includes('Could not find')) {
      reject('This site isn\'t a repository!')
    } else {
      reject(stringErr)
    }
  })
})

found.then(function () {

  const walker = walk.walk(process.cwd() + '/dist', {
    filters: ['.git']
  })

  var output = []

  walker.on('file', function (root, fileStat, next) {
    if (fileStat.name === '.DS_Store') {
      return next()
    }

    const paths = {}

    paths.full = path.resolve(root, fileStat.name)
    paths.relative = paths.full.replace(process.cwd() + '/dist', '')

    fs.readFile(paths.full, (err, data) => {
      if (err) throw err

      output.push({
        path: process.cwd() + paths.relative,
        buffer: data
      })

      next()
    })
  })

  walker.on('end', function() {
    try {
      exec('git checkout gh-pages')
    } catch (err) {
      throw err
    }

    etc.deleteDir(process.cwd(), true)

    for (file of output) {
      try {
        makeDir(path.dirname(file.path))
        fs.writeFileSync(file.path, file.buffer)
      } catch (err) {
        throw err
      }
    }

    const defaultSig = git.Signature.default(repo)

    try {
      exec('git add -A *')
      exec('git commit -am "Deployed"')
      exec('git push origin gh-pages')
      exec('git checkout master')
    } catch (err) {
      throw err
    }

    console.log('Deployed!'.green)
    process.exit(1)
  })

})

found.catch(function (reason) {
  console.error(reason)
  process.exit(1)
})
