import { describe, expect, it } from 'vitest'
import { projectsData } from '../../../lib/projectsData.js'
import { en } from '../../../i18n/languages/en.jsx'

describe('projectsData', () => {
  it('labels PAUHelper with its documented RAG and Google AI stack', () => {
    expect(projectsData.pauhelper.tags).toEqual(['RAG', 'Gemini', 'React', 'GCP'])
    expect(projectsData.pauhelper.modalTags).toEqual(expect.arrayContaining([
      'FastAPI', 'LangGraph', 'Gemini', 'Vertex AI', 'Qdrant', 'Terraform',
    ]))
    expect(projectsData.pauhelper.modalTags).not.toContain('OpenAI API')
  })

  it('gives every project an id, slug, icon and tags', () => {
    Object.entries(projectsData).forEach(([id, project]) => {
      expect(project.slug).toEqual(expect.any(String))
      expect(project.icon).toEqual(expect.any(String))
      expect(Array.isArray(project.tags)).toBe(true)
      expect(Array.isArray(project.modalTags)).toBe(true)
      expect(project.slug.length).toBeGreaterThan(0)
      // Sanity: the id is used as a lookup key into the translations.
      expect(id).toEqual(expect.any(String))
    })
  })

  it('has a matching translation entry for every project id', () => {
    Object.keys(projectsData).forEach((id) => {
      expect(en.projects[id]).toBeDefined()
    })
  })
})
