// Native
import path from 'path'

// Packages
import test from 'ava'

// Ours
import {isSite} from '../dist/lib/etc'

test('is site', t => {
  const template = path.resolve('../template')

  process.chdir(template)
  const status = isSite()

  t.true(status)
})
