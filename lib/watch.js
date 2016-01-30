const chokidar = require('chokidar')
const path = require('path')
const walk = require('walk')
const compile = require('./compiler').run

function finished (paths) {
  console.log('File ' + paths.relative.gray + ' changed, rebuilt finished')
}

module.exports = function (browserSync) {
  const watcher = chokidar.watch(process.cwd(), {
    ignored: /dist|.DS_Store/
  })

  if (!browserSync) {
    console.log('Watching for changes...')
  }

  process.on('SIGINT', function () {
    watcher.close()
    process.exit(0)
  })

  watcher.on('change', (which) => {
    var dir = path.dirname(which)
    var lastSlash = dir.lastIndexOf('/')

    dir = dir.substring(lastSlash + 1)

    const Paths = function () {
      this.full = which
      this.relative = this.full.replace(process.cwd(), '').replace('scss', 'css')
    }

    if (dir === 'layouts') {
      const walker = walk.walk(process.cwd() + '/pages')

      walker.on('file', function (root, fileStat, next) {
        var newPaths = new Paths

        newPaths.full = path.resolve(root, fileStat.name)
        newPaths.relative = newPaths.full.replace(process.cwd(), '')

        compile(newPaths, next)
      })

      walker.on('end', function() {
        finished(new Paths)
      })

      return
    }

    const originals = new Paths

    compile(originals, () => {
      if (browserSync) {
        const filename = path.basename(originals.relative)
        browserSync.reload(filename)
      } else {
        finished(originals)
      }
    })
  })
}
