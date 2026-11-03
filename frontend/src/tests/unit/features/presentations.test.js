import { afterEach, describe, expect, it, vi } from 'vitest'
import { getPresentationContent } from '../../../features/docs/content.js'
import { renderDiagram } from '../../../features/docs/diagram.js'
import { LOGOS, logoMarkup } from '../../../features/docs/logos.js'
import { brandPalettes } from '../../../utils/colors.jsx'

const pages = import.meta.glob('../../../features/docs/*/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
})

it.each(['en', 'es'])('fills Personal Portfolio technical slides from README sections 1–7 (%s)', (language) => {
  const content = getPresentationContent('0-portfolio', 'technical', language)
  const text = JSON.stringify(content)
  expect(content.isTemplate).toBe(false)
  expect(content.showOverview).toBe(false)
  expect(content.source).toContain(language === 'en' ? 'Sections 1–7' : 'Secciones 1–7')
  expect(content.slides.map(([title]) => title)).toEqual(language === 'en'
    ? [
        '1. Business overview, use case and value',
        '2. Repo structure',
        '3. Tech stack',
        '4. Frontend',
        '5. Authorization',
        '6. Cloud infrastructure',
        '7. Infrastructure as code and versioning',
      ]
    : [
        '1. Resumen de negocio, caso de uso y valor',
        '2. Estructura del repositorio',
        '3. Stack tecnológico',
        '4. Frontend',
        '5. Autorización',
        '6. Infraestructura cloud',
        '7. Infraestructura como código y versionado',
      ])
  for (const [index, [, notes, diagram]] of content.slides.entries()) {
    expect(notes).toHaveLength(3)
    expect(diagram.section).toBe(index + 1)
    expect(diagram.nodes.length).toBeGreaterThanOrEqual(5)
    const ids = diagram.nodes.map(({ id }) => id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const diagramNode of diagram.nodes) {
      expect(diagramNode.label.length).toBeGreaterThan(0)
      expect(diagramNode.x + diagramNode.width).toBeLessThanOrEqual(diagram.width)
      expect(diagramNode.y + diagramNode.height).toBeLessThanOrEqual(diagram.height)
    }
    for (const edge of diagram.edges) {
      expect(ids).toContain(edge.from)
      expect(ids).toContain(edge.to)
    }
  }
  expect(text).toContain('Firebase Authentication')
  expect(text).toContain('HTTP-only')
  expect(text).toContain('Direct VPC egress')
  expect(getPresentationContent('0-portfolio', 'business', language).isTemplate).toBe(false)
})

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

it.each(['en', 'es'])('renders all seven portfolio technical sections (%s)', async (language) => {
  vi.resetModules()
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
  window.history.replaceState(null, '', `/?lang=${language}`)
  document.body.innerHTML = '<main class="reveal"><div class="slides"></div></main>'
  document.body.dataset.project = '0-portfolio'
  document.body.dataset.audience = 'technical'
  await import('../../../features/docs/presentation.js')
  const content = getPresentationContent('0-portfolio', 'technical', language)
  expect(document.documentElement.lang).toBe(language)
  expect(document.querySelector('h1').textContent).toBe('Personal Portfolio')
  expect(document.querySelectorAll('.slides > section')).toHaveLength(8)
  expect(document.querySelectorAll('.diagram-viewport > svg')).toHaveLength(7)
  expect(document.querySelectorAll('.prompt-card')).toHaveLength(21)
  expect([...document.querySelectorAll('[data-readme-section]')].map(node => node.dataset.readmeSection))
    .toEqual(['1', '2', '3', '4', '5', '6', '7'])
  expect(document.body).toHaveClass('schematic-deck')
  expect([...document.querySelectorAll('.eyebrow')].every(node => node.textContent === content.audience)).toBe(true)
  for (const [title, cards] of content.slides) {
    expect(document.body.textContent).toContain(title)
    for (const [heading, text] of cards) {
      expect(document.body.textContent).toContain(heading)
      expect(document.body.textContent).toContain(text)
    }
  }
})

