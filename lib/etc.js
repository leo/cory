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

exports.deleteDir = function (filePath, callback, leaveDist) {
  const me = this;

  fs.readdirSync(filePath).forEach(function (file, index) {
    var curPath = filePath + '/' + file

    if (fs.statSync(curPath).isDirectory()) {
      const name = path.parse(curPath).name

      if (name !== '.git') {
        me.deleteDir(curPath)
      }
    } else {
      fs.unlinkSync(curPath)
    }
  })

  if (!leaveDist) {
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
