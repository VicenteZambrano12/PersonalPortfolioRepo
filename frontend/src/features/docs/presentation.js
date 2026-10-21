import Reveal from 'reveal.js'
import 'reveal.js/dist/reveal.css'
import './presentation.css'
import { brandPalettes } from '../../utils/colors.jsx'
import { createLogger } from '../../utils/logger.js'
import { getPresentationContent } from './content.js'
import { renderDiagram } from './diagram.js'

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
for (const [name, value] of Object.entries(brandPalettes.dark)) {
  document.documentElement.style.setProperty(`--${name}`, value)
}

function element(tag, text, className) {
  const node = document.createElement(tag)
  if (text) node.textContent = text
  if (className) node.className = className
  return node
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
if (!content.showOverview && content.source) cover.append(element('p', content.source, 'hint'))
slides.append(cover)

if (content.showOverview) {
  const overview = element('section')
  overview.append(
    element('p', content.audience, 'eyebrow'),
    element('h2', labels.overview),
    element('p', project.fullDescription, 'description'),
  )
  if (content.source) overview.append(element('p', content.source, 'hint'))
  if (audience === 'technical') {
    overview.append(element('h3', labels.stack))
    const tags = element('ul', null, 'tags')
    for (const tag of project.modalTags) tags.append(element('li', tag))
    overview.append(tags)
  }
  slides.append(overview)
}

for (const [title, prompts, diagram] of content.slides) {
  const slide = element('section', null, diagram ? 'schematic-slide' : undefined)
  if (diagram) slide.dataset.readmeSection = diagram.section
  slide.append(element('p', eyebrow, 'eyebrow'), element('h2', title))
  if (diagram) slide.append(renderDiagram(diagram, labels.diagramHint))
  const grid = element('div', null, diagram ? 'prompt-grid schematic-facts' : 'prompt-grid')
  for (const [heading, prompt] of prompts) {
    const card = element('article', null, 'prompt-card')
    card.append(element('h3', heading), element('p', prompt))
    grid.append(card)
  }
  slide.append(grid)
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
