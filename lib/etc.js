const fs = require('fs')

exports.dirExists = function (folder) {
  try {
    return fs.statSync(folder).isDirectory()
  } catch (err) {
    return false
  }
}
