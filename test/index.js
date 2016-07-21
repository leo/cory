// Packages
import test from 'ava'

// Native
import path from 'path'

// Ours
import { isSite } from '../dist/lib/etc'

test('is site', t => {
  const template = path.resolve('../template')

  process.chdir(template)
  const status = isSite()

  t.true(status)
})
