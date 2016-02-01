#!/usr/bin/env node

const colors = require('colors')
const git = require('nodegit')
const exists = require('../lib/etc').isSite

const Branch = git.Branch
const Repository = git.Repository
const Index = git.Index

if (!exists()) {
  console.error('No site in here!'.red)
  process.exit(1)
}

const found = new Promise(function (resolve, reject) {
  Repository.open(process.cwd()).then(function (repo) {

    Branch.lookup(repo, 'gh-pages', 1).then(function (reference) {
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

found.then(function (repo, branch) {
  console.log('Yeah, branch exists!')
  process.exit(1)
})

found.catch(function (reason) {
  console.error(reason)
  process.exit(1)
})
