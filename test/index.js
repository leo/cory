import test from 'ava'
import path from 'path'
import { isSite } from '../dist/lib/etc'

test('is site', t => {
  const template = path.resolve('../template')

  process.chdir(template)
  const status = isSite()

  t.true(status)
})
