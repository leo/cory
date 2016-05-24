#!/usr/bin/env node

import colors from 'colors'
import git from 'nodegit'
import etc from '../lib/etc'
import { execSync as exec } from 'child_process'
import walk from 'walk'
import { sync as makeDir } from 'mkdirp'

import path from 'path'
import fs from 'fs-extra'

const Branch = git.Branch
const Repository = git.Repository
const Commit = git.Commit

if (!etc.isSite()) {
  console.error('No site in here!'.red)
  process.exit(1)
}

const pkg = require(process.cwd() + '/package.json')

if (pkg.scripts && pkg.scripts.deploy) {
  const cmd = pkg.scripts.deploy
  console.log('> ' + cmd)

  try {
    exec(cmd, {stdio: [0, 1, 2]})
  } catch (err) {
    throw err
  }

  process.exit(1)
}

let repo

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

  try {
    exec('cory build', {stdio: [0, 1]})
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  const walker = walk.walk(process.cwd() + '/dist', {
    filters: ['.git']
  })

  let output = []

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

  walker.on('end', function () {
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
