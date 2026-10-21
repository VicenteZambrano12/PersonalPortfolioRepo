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
  it.each([en, es])('describes the Form fitness use case and its actual architecture ($code)', (dictionary) => {
    const project = dictionary.projects.orchestratordata
    expect(project.description).toContain('Form')
    expect(project.description).toContain('SQL')
    expect(project.subtitle).toMatch(/fitness/i)
    for (const technology of ['Gemini', 'Python', 'React', 'FastAPI', 'SQLite', 'Neon PostgreSQL', 'GCP Cloud Run', 'Docker', 'Terraform', 'GitHub Actions', 'fakeredis']) {
      expect(project.fullDescription).toContain(technology)
    }
    expect(project.fullDescription).toContain(dictionary.code === 'en'
      ? 'explicit save confirmation' : 'confirmación explícita')
    expect(project.fullDescription).toContain(dictionary.code === 'en'
      ? 'are not durable' : 'no son duraderos')
    expect(project.description).not.toMatch(/data pipelines|pipelines de datos/i)
    expect(project.fullDescription).not.toMatch(/isolated instances|instancias aisladas/i)
  })

  it('uses the requested business and technical presentation button labels', () => {
    expect(en.modal.viewBusinessPresentation).toBe('Business Overview')
    expect(en.modal.viewTechnicalPresentation).toBe('How it works?')
    expect(en.portfolio.businessPresentation).toBe('Portfolio: Business Overview')
    expect(en.portfolio.technicalPresentation).toBe('Portfolio: How it works?')
  })

  it('expose the same set of keys in every language', () => {
    expect(collectKeyPaths(es).sort()).toEqual(collectKeyPaths(en).sort())
  })

  it('tag each dictionary with its own language code', () => {
    expect(en.code).toBe('en')
    expect(es.code).toBe('es')
  })
})
