const fs = require('fs')
const path = require('path')

exports.exists = function (path) {
  try {
    fs.statSync(path)
    return true
  } catch (err) {
    return false
  }
}

exports.deleteDir = function (filePath, leaveDist, callback) {
  const me = this;

  fs.readdirSync(filePath).forEach(function (file, index) {
    var curPath = filePath + '/' + file
    const details = path.parse(curPath)

    if (fs.statSync(curPath).isDirectory()) {
      if (details.name !== '.git') {
        me.deleteDir(curPath)
      }
    } else if (details.base !== '.gitignore') {
      fs.unlinkSync(curPath)
    }
  })

  if (!leaveDist) {
    fs.unlinkSync(filePath + '/.gitignore')
    fs.rmdirSync(filePath)
  }

  if (typeof(callback) == 'function') {
    callback()
  }
}

exports.isSite = function () {
  const pkgPath = process.cwd() + '/package.json'

  if (!exports.exists(pkgPath)) {
    return false
  }

  const package = require(pkgPath)

  if (!package.scripts || !package.scripts.start) {
    return false
  }

  const startScript = package.scripts.start
  return startScript.includes('cory')
}
