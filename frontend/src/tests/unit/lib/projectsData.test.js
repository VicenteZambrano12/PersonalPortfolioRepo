import { describe, expect, it } from 'vitest'
import { projectsData } from '../../../lib/projectsData.js'
import { en } from '../../../i18n/languages/en.jsx'

describe('projectsData', () => {
  it('labels Orchestrator with its documented agent, application and deployment stack', () => {
    expect(projectsData.orchestratordata.tags).toEqual(['AI Agents', 'Gemini', 'React', 'GCP'])
    expect(projectsData.orchestratordata.modalTags).toEqual(expect.arrayContaining([
      'Python', 'FastAPI', 'Pydantic', 'Gemini', 'React', 'Vite', 'Tailwind CSS',
      'SQLite', 'Neon PostgreSQL', 'fakeredis', 'GCP Cloud Run', 'Docker', 'Terraform', 'GitHub Actions',
    ]))
    expect(projectsData.orchestratordata.modalTags).not.toContain('HTML/CSS')
  })

  it('labels PAUHelper with its documented RAG and Google AI stack', () => {
    expect(projectsData.pauhelper.tags).toEqual(['RAG', 'Gemini', 'React', 'GCP'])
    expect(projectsData.pauhelper.modalTags).toEqual(expect.arrayContaining([
      'FastAPI', 'LangGraph', 'Gemini', 'Vertex AI', 'Qdrant', 'Terraform',
    ]))
    expect(projectsData.pauhelper.modalTags).not.toContain('OpenAI API')
  })

  it('labels Plinius with its documented voice guide and deployment stack', () => {
    expect(projectsData.voicesimulator.tags).toEqual(['AI Agents', 'RAG', 'Gemini', 'React', 'GCP'])
    expect(projectsData.voicesimulator.modalTags).toEqual(expect.arrayContaining([
      'Python', 'FastAPI', 'RAG', 'Gemini', 'Speech-to-Text', 'Text-to-Speech',
      'React', 'Vite', 'Qdrant', 'GCP Cloud Run', 'Docker', 'Terraform', 'GitHub Actions',
    ]))
    expect(en.projects.voicesimulator.title).toBe('Plinius')
    expect(en.projects.voicesimulator.fullDescription).toContain('curated documents')
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

  it('uses the Plinius app URL for its live link', () => {
    expect(projectsData.voicesimulator.liveUrl).toBe(import.meta.env.VITE_HISTORIC_GUIDE_APP)
  })
})
