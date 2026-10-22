import { describe, expect, it } from 'vitest'
import { getPresentationUrl } from '../../../lib/docs.js'

describe('getPresentationUrl', () => {
  it.each(['0-portfolio', '1-pauhelper', '2-orchestratordata', '3-voicesimulator'])(
    'builds both presentation URLs for %s in both languages',
    (slug) => {
      for (const audience of ['business', 'technical']) {
        for (const language of ['en', 'es']) {
          expect(getPresentationUrl(slug, language, audience)).toBe(
            `/src/features/docs/${slug}/${audience}.html?lang=${language}`
          )
        }
      }
    }
  )
})
