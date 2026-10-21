// Spanish language dictionary.
export const es = {
  code: 'es',
  header: {
    subtitle: 'Desarrollador de Soluciones Cloud y Apps con IA',
    signOut: 'Cerrar sesión',
    toggleTheme: 'Cambiar tema de color',
    lightTheme: 'Activar modo claro',
    darkTheme: 'Activar modo oscuro',
  },
  portfolio: {
    heading: 'Mis Proyectos',
    skipToContent: 'Saltar al contenido',
    eyebrow: 'Ingeniería cloud · IA aplicada',
    intro: 'De ideas a experiencias inteligentes.',
    description: 'Explora las apps que desarrollo, los sistemas que las hacen posibles y las ideas que comparto. Soluciones cloud e IA prácticas y accesibles.',
    explore: 'Explorar mi trabajo',
    projectHint: 'Descubre cada proyecto, prueba la app o explora su diseño.',
    viewProject: 'Explorar proyecto',
    businessPresentation: 'Portfolio: Resumen de negocio',
    technicalPresentation: 'Portfolio: ¿Cómo funciona?',
    video: 'Portfolio: Vídeo — próximamente',
  },
  footer: {
    rights: 'Todos los derechos reservados.',
  },
  presentation: {
    close: 'Cerrar presentación',
    loading: 'Cargando presentación…',
    error: 'No se pudo cargar la presentación. Ciérrala y vuelve a intentarlo.',
    hint: 'Usa las flechas o desliza para navegar. Esc cierra la presentación.',
  },
  externalLink: {
    title: 'Canal de YouTube',
    subtitle: 'Creador de Contenido',
    tagline: '“La IA explicada para escépticos”',
    cta: 'Visitar Canal',
    latestVideos: 'Últimos vídeos',
    openVideos: 'Ver últimos vídeos',
    close: 'Cerrar',
    videosLoading: 'Cargando los últimos vídeos…',
    videosError: 'No se pudieron cargar los vídeos. Visita el canal para ver los últimos vídeos.',
  },
  modal: {
    close: 'Cerrar',
    videoWalkthrough: 'Video Explicativo',
    description: 'Descripción',
    techStack: 'Stack Tecnológico',
    openLiveApp: 'Abrir Aplicación',
    demoUnavailable: 'El enlace de la demo de este proyecto aún no está configurado.',
    technicalPresentation: '¿Cómo funciona?',
    businessPresentation: 'Resumen de negocio',
    viewTechnicalPresentation: '¿Cómo funciona?',
    viewBusinessPresentation: 'Resumen de negocio',
  },
  languageSwitcher: {
    label: 'Idioma',
    en: 'Inglés',
    es: 'Español',
  },
  projects: {
    pauhelper: {
      title: 'PAUHelper',
      subtitle: 'Asistente de Estudio para la EBAU',
      description:
        'Prepara la EBAU con respuestas basadas en documentos de estudio, adaptadas a tu asignatura y comunidad autónoma, con referencias que puedes comprobar.',
      fullDescription:
        'PAUHelper ayuda a estudiantes de España a preparar la EBAU. Selecciona asignatura y comunidad autónoma, plantea una pregunta y recibe una respuesta basada en materiales relevantes, con instrucciones específicas del examen y referencias a las fuentes. Las referencias permiten consultar los documentos originales, pero no garantizan la exactitud. BasicRAGapp es el código utilizado en la aplicación Android original; esta versión ofrece una interfaz web en React.',
    },
    orchestratordata: {
      title: 'Orchestrator Data App',
      subtitle: 'Asistente de fitness con IA basado en la intención',
      description:
        'Form dirige las consultas de fitness a agentes de IA especializados para explicar ejercicios con imágenes de referencia, crear rutinas y revisar el progreso registrado mediante consultas SQL controladas.',
      fullDescription:
        'Form es una aplicación de gimnasio que demuestra la orquestación de IA basada en la intención. Un orquestador con Gemini selecciona un agente especializado para explicar ejercicios, crear rutinas o analizar entrenamientos registrados; un pipeline Python ejecuta la tarea seleccionada mediante consultas SQL predefinidas y parametrizadas. La interfaz React presenta imágenes de ejercicios, borradores de rutinas que requieren confirmación explícita para guardarse e informes de progreso basados en datos. También permite seguir rutinas guardadas y registrar series completadas fuera del chat. FastAPI utiliza SQLite en local y Neon PostgreSQL en cloud, con frontend y backend desplegados juntos en GCP Cloud Run mediante Docker, Terraform y GitHub Actions. La memoria conversacional y los borradores usan fakeredis dentro del proceso y no son duraderos.',
    },
    voicesimulator: {
      title: 'Voice Simulator',
      subtitle: 'Síntesis de Audio con IA',
      description:
        'Una herramienta avanzada de generación y simulación de voz que utiliza LLMs y modelos neuronales de TTS para crear salidas de audio realistas y conversacionales para diversos casos de uso.',
      fullDescription:
        'Una plataforma de audio avanzada que utiliza modelos neuronales de Texto a Voz (TTS) de última generación y LLMs para generar simulaciones de voz altamente realistas y matizadas, orientadas a servicio al cliente automatizado, creación de contenido y accesibilidad.',
    },
  },
}
