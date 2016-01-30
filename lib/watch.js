const chokidar = require('chokidar')
const compile = require('./compiler').run

module.exports = function () {
  const watcher = chokidar.watch(process.cwd(), {
    ignored: /dist|layouts|.DS_Store/
  })

  console.log('Watching for changes...')

  process.on('SIGINT', function () {
    watcher.close()
    process.exit(0)
  })

  watcher.on('change', (which) => {
    const paths = new function () {
      this.full = which
      this.relative = this.full.replace(process.cwd(), '').replace('scss', 'css')
    }

    compile(paths, () => {
      console.log('File ' + paths.relative.gray + ' changed, rebuilt finished')
    })
  })
}
