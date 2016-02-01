#!/usr/bin/env node

const colors = require('colors')
const git = require('nodegit')
const exists = require('../lib/etc').isSite

if (!exists()) {
  console.error('No site in here!'.red)
  process.exit(1)
}

const branch = new Promise(function (resolve, reject) {
  git.Repository.open(process.cwd()).then(function (repo) {

    git.Branch.lookup(repo, 'gh-pages', 2).then(function (reference) {
      resolve(repo, reference)
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

branch.then(function (repo, branch) {
  console.log('Yeah, branch exists!')
})

branch.catch(function (reason) {
  console.error(reason)
  process.exit(1)
})
