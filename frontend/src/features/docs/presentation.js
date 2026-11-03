import Reveal from 'reveal.js'
import 'reveal.js/dist/reveal.css'
import './presentation.css'
import { brandPalettes } from '../../utils/colors.jsx'
import { createLogger } from '../../utils/logger.js'
import { getPresentationContent } from './content.js'
import { renderDiagram } from './diagram.js'
import { renderIcon } from './icons.js'

const log = createLogger('presentation')
const root = document.querySelector('.reveal')
const { project: slug, audience } = document.body.dataset
const content = getPresentationContent(slug, audience, new URLSearchParams(location.search).get('lang'))
const { project, labels } = content
if (content.slides.some(([, , diagram]) => diagram)) document.body.classList.add('schematic-deck')
const embedded = window.parent !== window
const notifyParent = (type) => {
  if (embedded) window.parent.postMessage({ type }, window.location.origin)
}
if (embedded) {
  document.body.classList.add('embedded')
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.stopImmediatePropagation()
      notifyParent('presentation-close')
    }
  }, true)
}

document.documentElement.lang = content.language
document.title = `${project.title} | ${content.audience}`
const requestedTheme = new URLSearchParams(location.search).get('theme')
let storedTheme
try {
  storedTheme = localStorage.getItem('portfolio-theme')
} catch (error) {
  log.warn('Unable to read theme preference', { message: error.message })
}
const isTheme = (value) => value === 'light' || value === 'dark'
const theme = isTheme(requestedTheme) ? requestedTheme
  : isTheme(storedTheme) ? storedTheme
    : matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
document.documentElement.dataset.theme = theme
for (const [name, value] of Object.entries(brandPalettes[theme])) {
  document.documentElement.style.setProperty(`--${name}`, value)
}

function element(tag, text, className) {
  const node = document.createElement(tag)
  if (text) node.textContent = text
  if (className) node.className = className
  return node
}

const DENSE_NOTE_LENGTH = 180

// Decorative device frames that wrap some slide layouts.
const FRAMES = { browser: 'mock-window', terminal: 'mock-window mock-terminal', phone: 'mock-phone' }

function frame(layout, content) {
  const wrapper = element('div', null, FRAMES[layout])
  if (layout === 'phone') {
    wrapper.append(element('div', null, 'phone-notch'))
  } else {
    const bar = element('div', null, 'window-bar')
    for (let i = 0; i < 3; i += 1) bar.append(element('span', null, 'window-dot'))
    if (layout === 'browser') {
      const url = element('span', null, 'window-url')
      url.append(renderIcon('lock', 'url-icon'))
      bar.append(url)
    }
    wrapper.append(bar)
  }
  wrapper.append(content)
  return wrapper
}

const header = element('header', null, 'deck-header')
const brand = element('a', null, 'brand')
brand.href = '/'
brand.setAttribute('aria-label', labels.back)
const image = element('img')
image.src = '/logo.png'
image.alt = 'Portfolio logo'
brand.append(image, element('span', 'Vicente Zambrano Andrada'))
const back = element('a', labels.back)
back.href = '/'
header.append(brand)
if (!embedded) header.append(back)
if (embedded) {
  brand.removeAttribute('href')
  brand.removeAttribute('aria-label')
}
document.body.prepend(header)

const slides = root.querySelector('.slides')
const eyebrow = content.isTemplate ? labels.template : content.audience
const cover = element('section', null, 'cover')
cover.append(
  element('p', eyebrow, 'eyebrow'),
  element('h1', project.title),
  element('p', content.audience, 'audience'),
  element('p', project.subtitle, 'subtitle'),
  ...(!embedded ? [element('p', labels.hint, 'hint')] : []),
)
slides.append(cover)

if (content.showOverview) {
  const overview = element('section')
  overview.append(
    element('p', content.audience, 'eyebrow'),
    element('h2', labels.overview),
    element('p', project.fullDescription, 'description'),
  )
  if (audience === 'technical') {
    overview.append(element('h3', labels.stack))
    const tags = element('ul', null, 'tags')
    for (const tag of project.modalTags) tags.append(element('li', tag))
    overview.append(tags)
  }
  slides.append(overview)
}

for (const [title, prompts, diagram, visual] of content.slides) {
  const slide = element('section', null, diagram ? 'schematic-slide' : undefined)
  if (diagram) slide.dataset.readmeSection = diagram.section
  // Long technical notes get a tighter type scale so they fit below the diagram.
  if (diagram && Math.max(...prompts.map(([, text]) => text.length)) > DENSE_NOTE_LENGTH) slide.classList.add('dense-notes')
  slide.append(element('p', eyebrow, 'eyebrow'), element('h2', title))
  if (diagram) slide.append(renderDiagram(diagram, labels.diagramHint))
  const layout = visual?.layout
  const gridClass = diagram ? 'prompt-grid schematic-facts' : layout ? `prompt-grid layout-${layout}` : 'prompt-grid'
  const grid = element('div', null, gridClass)
  prompts.forEach(([heading, prompt, icon], index) => {
    const card = element('article', null, 'prompt-card')
    if (icon) {
      const badge = element('div', null, 'card-icon')
      badge.append(renderIcon(icon))
      if (layout === 'steps') badge.append(element('span', String(index + 1), 'step-number'))
      card.append(badge)
    }
    const body = element('div', null, 'card-body')
    body.append(element('h3', heading), element('p', prompt))
    card.append(body)
    grid.append(card)
    if (layout === 'steps' && index < prompts.length - 1) {
      const connector = element('div', null, 'step-connector')
      connector.append(renderIcon('arrow'))
      grid.append(connector)
    }
  })
  let content = grid
  if (visual?.icon) {
    const hero = element('div', null, 'hero-icon')
    hero.append(renderIcon(visual.icon))
    if (layout === 'hub') {
      grid.insertBefore(hero, grid.children[1])
    } else {
      content = element('div', null, `visual-wrap visual-${layout}`)
      content.append(hero, grid)
    }
  }
  if (FRAMES[layout]) content = frame(layout, content)
  slide.append(content)
  slides.append(slide)
}

const status = element('p', null, 'deck-status')
status.setAttribute('role', 'status')
document.body.append(status)
const deck = new Reveal(root, {
  embedded: true,
  hash: true,
  controls: true,
  controlsTutorial: false,
  progress: true,
  slideNumber: 'c/t',
  scrollActivationWidth: null,
  touch: true,
  keyboard: true,
  width: 1200,
  height: 780,
  margin: 0.06,
  minScale: 0.2,
  maxScale: 1,
  transition: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'none' : 'slide',
})
deck.initialize().then(() => {
  notifyParent('presentation-ready')
}).catch((error) => {
  log.error('Slide initialization failed', { message: error.message, slug, audience })
  status.setAttribute('role', 'alert')
  status.textContent = labels.error
  notifyParent('presentation-error')
})
