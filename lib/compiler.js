import path from 'path'
import fs from 'fs-extra'
import { sync as makeDir } from 'mkdirp'
import { compile as compileHbs } from 'handlebars'
import matter from 'front-matter'

import config from '../lib/config'

export function compile (paths, callback) {
  const ext = path.parse(paths.full).ext.split('.')[1]

  switch (ext) {
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

export function handlebars (paths) {
  const name = path.parse(paths.full).name
  const subPath = paths.full.includes('/posts') ? 'posts/' : ''
  const folders = name === 'index' ? name : name + '/' + 'index'

  const output = config.outputDir + '/' + subPath + folders + '.html'
  let content = false

  try {
    content = fs.readFileSync(paths.full, 'utf8')
  } catch (err) {
    throw err
  }

  let tags = {
    package: require(process.cwd() + '/package.json'),
    body: content
  }

  if (matter.test(content)) {
    const parsed = matter(content)

    tags.body = parsed.body
    tags.page = parsed.attributes
  }

  let layoutName = tags.page ? tags.page.layout || config.defaultLayout : config.defaultLayout
  let layout = false

  try {
    layout = fs.readFileSync(process.cwd() + '/layouts/' + layoutName + '.hbs', 'utf8')
  } catch (err) {
    throw err
  }

  Object.assign(tags, config)

  let innerTags = {}
  Object.assign(innerTags, tags)

  delete innerTags['body']

  tags.body = compileHbs(tags.body)(innerTags)
  const page = compileHbs(layout)(tags)

  try {
    makeDir(path.dirname(output))
    fs.writeFileSync(output, page)
  } catch (err) {
    throw err
  }
}

export function markdown (paths) {
  const engine = require('markdown').markdown

  const name = path.parse(paths.full).name
  const output = config.outputDir + '/posts/' + name + '.html'
  let content = false

  try {
    content = fs.readFileSync(paths.full, 'utf8')
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

export function copy (paths) {
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
