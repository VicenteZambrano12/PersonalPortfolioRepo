const SVG_NS = 'http://www.w3.org/2000/svg'

function svgElement(tag, attributes, text) {
  const node = document.createElementNS(SVG_NS, tag)
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value)
  if (text) node.textContent = text
  return node
}

function port(node, side) {
  const { x, y, width, height } = node
  return {
    left: [x, y + height / 2],
    right: [x + width, y + height / 2],
    top: [x + width / 2, y],
    bottom: [x + width / 2, y + height],
  }[side]
}

export function renderDiagram(diagram, hint) {
  const figure = document.createElement('figure')
  figure.className = 'technical-diagram'
  const viewport = document.createElement('div')
  viewport.className = 'diagram-viewport'
  viewport.tabIndex = 0
  viewport.setAttribute('role', 'region')
  viewport.setAttribute('aria-label', diagram.caption)
  const svg = svgElement('svg', {
    viewBox: `0 0 ${diagram.width} ${diagram.height}`,
    role: 'img',
    'aria-labelledby': `diagram-title-${diagram.section}`,
    'aria-describedby': `diagram-description-${diagram.section}`,
  })
  const description = diagram.edges.map(({ from, to, bidirectional }) => {
    const source = diagram.nodes.find(node => node.id === from)
    const target = diagram.nodes.find(node => node.id === to)
    return `${source.label.join(' ')} ${bidirectional ? '<->' : '->'} ${target.label.join(' ')}`
  }).join('. ')
  svg.append(
    svgElement('title', { id: `diagram-title-${diagram.section}` }, diagram.caption),
    svgElement('desc', { id: `diagram-description-${diagram.section}` }, description),
  )
  const defs = svgElement('defs', {})
  const markerId = `arrow-${diagram.section}`
  const marker = svgElement('marker', {
    id: markerId, viewBox: '0 0 10 10', refX: 9, refY: 5,
    markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse',
  })
  marker.append(svgElement('path', { d: 'M 0 0 L 10 5 L 0 10 z', class: 'diagram-arrow' }))
  defs.append(marker)
  svg.append(defs)
  for (const edge of diagram.edges) {
    const from = diagram.nodes.find(node => node.id === edge.from)
    const to = diagram.nodes.find(node => node.id === edge.to)
    const horizontal = from.x !== to.x
    const fromSide = edge.fromSide ?? (horizontal ? (from.x < to.x ? 'right' : 'left') : 'bottom')
    const toSide = edge.toSide ?? (horizontal ? (from.x < to.x ? 'left' : 'right') : 'top')
    const start = port(from, fromSide)
    const end = port(to, toSide)
    const via = edge.via ?? (['left', 'right'].includes(fromSide)
      ? [[(start[0] + end[0]) / 2, start[1]], [(start[0] + end[0]) / 2, end[1]]]
      : [[start[0], (start[1] + end[1]) / 2], [end[0], (start[1] + end[1]) / 2]])
    svg.append(svgElement('polyline', {
      points: [start, ...via, end].map(point => point.join(',')).join(' '),
      class: 'diagram-edge',
      'marker-end': `url(#${markerId})`,
      ...(edge.bidirectional ? { 'marker-start': `url(#${markerId})` } : {}),
    }))
    if (edge.label) {
      const middle = via[Math.floor(via.length / 2)] ?? start
      svg.append(svgElement('text', {
        x: middle[0], y: middle[1] - 9, class: 'diagram-edge-label', 'text-anchor': 'middle',
      }, edge.label))
    }
  }
  for (const node of diagram.nodes) {
    const group = svgElement('g', { class: `diagram-node diagram-${node.kind}` })
    if (node.kind === 'decision') {
      group.append(svgElement('polygon', {
        points: `${node.x},${node.y + node.height / 2} ${node.x + 24},${node.y} ${node.x + node.width - 24},${node.y} ${node.x + node.width},${node.y + node.height / 2} ${node.x + node.width - 24},${node.y + node.height} ${node.x + 24},${node.y + node.height}`,
      }))
    } else {
      group.append(svgElement('rect', {
        x: node.x, y: node.y, width: node.width, height: node.height,
        rx: node.kind === 'store' ? 20 : 10,
      }))
    }
    node.label.forEach((line, index) => {
      group.append(svgElement('text', {
        x: node.x + node.width / 2,
        y: node.y + node.height / 2 + (index - (node.label.length - 1) / 2) * 24,
        'text-anchor': 'middle', 'dominant-baseline': 'central',
      }, line))
    })
    svg.append(group)
  }
  viewport.append(svg)
  const caption = document.createElement('figcaption')
  caption.textContent = diagram.caption
  const scrollHint = document.createElement('span')
  scrollHint.className = 'diagram-scroll-hint'
  scrollHint.textContent = hint
  caption.append(scrollHint)
  figure.append(viewport, caption)
  return figure
}
