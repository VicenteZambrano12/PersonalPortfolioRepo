import { en } from '../../i18n/languages/en.jsx'
import { es } from '../../i18n/languages/es.jsx'
import { projectsData } from '../../lib/projectsData.js'
import { pauhelperBusiness } from './1-pauhelper/business.js'
import { getPauhelperTechnical } from './1-pauhelper/technical.js'
import { orchestratorBusiness } from './2-orchestratordata/business.js'
import { getOrchestratorTechnical } from './2-orchestratordata/technical.js'

const copy = {
  en: {
    business: 'Business presentation',
    technical: 'Technical presentation',
    template: 'Presentation template',
    overview: 'Project at a glance',
    stack: 'Technology foundation',
    diagramHint: 'Scroll the diagram horizontally to inspect each component.',
    back: 'Back to portfolio',
    hint: 'Use the arrows, swipe, or press Space to navigate. Press Esc for an overview.',
    error: 'The slide controls could not load. Reload the page to try again.',
    businessSlides: [
      ['Problem & audience', [
        ['The challenge', 'Describe the problem and how it is addressed today.'],
        ['Who it serves', 'Define the primary audience and their most important need.'],
        ['Opportunity', 'Explain why this problem is worth solving now.'],
      ]],
      ['Value & experience', [
        ['Value proposition', 'Summarize the benefit in one clear sentence.'],
        ['User journey', 'Outline discovery, first use, and the desired outcome.'],
        ['Success measures', 'Add measurable targets and the evidence needed to validate them.'],
      ]],
      ['Roadmap & next steps', [
        ['Current scope', 'List what is available and what remains out of scope.'],
        ['Next milestone', 'Add a deliverable, owner, and target date.'],
        ['Decision needed', 'Describe the feedback, resources, or approval required.'],
      ]],
    ],
    technicalSlides: [
      ['Architecture & data flow', [
        ['Components', 'Add a diagram of the client, services, and data stores.'],
        ['Request lifecycle', 'Trace one request through the system and its boundaries.'],
        ['Design decisions', 'Document constraints, alternatives, and trade-offs.'],
      ]],
      ['Interfaces & reliability', [
        ['Contracts', 'Add endpoints, input/output examples, and validation rules.'],
        ['Security', 'Describe authentication, authorization, and secret management.'],
        ['Failure modes', 'Document timeouts, retries, monitoring, and recovery.'],
      ]],
      ['Delivery & validation', [
        ['Local setup', 'Add prerequisites, configuration, and commands to run the project.'],
        ['Deployment', 'Describe build steps, environments, and rollback procedures.'],
        ['Test plan', 'List critical tests, expected results, and known limitations.'],
      ]],
    ],
  },
  es: {
    business: 'Presentación de negocio',
    technical: 'Presentación técnica',
    template: 'Plantilla de presentación',
    overview: 'El proyecto de un vistazo',
    stack: 'Base tecnológica',
    diagramHint: 'Desplaza el diagrama horizontalmente para ver cada componente.',
    back: 'Volver al portfolio',
    hint: 'Usa las flechas, desliza o pulsa Espacio para navegar. Pulsa Esc para ver el resumen.',
    error: 'No se pudieron cargar los controles. Recarga la página para volver a intentarlo.',
    businessSlides: [
      ['Problema y público', [
        ['El reto', 'Describe el problema y cómo se resuelve actualmente.'],
        ['A quién sirve', 'Define el público principal y su necesidad más importante.'],
        ['Oportunidad', 'Explica por qué merece la pena resolver este problema ahora.'],
      ]],
      ['Valor y experiencia', [
        ['Propuesta de valor', 'Resume el beneficio en una frase clara.'],
        ['Recorrido del usuario', 'Describe el descubrimiento, el primer uso y el resultado deseado.'],
        ['Medidas de éxito', 'Añade objetivos medibles y las pruebas necesarias para validarlos.'],
      ]],
      ['Hoja de ruta y próximos pasos', [
        ['Alcance actual', 'Enumera qué está disponible y qué queda fuera del alcance.'],
        ['Próximo hito', 'Añade un entregable, un responsable y una fecha objetivo.'],
        ['Decisión necesaria', 'Describe los comentarios, recursos o aprobación necesarios.'],
      ]],
    ],
    technicalSlides: [
      ['Arquitectura y flujo de datos', [
        ['Componentes', 'Añade un diagrama del cliente, los servicios y los almacenes de datos.'],
        ['Ciclo de una petición', 'Sigue una petición a través del sistema y sus límites.'],
        ['Decisiones de diseño', 'Documenta restricciones, alternativas y compromisos.'],
      ]],
      ['Interfaces y fiabilidad', [
        ['Contratos', 'Añade endpoints, ejemplos de entrada/salida y reglas de validación.'],
        ['Seguridad', 'Describe la autenticación, la autorización y la gestión de secretos.'],
        ['Modos de fallo', 'Documenta tiempos de espera, reintentos, monitorización y recuperación.'],
      ]],
      ['Entrega y validación', [
        ['Entorno local', 'Añade requisitos, configuración y comandos para ejecutar el proyecto.'],
        ['Despliegue', 'Describe la compilación, los entornos y los procedimientos de reversión.'],
        ['Plan de pruebas', 'Enumera pruebas críticas, resultados esperados y limitaciones conocidas.'],
      ]],
    ],
  },
}

export function getPresentationContent(slug, audience, language) {
  if (!['business', 'technical'].includes(audience)) {
    throw new Error(`Unknown presentation audience: ${audience}`)
  }
  const dictionary = language === 'es' ? es : en
  const labels = copy[dictionary.code]
  let project
  if (slug === '0-portfolio') {
    project = {
      title: 'Personal Portfolio',
      subtitle: dictionary.header.subtitle,
      fullDescription: dictionary.code === 'es'
        ? 'Un espacio para presentar proyectos de soluciones cloud y aplicaciones con IA de Vicente Zambrano Andrada.'
        : 'A space to showcase cloud solutions and AI application projects by Vicente Zambrano Andrada.',
      modalTags: ['React', 'Vite', 'Node.js', 'GCP', 'Docker'],
    }
  } else {
    const entry = Object.entries(projectsData).find(([, config]) => config.slug === slug)
    if (!entry) throw new Error(`Unknown presentation project: ${slug}`)
    project = { ...entry[1], ...dictionary.projects[entry[0]] }
  }
  const projectContent = slug === '1-pauhelper'
    ? (audience === 'business' ? pauhelperBusiness[dictionary.code] : getPauhelperTechnical(dictionary.code))
    : slug === '2-orchestratordata'
      ? (audience === 'business' ? orchestratorBusiness[dictionary.code] : getOrchestratorTechnical(dictionary.code))
      : null
  return {
    language: dictionary.code,
    project: { ...project, ...projectContent?.project },
    labels,
    audience: projectContent?.audience ?? labels[audience],
    isTemplate: !projectContent,
    source: projectContent?.source,
    showOverview: projectContent?.showOverview ?? true,
    slides: projectContent?.slides ?? labels[`${audience}Slides`],
  }
}
