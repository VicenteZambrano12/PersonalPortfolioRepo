import { afterEach, describe, expect, it, vi } from 'vitest'
import { getPresentationContent } from '../../../features/docs/content.js'
import { renderDiagram } from '../../../features/docs/diagram.js'
import { brandPalettes } from '../../../utils/colors.jsx'

const pages = import.meta.glob('../../../features/docs/*/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
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
            : slug === '2-orchestratordata' ? (audience === 'business' ? 6 : 14) : 3
          expect(content.slides).toHaveLength(slideCount)
          expect(content.slides.every(([, prompts]) => prompts.length === 3)).toBe(true)
        }
      }
    }
  })

  it.each(['en', 'es'])('fills PAUHelper business slides from the README, without changing the other templates (%s)', (language) => {
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
    for (const slug of ['0-portfolio', '3-voicesimulator']) {
      expect(getPresentationContent(slug, 'business', language).isTemplate).toBe(true)
    }
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
    for (const slug of ['0-portfolio', '3-voicesimulator']) {
      expect(getPresentationContent(slug, 'technical', language).isTemplate).toBe(true)
    }
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
    expect(business.slides[0][0]).toBe('Problem & audience')
    expect(technical.slides[0][0]).toBe('Architecture & data flow')
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
      expect(document.querySelectorAll('.technical-diagram svg')).toHaveLength(9)
      expect([...document.querySelectorAll('[data-readme-section]')].map(node => node.dataset.readmeSection))
        .toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9'])
    }
    expect(document.querySelectorAll('.tags li')).toHaveLength(0)
    expect(Reveal).toHaveBeenCalledWith(document.querySelector('.reveal'), expect.objectContaining({
      controls: true, keyboard: true, touch: true, hash: true, transition: 'none', scrollActivationWidth: null,
    }))
  })
})
