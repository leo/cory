const mergeTrees = require('broccoli-merge-trees')
const compileSass = require('broccoli-sass')
const esTranspiler = require('broccoli-babel-transpiler')
const funnel = require('broccoli-funnel')

const dirs = {
  scss: 'assets/scss',
  js: 'assets/js',
  images: 'assets/images'
}

const styles = compileSass([dirs.scss], 'main.scss', 'styles.css', {
  outputStyle: 'compressed'
})

const scripts = esTranspiler(dirs.js, {
  compact: true
})

const images = new funnel(dirs.images, {
  destDir: 'images'
})

module.exports = mergeTrees([styles, scripts, images], {
  overwrite: true
})
