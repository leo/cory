// Native
import path from 'path'

// Packages
import walk from 'walk'

// Ours
import {run as compile} from './compiler'

function finished() {
  if (this.reload) {
    return this.reload(this.name)
  }

  console.log('File ' + this.paths.relative.gray + ' changed, rebuilt finished')
}

export default function (event, file) {
  if (event !== 'change') {
    return
  }

  let dir = path.dirname(file)
  const lastSlash = dir.lastIndexOf('/')

  dir = dir.substring(lastSlash + 1)

  const Paths = function () {
    this.full = file
    this.relative = this.full.replace(process.cwd(), '').replace('scss', 'css')
  }

  this.paths = new Paths()
  this.name = path.basename(this.paths.relative)

  if (dir === 'layouts') {
    const walker = walk.walk(process.cwd() + '/pages')

    walker.on('file', (root, fileStat, next) => {
      const newPaths = new Paths()

      newPaths.full = path.resolve(root, fileStat.name)
      newPaths.relative = newPaths.full.replace(process.cwd(), '')

      compile(newPaths, next)
    })

    walker.on('end', finished.bind(this))

    return
  }

  compile(this.paths, finished.bind(this))
}