describe('presentation templates', () => {
  it.each(['light', 'dark'])('uses the explicit %s theme over the saved preference', async (theme) => {
    vi.resetModules()
    localStorage.setItem('portfolio-theme', theme === 'dark' ? 'light' : 'dark')
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    window.history.replaceState(null, '', `/?lang=en&theme=${theme}`)
    document.body.innerHTML = '<main class="reveal"><div class="slides"></div></main>'
    document.body.dataset.project = '0-portfolio'
    document.body.dataset.audience = 'business'
    await import('../../../features/docs/presentation.js')
    expect(document.documentElement.dataset.theme).toBe(theme)
    for (const [key, value] of Object.entries(brandPalettes[theme])) {
      expect(document.documentElement.style.getPropertyValue(`--${key}`)).toBe(value)
    }
    localStorage.removeItem('portfolio-theme')
  })

  it('provides exactly eight HTML pages, with no YouTube presentation', () => {
    expect(Object.keys(pages)).toHaveLength(8)
    for (const slug of ['0-portfolio', '1-pauhelper', '2-orchestratordata', '3-voicesimulator']) {
      for (const audience of ['business', 'technical']) {
        const html = pages[`../../../features/docs/${slug}/${audience}.html`]
        expect(html).toContain(`data-project="${slug}" data-audience="${audience}"`)
        expect(html).toContain('name="viewport"')
        expect(html).toContain('src="../presentation.js"')
        for (const language of ['en', 'es']) {
          const content = getPresentationContent(slug, audience, language)
          expect(content.language).toBe(language)
          expect(content.project.title).toBeTruthy()
          expect(content.project.fullDescription).toBeTruthy()
          const slideCount = slug === '1-pauhelper'
            ? (audience === 'business' ? 6 : 9)
            : slug === '2-orchestratordata' ? (audience === 'business' ? 6 : 14)
              : slug === '3-voicesimulator'
                ? (audience === 'business' ? 6 : 10)
                : slug === '0-portfolio' ? (audience === 'business' ? 6 : 7) : 3
          expect(content.slides).toHaveLength(slideCount)
          expect(content.slides.every(([, prompts]) => prompts.length === 3)).toBe(true)
        }
      }
    }
  })

  it.each(['en', 'es'])('fills Personal Portfolio business slides from the README (%s)', (language) => {
    const content = getPresentationContent('0-portfolio', 'business', language)
    const text = JSON.stringify(content)
    expect(content.isTemplate).toBe(false)
    expect(content.source).toContain('PersonalPortfolioRepo')
    expect(content.slides).toHaveLength(6)
    expect(text).toContain(language === 'en' ? 'hiring teams' : 'equipos de selección')
    expect(text).toContain(language === 'en' ? 'public self-registration is disabled' : 'registro público está deshabilitado')
    expect(text).toContain(language === 'en' ? 'low-cost foundation' : 'base de bajo coste')
    expect(getPresentationContent('0-portfolio', 'technical', language).isTemplate).toBe(false)
  })

  it.each(['en', 'es'])('renders the complete Personal Portfolio business presentation (%s)', async (language) => {
    vi.resetModules()
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    window.history.replaceState(null, '', `/?lang=${language}`)
    document.body.innerHTML = '<main class="reveal"><div class="slides"></div></main>'
    document.body.dataset.project = '0-portfolio'
    document.body.dataset.audience = 'business'
    await import('../../../features/docs/presentation.js')
    const content = getPresentationContent('0-portfolio', 'business', language)
    expect(document.documentElement.lang).toBe(language)
    expect(document.querySelectorAll('.slides > section')).toHaveLength(8)
    expect(document.querySelectorAll('.prompt-card')).toHaveLength(18)
    expect(document.body.textContent).not.toContain('Plantilla de presentación')
    for (const [title, cards] of content.slides) {
      expect(document.body.textContent).toContain(title)
      for (const [heading, text] of cards) {
        expect(document.body.textContent).toContain(heading)
        expect(document.body.textContent).toContain(text)
      }
    }
  })

  it.each(['en', 'es'])('fills PAUHelper business slides from the README (%s)', (language) => {
    const content = getPresentationContent('1-pauhelper', 'business', language)
    const text = JSON.stringify(content)
    expect(content.isTemplate).toBe(false)
    expect(content.source).toContain('BasicRAGapp')
    expect(content.project.fullDescription).toContain('EBAU')
    expect(content.project.fullDescription).toContain('Android')
    expect(content.project.fullDescription).toContain('React')
    expect(text).toContain(language === 'en' ? 'autonomous community' : 'comunidad autónoma')
    expect(content.slides[2][1][2][1]).toContain(language === 'en' ? 'do not guarantee correctness' : 'no garantizan la exactitud')
    expect(content.slides[4][0]).toContain(language === 'en' ? 'not current features' : 'no funciones actuales')
    expect(content.slides[4][1][2][1]).toContain(language === 'en' ? 'not implemented' : 'no están implementadas')
    expect(content.slides[5][1][2][1]).toContain(language === 'en' ? 'access controls and document governance' : 'controles de acceso y gobierno documental')
    expect(getPresentationContent('3-voicesimulator', 'business', language).isTemplate).toBe(false)
    expect(getPresentationContent('1-pauhelper', 'technical', language).isTemplate).toBe(false)
  })

  it.each(['en', 'es'])('fills Orchestrator business slides from the README using the PAUHelper layout (%s)', (language) => {
    const content = getPresentationContent('2-orchestratordata', 'business', language)
    expect(content.isTemplate).toBe(false)
    expect(content.showOverview).toBe(true)
    expect(content.source).toContain('Orchestrator App')
    expect(content.project.fullDescription).toContain('SQL')
    expect(content.slides).toHaveLength(6)
    expect(content.slides.every(([, cards]) => cards.length === 3)).toBe(true)
    expect(content.slides[0][0]).toContain('Form')
    expect(content.slides[1][1].map(([heading]) => heading)).toEqual(language === 'en'
      ? ['Explain an exercise', 'Create a workout routine', "Show the user's progress"]
      : ['Explicar un ejercicio', 'Crear una rutina de entrenamiento', 'Mostrar el progreso del usuario'])
    expect(content.slides[2][1][2][1]).toContain(language === 'en'
      ? 'Rather than generating arbitrary SQL, agents supply parameters to predefined SELECT queries'
      : 'En lugar de generar SQL arbitrario, los agentes proporcionan parámetros a consultas SELECT predefinidas')
    expect(content.slides[3][1].map(([heading]) => heading)).toEqual(language === 'en'
      ? ['Focused AI assistance', 'Intent-based routing', 'Controlled data retrieval']
      : ['Asistencia de IA centrada', 'Enrutamiento basado en la intención', 'Recuperación controlada de datos'])
    expect(content.slides[4][1][0][1]).toContain('Routines')
    expect(content.slides[4][1][1][0]).toBe(language === 'en' ? 'Structured data presentation' : 'Presentación estructurada de datos')
    expect(content.slides[4][1][2][0]).toBe(language === 'en' ? 'Access to unstructured resources' : 'Acceso a recursos no estructurados')
    expect(content.slides[5][1][1][0]).toBe(language === 'en' ? 'Extensibility and observability' : 'Extensibilidad y observabilidad')
    expect(content.slides[5][1][2][0]).toContain('(IaC)')
    expect(getPresentationContent('2-orchestratordata', 'technical', language).isTemplate).toBe(false)
  })

  it.each(['en', 'es'])('fills the Plinius business presentation from its README (%s)', (language) => {
    const content = getPresentationContent('3-voicesimulator', 'business', language)
    const text = JSON.stringify(content)
    expect(content.isTemplate).toBe(false)
    expect(content.source).toContain(language === 'en' ? 'Plinius README' : 'README de Plinius')
    expect(content.project.title).toBe('Plinius')
    expect(content.slides).toHaveLength(6)
    expect(content.slides.every(([, cards]) => cards.length === 3)).toBe(true)
    expect(text).toContain(language === 'en' ? 'historic sites' : 'lugares históricos')
    expect(text).toContain(language === 'en' ? 'selected stop' : 'parada seleccionada')
    expect(text).toContain(language === 'en' ? 'sources behind each answer' : 'fuentes de cada respuesta')
    expect(text).toContain(language === 'en' ? 'audio-to-audio' : 'audio a audio')
    expect(getPresentationContent('3-voicesimulator', 'technical', language).isTemplate).toBe(false)
  })

  it.each(['en', 'es'])('renders the complete Orchestrator business presentation (%s)', async (language) => {
    vi.resetModules()
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    window.history.replaceState(null, '', `/?lang=${language}`)
    document.body.innerHTML = '<main class="reveal"><div class="slides"></div></main>'
    document.body.dataset.project = '2-orchestratordata'
    document.body.dataset.audience = 'business'
    await import('../../../features/docs/presentation.js')
    const { default: Reveal } = await import('reveal.js')
    const content = getPresentationContent('2-orchestratordata', 'business', language)
    expect(document.documentElement.lang).toBe(language)
    expect(document.querySelector('h1').textContent).toBe(content.project.title)
    expect(document.querySelectorAll('.slides > section')).toHaveLength(8)
    expect(document.querySelectorAll('.prompt-card')).toHaveLength(18)
    expect(document.querySelector('.brand img').getAttribute('src')).toBeTruthy()
    expect(document.body.textContent).not.toMatch(/readme/i)
    for (const [title, cards] of content.slides) {
      expect(document.body.textContent).toContain(title)
      for (const [heading, text] of cards) {
        expect(document.body.textContent).toContain(heading)
        expect(document.body.textContent).toContain(text)
      }
    }
    expect([...document.querySelectorAll('.eyebrow')].every(node => node.textContent === content.audience)).toBe(true)
    expect(Reveal.mock.results[0].value.initialize).toHaveBeenCalledOnce()
  })

  it.each(['en', 'es'])('renders the complete Plinius business presentation (%s)', async (language) => {
    vi.resetModules()
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    window.history.replaceState(null, '', `/?lang=${language}`)
    document.body.innerHTML = '<main class="reveal"><div class="slides"></div></main>'
    document.body.dataset.project = '3-voicesimulator'
    document.body.dataset.audience = 'business'
    await import('../../../features/docs/presentation.js')
    const content = getPresentationContent('3-voicesimulator', 'business', language)
    expect(document.documentElement.lang).toBe(language)
    expect(document.querySelector('h1').textContent).toBe('Plinius')
    expect(document.querySelectorAll('.slides > section')).toHaveLength(8)
    expect(document.querySelectorAll('.prompt-card')).toHaveLength(18)
    for (const [title, cards] of content.slides) {
      expect(document.body.textContent).toContain(title)
      for (const [heading, text] of cards) {
        expect(document.body.textContent).toContain(heading)
        expect(document.body.textContent).toContain(text)
      }
    }
    expect([...document.querySelectorAll('.eyebrow')].every(node => node.textContent === content.audience)).toBe(true)
  })

  it.each(['en', 'es'])('renders all ten Plinius technical sections (%s)', async (language) => {
    vi.resetModules()
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    window.history.replaceState(null, '', `/?lang=${language}`)
    document.body.innerHTML = '<main class="reveal"><div class="slides"></div></main>'
    document.body.dataset.project = '3-voicesimulator'
    document.body.dataset.audience = 'technical'
    await import('../../../features/docs/presentation.js')
    const content = getPresentationContent('3-voicesimulator', 'technical', language)
    expect(document.documentElement.lang).toBe(language)
    expect(document.querySelector('h1').textContent).toBe('Plinius')
    expect(document.querySelectorAll('.slides > section')).toHaveLength(11)
    expect(document.querySelectorAll('.technical-diagram svg')).toHaveLength(10)
    expect(document.querySelectorAll('.prompt-card')).toHaveLength(30)
    expect([...document.querySelectorAll('[data-readme-section]')].map(node => node.dataset.readmeSection))
      .toEqual(Array.from({ length: 10 }, (_, index) => String(index + 1)))
    expect(document.body).toHaveClass('schematic-deck')
    expect([...document.querySelectorAll('.eyebrow')].every(node => node.textContent === content.audience)).toBe(true)
    for (const [title, cards] of content.slides) {
      expect(document.body.textContent).toContain(title)
      for (const [heading, text] of cards) {
        expect(document.body.textContent).toContain(heading)
        expect(document.body.textContent).toContain(text)
      }
    }
  })

  it.each(['en', 'es'])('provides one technical diagram per numbered README section (%s)', (language) => {
    const content = getPresentationContent('1-pauhelper', 'technical', language)
    expect(content.showOverview).toBe(false)
    expect(content.isTemplate).toBe(false)
    expect(content.source).toContain('1–9')
    expect(content.slides).toHaveLength(9)
    for (const [index, [title, notes, diagram]] of content.slides.entries()) {
      expect(title).toMatch(new RegExp(`^${index + 1}\\. `))
      expect(notes).toHaveLength(3)
      expect(diagram.section).toBe(index + 1)
      expect(diagram.nodes.length).toBeGreaterThanOrEqual(5)
      const ids = diagram.nodes.map(node => node.id)
      expect(new Set(ids).size).toBe(ids.length)
      for (const node of diagram.nodes) {
        expect(node.label.length).toBeGreaterThan(0)
        expect(node.label.every(line => typeof line === 'string' && line.length > 0)).toBe(true)
        expect(node.x).toBeGreaterThanOrEqual(0)
        expect(node.y).toBeGreaterThanOrEqual(0)
        expect(node.x + node.width).toBeLessThanOrEqual(diagram.width)
        expect(node.y + node.height).toBeLessThanOrEqual(diagram.height)
      }
      for (const edge of diagram.edges) {
        expect(ids).toContain(edge.from)
        expect(ids).toContain(edge.to)
      }
      const figure = renderDiagram(diagram, content.labels.diagramHint)
      const svg = figure.querySelector('svg')
      expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg')
      expect(svg).toHaveAttribute('role', 'img')
      expect(svg.querySelector('title').textContent).toBe(diagram.caption)
      expect(svg.querySelector('desc').textContent).toBeTruthy()
      expect(figure.querySelectorAll('.diagram-node')).toHaveLength(diagram.nodes.length)
      expect(figure.querySelectorAll('.diagram-edge')).toHaveLength(diagram.edges.length)
      expect(figure.querySelector('.diagram-viewport')).toHaveAttribute('tabindex', '0')
    }
  })

  it.each(['en', 'es'])('builds the Personal Portfolio technical deck from README sections 1–7 with every technology logo (%s)', (language) => {
    const content = getPresentationContent('0-portfolio', 'technical', language)
    expect(content.isTemplate).toBe(false)
    expect(content.showOverview).toBe(false)
    expect(content.source).toContain('1–7')
    expect(content.slides).toHaveLength(7)
    const icons = new Set()
    for (const [index, [title, notes, diagram]] of content.slides.entries()) {
      expect(title).toMatch(new RegExp(`^${index + 1}\\. `))
      expect(notes).toHaveLength(3)
      expect(diagram.section).toBe(index + 1)
      const ids = diagram.nodes.map(node => node.id)
      expect(new Set(ids).size).toBe(ids.length)
      for (const node of diagram.nodes) {
        expect(node.label.every(line => typeof line === 'string' && line.length > 0)).toBe(true)
        expect(node.x + node.width).toBeLessThanOrEqual(diagram.width)
        expect(node.y + node.height).toBeLessThanOrEqual(diagram.height)
        for (const icon of [node.icon ?? []].flat()) icons.add(icon)
      }
      for (const edge of diagram.edges) {
        expect(ids).toContain(edge.from)
        expect(ids).toContain(edge.to)
      }
      const figure = renderDiagram(diagram, content.labels.diagramHint)
      expect(figure.querySelectorAll('.diagram-node')).toHaveLength(diagram.nodes.length)
      expect(figure.querySelectorAll('.diagram-logo')).toHaveLength(diagram.nodes.flatMap(node => [node.icon ?? []].flat()).length)
    }
    expect([...icons]).toEqual(expect.arrayContaining(['react', 'vite', 'tailwind', 'reveal', 'node', 'express', 'firebase', 'identityPlatform', 'docker', 'nginx', 'terraform', 'githubActions', 'github', 'cloudRun', 'artifactRegistry', 'secretManager', 'vpc']))
    const text = JSON.stringify(content)
    expect(text).toContain('HTTP-only')
    expect(text).toContain('Artifact Registry')
    expect(text).toContain('terraform plan')
  })

  it.each([
    ['1-pauhelper', 'en'], ['1-pauhelper', 'es'], ['2-orchestratordata', 'en'], ['2-orchestratordata', 'es'],
  ])('draws a logo for the technologies in each %s diagram and note (%s)', (slug, language) => {
    const { slides } = getPresentationContent(slug, 'technical', language)
    for (const [, notes, diagram] of slides) {
      expect(notes.every(note => typeof note[2] === 'string')).toBe(true)
      const logos = diagram.nodes.flatMap(node => [node.icon ?? []].flat())
      expect(logos.length).toBeGreaterThan(0)
      expect(logos.every(name => name in LOGOS)).toBe(true)
      expect(renderDiagram(diagram, 'hint').querySelectorAll('.diagram-logo')).toHaveLength(logos.length)
    }
  })

  it('uses every brand logo across the technical decks with unique gradient ids', () => {
    const used = new Set()
    for (const slug of ['0-portfolio', '1-pauhelper', '2-orchestratordata']) {
      for (const [, notes, diagram] of getPresentationContent(slug, 'technical', 'en').slides) {
        for (const node of diagram.nodes) for (const name of [node.icon ?? []].flat()) used.add(name)
        for (const note of notes) if (note[2] in LOGOS) used.add(note[2])
      }
    }
    expect([...used].sort()).toEqual(Object.keys(LOGOS).sort())
    const first = logoMarkup(LOGOS.python)
    const second = logoMarkup(LOGOS.python)
    const ids = markup => [...markup.matchAll(/id="([^"]+)"/g)].map(match => match[1])
    expect(ids(first).length).toBeGreaterThan(0)
    expect(ids(first).some(id => ids(second).includes(id))).toBe(false)
  })

  it.each(['en', 'es'])('fills Plinius technical slides from README sections 1–10 (%s)', (language) => {
    const content = getPresentationContent('3-voicesimulator', 'technical', language)
    expect(content.showOverview).toBe(false)
    expect(content.isTemplate).toBe(false)
    expect(content.source).toContain(language === 'en' ? 'Sections 1–10' : 'Secciones 1–10')
    expect(content.project.title).toBe('Plinius')
    expect(content.slides).toHaveLength(10)
    expect(content.slides.map(([title]) => title)).toEqual(language === 'en'
      ? [
          '1. Overview',
          '2. Use Case and Business Value',
          '3. Prerequisites and Installation Guide',
          '4. Tech Stack',
          '5. Voice Processing',
          '6. RAG Agent',
          '7. FastAPI Endpoints',
          '8. Frontend',
          '9. Google Cloud Platform Deployment',
          '10. Infrastructure as Code with Terraform',
        ]
      : [
          '1. Descripción general',
          '2. Caso de uso y valor de negocio',
          '3. Requisitos y guía de instalación',
          '4. Stack tecnológico',
          '5. Procesamiento de voz',
          '6. Agente RAG',
          '7. Endpoints FastAPI',
          '8. Frontend',
          '9. Despliegue en Google Cloud Platform',
          '10. Infraestructura como código con Terraform',
        ])
    for (const [index, [, notes, diagram]] of content.slides.entries()) {
      expect(notes).toHaveLength(3)
      expect(diagram.section).toBe(index + 1)
      expect(diagram.nodes.length).toBeGreaterThanOrEqual(5)
      const ids = diagram.nodes.map(({ id }) => id)
      expect(new Set(ids).size).toBe(ids.length)
      for (const node of diagram.nodes) {
        expect(node.label.length).toBeGreaterThan(0)
        expect(node.x + node.width).toBeLessThanOrEqual(diagram.width)
        expect(node.y + node.height).toBeLessThanOrEqual(diagram.height)
      }
      for (const edge of diagram.edges) {
        expect(ids).toContain(edge.from)
        expect(ids).toContain(edge.to)
      }
    }

    const text = JSON.stringify(content)
    expect(text).toContain(language === 'en' ? 'ENV selects LOCAL or GCP' : 'ENV selecciona LOCAL o GCP')
    expect(text).toContain(language === 'en' ? 'audio-to-audio' : 'audio a audio')
    expect(text).toContain('Qdrant')
    expect(text).toContain('APP_SECRETS_JSON')
    expect(getPresentationContent('3-voicesimulator', 'business', language).isTemplate).toBe(false)
  })

  it('preserves the README technical constraints and service boundaries', () => {
    const { slides } = getPresentationContent('1-pauhelper', 'technical', 'en')
    expect(slides[3][2].nodes.find(node => node.id === 'retrieve').label).toContain('Embed + top k=4')
    expect(slides[3][1][0][1]).toContain('no dynamic tool selection')
    expect(slides[4][2].nodes.find(node => node.id === 'guide').label[1]).toContain('15 minutes')
    expect(slides[5][1][2][1]).toContain('6 recent turns')
    expect(slides[5][1][2][1]).toContain('6 hours')
    expect(slides[6][2].edges).toContainEqual(expect.objectContaining({ from: 'api', to: 'memory' }))
    expect(slides[6][2].edges).not.toContainEqual(expect.objectContaining({ from: 'ui', to: 'memory' }))
    expect(slides[7][1][1][1]).toContain('1 instance + 1 worker')
    expect(slides[7][1][1][1]).toContain('Redis is not provisioned by Terraform')
    expect(slides[8][1][2][1]).toContain('does not enforce review')
    expect(slides[8][2].edges.filter(edge => edge.from === 'changed').map(edge => edge.label)).toEqual(['Yes', 'No'])
  })

  it('keeps business and technical template topics distinct', () => {
    const business = getPresentationContent('0-portfolio', 'business', 'en')
    const technical = getPresentationContent('0-portfolio', 'technical', 'en')
    expect(business.slides[0][0]).toBe('The challenge: showing skills in practice')
    expect(business.isTemplate).toBe(false)
    expect(technical.slides[0][0]).toBe('1. Business overview, use case and value')
    expect(technical.isTemplate).toBe(false)
    expect(() => getPresentationContent('4-youtube', 'business', 'en')).toThrow('Unknown presentation project')
    expect(() => getPresentationContent('0-portfolio', 'unknown', 'en')).toThrow('Unknown presentation audience')
  })

  it.each([
    ['business', 'en'],
    ['business', 'es'],
    ['technical', 'en'],
    ['technical', 'es'],
  ])('renders a branded, translated %s deck (%s) and initializes navigation', async (audience, language) => {
    vi.resetModules()
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    window.history.replaceState(null, '', `/?lang=${language}`)
    document.body.innerHTML = '<main class="reveal"><div class="slides"></div></main>'
    document.body.dataset.project = '1-pauhelper'
    document.body.dataset.audience = audience
    await import('../../../features/docs/presentation.js')
    const { default: Reveal } = await import('reveal.js')
    expect(document.documentElement.lang).toBe(language)
    expect(document.querySelector('h1').textContent).toBe('PAUHelper')
    expect(document.querySelectorAll('.slides > section')).toHaveLength(audience === 'business' ? 8 : 10)
    expect(document.querySelector('.brand img').getAttribute('src')).toBeTruthy()
    expect(document.querySelectorAll('.prompt-card')).toHaveLength(audience === 'business' ? 18 : 27)
    const eyebrows = [...document.querySelectorAll('.eyebrow')].map(node => node.textContent)
    expect(eyebrows).not.toContain('Plantilla de presentación')
    expect(document.body.textContent).not.toMatch(/readme/i)
    if (audience === 'technical') {
      expect(document.body).toHaveClass('schematic-deck')
      expect(document.querySelectorAll('.diagram-viewport > svg')).toHaveLength(9)
      expect([...document.querySelectorAll('[data-readme-section]')].map(node => node.dataset.readmeSection))
        .toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9'])
    }
    expect(document.querySelectorAll('.tags li')).toHaveLength(0)
    expect(Reveal).toHaveBeenCalledWith(document.querySelector('.reveal'), expect.objectContaining({
      controls: true, keyboard: true, touch: true, hash: true, transition: 'none', scrollActivationWidth: null,
    }))
  })
})
