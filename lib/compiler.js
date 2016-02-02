const path = require('path')
const fs = require('fs')

const makeDir = require('mkdirp').sync
const sass = require('node-sass')
const uglify = require('uglify-js')
const handlebars = require('handlebars')
const matter = require('front-matter')

const config = require('../lib/config')

exports.run = function compile (paths, callback) {
  const ext = path.parse(paths.full).ext.split('.')[1]

  switch (ext) {
    case 'scss':
      exports.sass(paths)
      break
    case 'js':
      exports.js(paths)
      break
    case 'hbs':
    case 'handlebars':
      exports.handlebars(paths)
      break
    case 'md':
    case 'markdown':
      exports.markdown(paths)
      break
    default:
      exports.copy(paths)
  }

  if (typeof callback === 'function') {
    callback()
  }
}

exports.sass = function (paths) {
  const meta = path.parse(paths.full)
  const output = config.outputDir + paths.relative

  const result = sass.renderSync({
    file: paths.full,
    outFile: output,
    sourceMap: config.sourceMaps,
    outputStyle: 'compressed',
    sourceMapEmbed: config.sourceMaps
  })

  try {
    makeDir(path.dirname(output))
    fs.writeFileSync(output, result.css)
  } catch (err) {
    throw err
  }
}

exports.js = function (paths) {
  const result = uglify.minify(paths.full)
  const output = config.outputDir + paths.relative

  try {
    makeDir(path.dirname(output))
    fs.writeFileSync(output, result.code)
  } catch (err) {
    throw err
  }
}

exports.handlebars = function (paths) {
  const name = path.parse(paths.full).name
  const subPath = paths.full.includes('/posts') ? 'posts/' : ''
  const folders = name === 'index' ? name : name + '/' + 'index'

  const output = config.outputDir + '/' + subPath + folders + '.html'

  try {
    var content = fs.readFileSync(paths.full, 'utf8')
  } catch (err) {
    throw err
  }

  var tags = {
    package: require(process.cwd() + '/package.json'),
    body: content
  }

  if (matter.test(content)) {
    const parsed = matter(content)

    tags.body = parsed.body
    tags.page = parsed.attributes
  }

  if (tags.page) {
    var layoutName = tags.page.layout || config.defaultLayout
  } else {
    var layoutName = config.defaultLayout
  }

  try {
    const layout = fs.readFileSync(process.cwd() + '/layouts/' + layoutName + '.hbs', 'utf8')
  } catch (err) {
    throw err
  }

  Object.assign(tags, config)

  var innerTags = {}
  Object.assign(innerTags, tags)

  delete innerTags['body']

  tags.body = handlebars.compile(tags.body)(innerTags)
  const page = handlebars.compile(layout)(tags)

  try {
    makeDir(path.dirname(output))
    fs.writeFileSync(output, page)
  } catch (err) {
    throw err
  }
}

exports.markdown = function (paths) {
  const engine = require('markdown').markdown

  const name = path.parse(paths.full).name
  const output = config.outputDir + '/posts/' + name + '.html'

  try {
    var content = fs.readFileSync(paths.full, 'utf8')
  } catch (err) {
    throw err
  }

  if (matter.test(content)) {
    const parsed = matter(content)
    content = parsed.body
  }

  const post = engine.toHTML(content)

  try {
    makeDir(path.dirname(output))
    fs.writeFileSync(output, post)
  } catch (err) {
    throw err
  }

  paths.full = output
  paths.relative = paths.full.replace(process.cwd() + '/dist', '')

  exports.handlebars(paths)
  fs.unlinkSync(paths.full)
}

exports.copy = function (paths) {
  if (paths.full.includes('node_modules')) {
    return
  }

  const file = fs.createReadStream(paths.full)
  const targetPath = config.outputDir + paths.relative

  makeDir(path.dirname(targetPath))
  const target = fs.createWriteStream(targetPath)

  file.pipe(target)

  target.on('error', function (err) {
    console.error(err)
  })
}
