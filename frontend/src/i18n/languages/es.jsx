// Spanish language dictionary.
export const es = {
  code: 'es',
  header: {
    subtitle: 'Desarrollador de Soluciones Cloud y Apps con IA',
  },
  portfolio: {
    heading: 'Mis Proyectos',
  },
  footer: {
    rights: 'Todos los derechos reservados.',
  },
  externalLink: {
    title: 'Canal de YouTube',
    subtitle: 'Creador de Contenido',
    tagline: '“La IA explicada para escépticos”',
    cta: 'Visitar Canal',
  },
  modal: {
    videoWalkthrough: 'Video Explicativo',
    description: 'Descripción',
    techStack: 'Stack Tecnológico',
    openLiveApp: 'Abrir Aplicación',
    technicalDocs: 'Documentación Técnica',
    userGuide: 'Guía de Usuario y Lógica',
  },
  languageSwitcher: {
    label: 'Idioma',
    en: 'Inglés',
    es: 'Español',
  },
  projects: {
    pauhelper: {
      title: 'PAUHelper',
      subtitle: 'Asistente de Estudio con IA',
      description:
        'Un asistente inteligente diseñado para ayudar a los estudiantes a prepararse para los exámenes mediante tutoría basada en IA, rutas de estudio personalizadas y consultas rápidas.',
      fullDescription:
        'PAUHelper es un asistente de estudio integral diseñado para optimizar la preparación de exámenes. Utiliza modelos de lenguaje de gran tamaño para generar preguntas de práctica, resumir apuntes y actuar como tutor conversacional en materias académicas específicas.',
      techDocs: [
        '<strong>Frontend:</strong> Aplicación de una sola página en React construida con Vite y estilizada con Tailwind CSS.',
        '<strong>Backend:</strong> Microservicio FastAPI sin estado ejecutándose en un contenedor Docker aislado.',
        '<strong>Infraestructura:</strong> Desplegado en Google Cloud Run para un autoescalado fluido desde cero, soportando picos en temporada de exámenes.',
        '<strong>Autenticación:</strong> Flujo de autenticación basado en JWT.',
      ],
      softDocs: [
        'El concepto principal es reducir la fricción del estudio proporcionando contexto instantáneo. En lugar de buscar en libros de texto, los estudiantes pueden subir su temario y hacer preguntas específicas.',
        '<strong>Caso de uso:</strong> Un estudiante de bachillerato que se prepara para la PAU necesita aclarar un evento histórico. La aplicación ofrece un resumen ajustado al nivel del currículo.',
      ],
    },
    orchestratordata: {
      title: 'Orchestrator Data App',
      subtitle: 'Gestor de Pipelines de Datos',
      description:
        'Una plataforma centralizada creada para orquestar, monitorizar y gestionar pipelines de datos complejos y cargas de trabajo de IA sin servidor de forma segura y eficiente en Google Cloud Platform.',
      fullDescription:
        'Una robusta plataforma de orquestación de datos que actúa como centro para monitorizar, gestionar y activar diversos pipelines de procesamiento de datos impulsados por IA. Garantiza que los datos fluyan de forma segura entre instancias aisladas.',
      techDocs: [
        '<strong>Arquitectura:</strong> Actúa como orquestador central. Activa y monitoriza servicios backend de Cloud Run mediante APIs REST y colas de mensajes.',
        '<strong>Despliegue:</strong> Totalmente automatizado con CI/CD mediante GitHub Actions hacia GCP Cloud Run.',
        '<strong>Seguridad:</strong> Implementa políticas robustas de autenticación e IAM para proteger la ejecución de los pipelines de datos.',
      ],
      softDocs: [
        'Diseñado para que los equipos de ingeniería de datos puedan monitorizar fácilmente el estado de sus pipelines y activar reejecuciones manuales sin necesitar acceso profundo a la línea de comandos.',
        '<strong>Flujo de trabajo:</strong> El usuario inicia sesión en el portal, visualiza los pipelines activos en un panel y puede acceder a trabajos específicos para ver registros, métricas de rendimiento y linaje de datos.',
      ],
    },
    voicesimulator: {
      title: 'Voice Simulator',
      subtitle: 'Síntesis de Audio con IA',
      description:
        'Una herramienta avanzada de generación y simulación de voz que utiliza LLMs y modelos neuronales de TTS para crear salidas de audio realistas y conversacionales para diversos casos de uso.',
      fullDescription:
        'Una plataforma de audio avanzada que utiliza modelos neuronales de Texto a Voz (TTS) de última generación y LLMs para generar simulaciones de voz altamente realistas y matizadas, orientadas a servicio al cliente automatizado, creación de contenido y accesibilidad.',
      techDocs: [
        '<strong>Lógica principal:</strong> Utiliza LangGraph para orquestar el flujo de conversación, el análisis de sentimiento y la generación dinámica de prompts antes de pasar al motor de TTS.',
        '<strong>Procesamiento de audio:</strong> Genera fragmentos de audio en streaming para minimizar la latencia durante simulaciones conversacionales en vivo.',
        '<strong>Integración:</strong> Se conecta con proveedores externos de LLM y modelos de voz personalizados y ajustados.',
      ],
      softDocs: [
        'Voice Simulator responde a la necesidad de interacciones de voz escalables y humanas. Va más allá de las respuestas robóticas al inyectar señales emocionales según el contexto de la conversación.',
        '<strong>Valor de negocio:</strong> Reduce los costos de soporte al gestionar consultas telefónicas complejas y de múltiples turnos, manteniendo un alto estándar de experiencia del cliente gracias a voces de sonido natural.',
      ],
    },
  },
}
