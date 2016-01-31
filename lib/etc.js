const fs = require('fs')

exports.exists = function (path) {
  try {
    fs.statSync(path)
    return true
  } catch (err) {
    return false
  }
}

exports.deleteDir = function (path, callback) {
  const me = this;

  fs.readdirSync(path).forEach(function (file, index) {
    var curPath = path + '/' + file

    if (fs.statSync(curPath).isDirectory()) {
      me.deleteDir(curPath)
    } else {
      fs.unlinkSync(curPath)
    }
  })

  fs.rmdirSync(path)

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
