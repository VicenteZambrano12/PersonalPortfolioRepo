import { afterEach, describe, expect, it, vi } from 'vitest'
import { getPresentationContent } from '../../../features/docs/content.js'
import { renderDiagram } from '../../../features/docs/diagram.js'

const sectionIds = ['3', '4', '5', '6', '6.1', '6.2', '6.3', '6.4', '6.5', '7', '8', '9', '10', '11']

vi.mock('reveal.js', () => ({
  default: vi.fn(function () {
    this.initialize = vi.fn().mockResolvedValue()
  }),
}))

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
  document.body.innerHTML = ''
  document.body.className = ''
  window.history.replaceState(null, '', '/')
})

function sections(language = 'en') {
  return Object.fromEntries(getPresentationContent('2-orchestratordata', 'technical', language)
    .slides.map(slide => [slide[2].section, slide]))
}

function text(slide) {
  return JSON.stringify(slide)
}

describe('Orchestrator technical presentation', () => {
  it.each(['en', 'es'])('covers every technical section and agent workflow with an accessible schematic (%s)', (language) => {
    const content = getPresentationContent('2-orchestratordata', 'technical', language)
    expect(content.isTemplate).toBe(false)
    expect(content.showOverview).toBe(false)
    expect(content.source).toContain('3–11')
    expect(content.source).toContain('6.1–6.5')
    expect(content.slides.map(([, , diagram]) => diagram.section)).toEqual(sectionIds)
    for (const [title, notes, diagram] of content.slides) {
      expect(title.startsWith(`${diagram.section}. `)).toBe(true)
      expect(notes).toHaveLength(3)
      expect(notes.every(([heading, body]) => heading.length > 0 && body.length > 0)).toBe(true)
      expect(diagram.caption).toBe(`${diagram.section} · ${title.slice(diagram.section.length + 2)}`)
      const ids = diagram.nodes.map(node => node.id)
      expect(new Set(ids).size).toBe(ids.length)
      expect(ids.length).toBeGreaterThanOrEqual(4)
      for (const node of diagram.nodes) {
        expect(node.label.every(line => typeof line === 'string' && line.length > 0)).toBe(true)
        expect(node.x).toBeGreaterThanOrEqual(0)
        expect(node.y).toBeGreaterThanOrEqual(0)
        expect(node.x + node.width).toBeLessThanOrEqual(diagram.width)
        expect(node.y + node.height).toBeLessThanOrEqual(diagram.height)
        expect(node.label.length * 24).toBeLessThanOrEqual(node.height)
      }
      for (const edge of diagram.edges) {
        expect(ids).toContain(edge.from)
        expect(ids).toContain(edge.to)
        for (const [x, y] of edge.via ?? []) {
          expect(x).toBeGreaterThanOrEqual(0)
          expect(x).toBeLessThanOrEqual(diagram.width)
          expect(y).toBeGreaterThanOrEqual(0)
          expect(y).toBeLessThanOrEqual(diagram.height)
        }
      }
      const figure = renderDiagram(diagram, content.labels.diagramHint)
      const svg = figure.querySelector('svg')
      expect(svg).toHaveAttribute('role', 'img')
      expect(svg.querySelector('title').textContent).toBe(diagram.caption)
      expect(svg.querySelector('desc').textContent).toBeTruthy()
      expect(figure.querySelector('.diagram-viewport')).toHaveAttribute('tabindex', '0')
      expect(figure.querySelectorAll('.diagram-node')).toHaveLength(ids.length)
      expect(figure.querySelectorAll('.diagram-edge')).toHaveLength(diagram.edges.length)
    }
  })

  it('keeps diagram structure identical across languages and localizes technical notes', () => {
    const english = sections('en')
    const spanish = sections('es')
    for (const id of sectionIds) {
      const [enTitle, enNotes, enDiagram] = english[id]
      const [esTitle, esNotes, esDiagram] = spanish[id]
      expect(enTitle.startsWith(`${id}. `)).toBe(true)
      expect(esTitle.startsWith(`${id}. `)).toBe(true)
      expect(enNotes).not.toEqual(esNotes)
      expect(enDiagram.nodes.map(({ label, ...node }) => ({ ...node, lines: label.length })))
        .toEqual(esDiagram.nodes.map(({ label, ...node }) => ({ ...node, lines: label.length })))
      expect(enDiagram.edges.map(({ label, ...edge }) => ({ ...edge, labeled: Boolean(label) })))
        .toEqual(esDiagram.edges.map(({ label, ...edge }) => ({ ...edge, labeled: Boolean(label) })))
    }
  })

  it('preserves routing contracts, distinct retry rules and explicit save confirmation', () => {
    const content = sections()
    expect(text(content['6'])).toContain('latest two session turns')
    expect(text(content['6.1'])).toContain('one plain-text ID, not JSON')
    expect(text(content['6.1'])).toContain('three attempts total')
    expect(text(content['6.1'])).toContain('provider and configuration failures propagate')
    expect(text(content['6.2'])).toContain('weider or ppl')
    expect(text(content['6.2'])).toContain('hours_per_session: >0 and ≤24')
    expect(text(content['6.2'])).toContain('Decision and plan validation each allow three attempts')
    expect(text(content['6.2'])).toContain('no prescribed weights')
    expect(text(content['6.2'])).toContain('needs_parameters')
    expect(text(content['6.2'])).toContain('awaiting_confirmation')
    const routine = content['6.2'][2]
    expect(routine.edges).toContainEqual(expect.objectContaining({ from: 'confirm', to: 'persist', label: 'Confirm save' }))
    expect(routine.edges.some(edge => edge.from === 'generate' && edge.to === 'persist')).toBe(false)
    expect(text(content['6.3'])).toContain('fuzzy score ≥0.78 and lead ≥0.08')
    expect(text(content['6.3'])).toContain('No three-attempt repair loop')
    expect(text(content['6.3'])).toContain('Only llm_explanation is generated')
    expect(text(content['6.4'])).toContain('Today + 6 preceding days')
    expect(text(content['6.4'])).toContain('user_id; day_type = null')
    expect(text(content['6.4'])).toContain('data stays unchanged')
    expect(text(content['6.4'])).toContain('one session cannot support a two-session comparison')
  })

  it.each(['en', 'es'])('includes every database table, main field and one-to-many relationship (%s)', (language) => {
    const diagram = sections(language)['7'][2]
    const expected = {
      users: ['dim_users', 'id', 'username', 'weight_unit', 'created_at'],
      routines: ['dim_routines', 'id', 'user_id', 'name', 'description', 'is_active', 'updated_at', 'created_at'],
      exercises: ['dim_exercises', 'id', 'name', 'description', 'instructions', 'primary_muscle', 'secondary_muscles', 'pattern', 'equipment', 'level', 'tracking_type', 'media_url', 'icon_url', 'anatomy_diagram_url'],
      sets: ['fact_workout_sets', 'id', 'user_id', 'routine_id', 'exercise_id', 'training_id', 'exercise_order', 'set_number', 'reps', 'weight', 'duration_seconds', 'distance_meters', 'rpe', 'created_at'],
    }
    for (const [id, fields] of Object.entries(expected)) {
      const node = diagram.nodes.find(node => node.id === id)
      expect(node.label.join(', ').split(', ')).toEqual(fields)
    }
    expect(diagram.edges.map(({ from, to }) => [from, to])).toEqual([
      ['users', 'routines'], ['routines', 'sets'], ['users', 'sets'], ['exercises', 'sets'],
    ])
    expect(diagram.edges.every(edge => edge.label.startsWith('1:N'))).toBe(true)
  })

  it('includes all ten API endpoints, request constraints and transport errors', () => {
    const backend = sections()['8']
    const endpoints = backend[2].nodes.flatMap(node => node.label).filter(line => /^(GET|POST|PUT) /.test(line))
    expect(endpoints).toEqual([
      'GET /health', 'POST /{id}/routine/save', 'POST /{id}/chat', 'POST /{id}/key',
      'GET /users', 'POST /users', 'GET /users/{user_id}/routine', 'PUT /users/{user_id}/routine',
      'POST /users/{user_id}/workouts', 'GET /users/{user_id}/days',
    ])
    expect(text(backend)).toContain('client_saves_routine=false')
    expect(text(backend)).toContain('Accept: application/x-ndjson')
    expect(text(backend)).toContain('IDs are not authentication')
    expect(text(backend)).toContain('X-Routine-Id')
    expect(text(backend)).toContain('RPE 1–10')
    expect(text(backend)).toContain('Stream execution errors are in-band after 200')
    expect(text(backend)).toContain('/openapi.json')
  })

  it('separates process memory, SQL persistence, runtime permissions and deployment approval', () => {
    const content = sections()
    const memory = text(content['6.5'])
    expect(memory).toContain('retrieval limit, not a cap on stored turns')
    expect(memory).toContain('session_id + user_id')
    expect(memory).toContain('user_id does not filter conversation retrieval')
    expect(memory).toContain('No persistent Redis service or long-term conversational memory')
    expect(text(content['7'])).toContain('null legacy template sets are excluded')
    expect(text(content['7'])).toContain('SQL stores references, not bytes')
    expect(text(content['9'])).toContain('client_saves_routine=true')
    expect(text(content['9'])).toContain('Selectable profiles are not password-protected accounts')
    const cloud = content['10'][2]
    expect(cloud.edges).toContainEqual(expect.objectContaining({ from: 'delivery', to: 'state' }))
    expect(cloud.edges.some(edge => edge.from === 'cloudrun' && edge.to === 'state')).toBe(false)
    expect(text(content['10'])).toContain('0–1 instance, 1 vCPU')
    expect(text(content['10'])).toContain('512 MiB')
    expect(text(content['10'])).toContain('External Redis wiring is not provisioned')
    expect(text(content['10'])).toContain('No VPC, subnet, connector, private database route or CloudFront')
    expect(text(content['11'])).toContain('Only a merged dev-to-main PR')
    expect(text(content['11'])).toContain('required reviewers must be configured')
    expect(text(content['11'])).toContain('applies that saved plan')
    expect(content['11'][2].edges.filter(edge => edge.from === 'approval').map(edge => edge.label))
      .toEqual(['Rejected', 'Approved / no rule'])
  })

  it.each(['en', 'es'])('renders the branded technical deck with all diagrams and unique accessible IDs (%s)', async (language) => {
    vi.resetModules()
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    window.history.replaceState(null, '', `/?lang=${language}`)
    document.body.innerHTML = '<main class="reveal"><div class="slides"></div></main>'
    document.body.dataset.project = '2-orchestratordata'
    document.body.dataset.audience = 'technical'
    await import('../../../features/docs/presentation.js')
    const { default: Reveal } = await import('reveal.js')
    const content = getPresentationContent('2-orchestratordata', 'technical', language)
    expect(document.documentElement.lang).toBe(language)
    expect(document.querySelector('h1').textContent).toBe(content.project.title)
    expect(document.title).toBe(`${content.project.title} | ${content.audience}`)
    expect(document.body).toHaveClass('schematic-deck')
    expect(document.querySelectorAll('.slides > section')).toHaveLength(15)
    expect(document.querySelectorAll('.technical-diagram svg')).toHaveLength(14)
    expect(document.querySelectorAll('.prompt-card')).toHaveLength(42)
    expect([...document.querySelectorAll('[data-readme-section]')].map(node => node.dataset.readmeSection)).toEqual(sectionIds)
    expect(document.querySelector('.brand img').getAttribute('src')).toBeTruthy()
    expect(document.body.textContent).not.toMatch(/readme/i)
    for (const [title, notes, diagram] of content.slides) {
      expect(document.body.textContent).toContain(title)
      for (const [heading, body] of notes) {
        expect(document.body.textContent).toContain(heading)
        expect(document.body.textContent).toContain(body)
      }
      const svg = document.querySelector(`[data-readme-section="${diagram.section}"] svg`)
      expect(document.getElementById(svg.getAttribute('aria-labelledby')).textContent).toBe(diagram.caption)
      expect(document.getElementById(svg.getAttribute('aria-describedby')).textContent).toBeTruthy()
    }
    const ids = [...document.querySelectorAll('[id]')].map(node => node.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect([...document.querySelectorAll('.eyebrow')].every(node => node.textContent === content.audience)).toBe(true)
    expect(Reveal).toHaveBeenCalledWith(document.querySelector('.reveal'), expect.objectContaining({
      controls: true, keyboard: true, touch: true, hash: true, transition: 'none',
    }))
    expect(Reveal.mock.results[0].value.initialize).toHaveBeenCalledOnce()
  })
})
