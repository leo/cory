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
      me(curPath)
    } else {
      fs.unlinkSync(curPath)
    }
  })

  fs.rmdirSync(path)
}
