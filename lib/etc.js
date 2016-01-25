const fs = require('fs')

exports.exists = function (path) {
  try {
    fs.statSync(path)
    return true
  } catch (err) {
    return false
  }
}
