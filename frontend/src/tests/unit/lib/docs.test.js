import { describe, expect, it } from 'vitest'
import { getDocUrl } from '../../../lib/docs.js'

describe('getDocUrl', () => {
  it('builds the public doc URL from slug, language and file name', () => {
    expect(getDocUrl('pauhelper', 'en', 'techdoc')).toBe(
      '/assets/projects/pauhelper/docs/en/techdoc.pdf'
    )
  })

  it('reflects the requested language in the path', () => {
    expect(getDocUrl('pauhelper', 'es', 'nontechdoc')).toBe(
      '/assets/projects/pauhelper/docs/es/nontechdoc.pdf'
    )
  })
})
