// Packages
import fs from 'fs-extra'

// Native
import path from 'path'

export function exists (path) {
  try {
    fs.statSync(path)
    return true
  } catch (err) {
    return false
  }
}

export function deleteDir (filePath, leaveDist, callback) {
  const me = this

  fs.readdirSync(filePath).forEach(function (file, index) {
    let curPath = filePath + '/' + file
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
    fs.rmdirSync(filePath)
  }

  if (typeof(callback) == 'function') {
    callback()
  }
}

export function isSite () {
  const pkgPath = process.cwd() + '/package.json'

  if (!exports.exists(pkgPath)) {
    return false
  }

  const pkg = require(pkgPath)

  if (!pkg.scripts || !pkg.scripts.start) {
    return false
  }

  const startScript = pkg.scripts.start
  return startScript.includes('cory')
}
