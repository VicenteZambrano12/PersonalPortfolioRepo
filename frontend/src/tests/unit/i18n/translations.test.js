import { describe, expect, it } from 'vitest'
import { en } from '../../../i18n/languages/en.jsx'
import { es } from '../../../i18n/languages/es.jsx'

// Recursively collects dotted key paths for every leaf value in an object.
function collectKeyPaths(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return collectKeyPaths(value, path)
    }
    return [path]
  })
}

describe('translation dictionaries', () => {
  it('expose the same set of keys in every language', () => {
    expect(collectKeyPaths(es).sort()).toEqual(collectKeyPaths(en).sort())
  })

  it('tag each dictionary with its own language code', () => {
    expect(en.code).toBe('en')
    expect(es.code).toBe('es')
  })
})
