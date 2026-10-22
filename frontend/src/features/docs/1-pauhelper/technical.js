function node(id, x, y, kind = 'service', width = 210, height = 76) {
  return { id, x, y, kind, width, height }
}

function edge(from, to, options = {}) {
  return { from, to, ...options }
}

const layouts = [
  {
    height: 270,
    nodes: [node('subject', 10, 20), node('community', 10, 170), node('docs', 300, 20, 'store'), node('instructions', 300, 170), node('answer', 600, 95), node('sources', 890, 95, 'store')],
    edges: [
      edge('subject', 'docs'), edge('community', 'instructions'),
      edge('subject', 'instructions', { fromSide: 'bottom', toSide: 'top', via: [[115, 135], [405, 135]] }),
      edge('docs', 'answer'), edge('instructions', 'answer'), edge('answer', 'sources'),
    ],
  },
  {
    height: 300,
    nodes: [node('tools', 10, 30), node('config', 300, 30), node('ingest', 600, 30), node('backend', 890, 30), node('cloud', 300, 200, 'store'), node('qdrant', 600, 200, 'store'), node('web', 890, 200)],
    edges: [edge('tools', 'config'), edge('config', 'ingest'), edge('ingest', 'backend'), edge('cloud', 'config', { fromSide: 'top', toSide: 'bottom' }), edge('qdrant', 'ingest', { fromSide: 'top', toSide: 'bottom' }), edge('backend', 'web')],
  },
  {
    height: 300,
    nodes: [node('root', 450, 10), node('frontend', 10, 175, 'service', 200, 96), node('backend', 230, 175, 'service', 200, 96), node('vectors', 450, 175, 'store', 200, 96), node('infra', 670, 175, 'service', 200, 96), node('quality', 890, 175, 'service', 200, 96)],
    edges: ['frontend', 'backend', 'vectors', 'infra', 'quality'].map(id => edge('root', id, { fromSide: 'bottom', toSide: 'top' })),
  },
  {
    height: 390,
    nodes: [node('context', 10, 10), node('prompts', 310, 10), node('system', 610, 10), node('start', 10, 175), node('retrieve', 300, 175), node('generate', 600, 175), node('end', 890, 175), node('qdrant', 300, 300, 'store')],
    edges: [
      edge('context', 'prompts'), edge('prompts', 'system'),
      edge('system', 'start', { fromSide: 'bottom', toSide: 'top', via: [[715, 130], [115, 130]] }),
      edge('start', 'retrieve'), edge('retrieve', 'generate'), edge('generate', 'end'),
      edge('retrieve', 'qdrant', { bidirectional: true }),
    ],
  },
  {
    height: 390,
    nodes: [node('client', 10, 155), node('api', 290, 155), ...['health', 'config', 'create', 'chat', 'guide'].map((id, index) => node(id, 650, 10 + index * 76, 'service', 450, 60))],
    edges: [edge('client', 'api'), ...['health', 'config', 'create', 'chat', 'guide'].map(id => edge('api', id))],
  },
  {
    height: 370,
    nodes: [node('pdf', 10, 10), node('chunks', 290, 10), node('embed', 570, 10), node('qdrant', 850, 10, 'store'), node('gcs', 10, 145, 'store'), node('metadata', 290, 145), node('memory', 850, 145, 'store'), node('question', 10, 280), node('query', 290, 280), node('search', 570, 280), node('answer', 850, 280)],
    edges: [
      edge('pdf', 'chunks'), edge('chunks', 'embed'), edge('embed', 'qdrant'), edge('pdf', 'gcs'), edge('chunks', 'metadata'),
      edge('metadata', 'qdrant', { fromSide: 'top', toSide: 'bottom', via: [[395, 115], [955, 115]] }),
      edge('question', 'query'), edge('query', 'search'), edge('search', 'answer'),
      edge('qdrant', 'search', { fromSide: 'right', toSide: 'top', via: [[1100, 48], [1100, 255], [675, 255]] }),
      edge('memory', 'answer', { bidirectional: true }),
    ],
  },
  {
    height: 330,
    nodes: [node('user', 10, 20), node('ui', 290, 20), node('api', 570, 20), node('rag', 850, 20), node('pdf', 10, 225, 'store'), node('source', 290, 225), node('signed', 570, 225), node('memory', 850, 225, 'store')],
    edges: [
      edge('user', 'ui'), edge('ui', 'api', { bidirectional: true }), edge('api', 'rag', { bidirectional: true }),
      edge('api', 'signed'), edge('api', 'memory', { bidirectional: true, fromSide: 'bottom', toSide: 'top', via: [[675, 155], [955, 155]] }), edge('signed', 'source'), edge('ui', 'source'), edge('source', 'pdf'),
    ],
  },
  {
    height: 380,
    nodes: [node('registry', 290, 10, 'store'), node('identity', 570, 10), node('secrets', 850, 10, 'store'), node('browser', 10, 145), node('cloudrun', 290, 145), node('egress', 570, 145), node('vm', 850, 145, 'store'), node('ai', 10, 290), node('docs', 290, 290, 'store'), node('nat', 570, 290), node('disk', 850, 290, 'store')],
    edges: [
      edge('registry', 'cloudrun'), edge('identity', 'cloudrun', { fromSide: 'bottom', toSide: 'top', via: [[675, 110], [395, 110]] }),
      edge('cloudrun', 'secrets', { fromSide: 'top', toSide: 'left', via: [[395, 120], [820, 120], [820, 48]] }),
      edge('browser', 'cloudrun'), edge('cloudrun', 'egress'), edge('egress', 'vm', { label: 'port' }),
      edge('cloudrun', 'ai', { fromSide: 'bottom', toSide: 'top', via: [[395, 250], [115, 250]] }),
      edge('cloudrun', 'docs'), edge('vm', 'disk'), edge('vm', 'nat', { fromSide: 'bottom', toSide: 'right', via: [[955, 260], [810, 260], [810, 328]] }),
    ],
  },
  {
    height: 370,
    nodes: [node('merge', 10, 35), node('auth', 290, 35), node('changed', 570, 35, 'decision'), node('build', 850, 5), node('reuse', 850, 140), node('plan', 850, 280), node('artifacts', 570, 280), node('approval', 290, 280, 'decision'), node('apply', 10, 280)],
    edges: [
      edge('merge', 'auth'), edge('auth', 'changed'), edge('changed', 'build', { label: 'yes' }),
      edge('changed', 'reuse', { fromSide: 'bottom', toSide: 'left', via: [[675, 178]], label: 'no' }),
      edge('build', 'plan', { fromSide: 'right', toSide: 'right', via: [[1100, 43], [1100, 318]] }),
      edge('reuse', 'plan'), edge('plan', 'artifacts'), edge('artifacts', 'approval'), edge('approval', 'apply'),
    ],
  },
]

const copy = {
  en: {
    audience: 'How it works?',
    source: 'Source: BasicRAGapp README · Sections 1–9',
    project: {
      subtitle: 'A schematic tour of the BasicRAGapp system',
      fullDescription: 'The code behind PAUHelper: a React web interface, FastAPI backend, fixed LangGraph RAG workflow, and Google Cloud infrastructure.',
      modalTags: ['React + Vite', 'FastAPI', 'LangGraph', 'Gemini', 'Vertex AI', 'Qdrant', 'Terraform', 'GCP'],
    },
    edges: { yes: 'Yes', no: 'No', port: 'TCP 6333' },
    sections: [
      {
        title: 'Business overview, use case and value',
        nodes: { subject: ['Subject'], community: ['Autonomous', 'community'], docs: ['Subject document', 'collection'], instructions: ['Exam-specific', 'instructions'], answer: ['Grounded answer'], sources: ['Source references'] },
        notes: [['Content selection', 'The subject chooses the document collection; subject + community choose the instructions.'], ['Traceability', 'Answers link back to original study documents. References support verification, not guaranteed correctness.'], ['Scope', 'PAUHelper originally used Android; this repository provides React. Visual subject tools are potential extensions.']],
      },
      {
        title: 'Prerequisites and setup guide',
        nodes: { tools: ['Python 3.12 + uv', 'Node.js 24 + npm'], config: ['.env + credentials', 'MODE=LOCAL'], ingest: ['vector_db.ingest', 'PDFs -> vectors'], backend: ['Uvicorn / FastAPI', 'localhost:8000'], cloud: ['Gemini + Vertex AI', 'Cloud Storage'], qdrant: ['Qdrant', 'localhost:6333'], web: ['React / Vite :3000', '/api -> :8000'] },
        notes: [['Prepare', 'Install dependencies; set API keys, GCP permissions, bucket, and matching embedding model. Keep credentials outside Git.'], ['Index and run', 'Organize PDFs by collection, ingest them if needed, then start backend and frontend in separate terminals.'], ['Local is not offline', 'Vertex AI and Cloud Storage are still required. GET /api/ checks Qdrant only; send a question to test the full flow.']],
      },
      {
        title: 'Repository structure',
        nodes: { root: ['BasicRAGapp/'], frontend: ['frontend/', 'React + Vite', 'features/ai-chat'], backend: ['src/', 'api/ + system/', 'config/ + utils/'], vectors: ['vector_db/', 'ingest.py', 'manager.py'], infra: ['infra/', 'modules/', 'environments/prod'], quality: ['tests/ + .github/', '.githooks/', 'app_func_tests/'] },
        notes: [['Application', 'frontend/src separates chat features, shared components, API integration, translations, and layouts.'], ['Backend and data', 'src/app.py starts FastAPI; src/system and src/utils coordinate RAG, prompts, embeddings, cache, and logging.'], ['Delivery and quality', 'Terraform modules, frontend/backend unit and integration tests, workflows, sample payloads, and Git hooks support delivery.']],
      },
      {
        title: 'Agentic RAG system',
        nodes: { context: ['Select subject', '+ community'], prompts: ['Load GCS prompt', 'Select collection'], system: ['Initialize system', 'outside the graph'], start: ['START', 'Question + memory'], retrieve: ['retrieve', 'Embed + top k=4'], generate: ['generate', 'Instructions + LLM'], end: ['END', 'Answer + sources'], qdrant: ['Qdrant', 'Subject collection'] },
        notes: [['Fixed graph', 'START -> retrieve -> generate -> END. There is no dynamic tool selection or loop between agents.'], ['Retrieval', 'Embed the question and retrieve up to four document chunks from the selected subject collection.'], ['Generation', 'Combine instructions, retrieved context, and conversation messages. Prompt-load failure logs an issue and uses a generic tutor prompt.']],
      },
      {
        title: 'FastAPI',
        nodes: { client: ['React client', 'Session context'], api: ['FastAPI', '/api prefix'], health: ['GET /api/', 'Qdrant + cache status'], config: ['GET /api/config', 'Localized study options'], create: ['POST /api/create_system', 'Initialize / recover system'], chat: ['POST /api/chat', 'Text or image -> answer + sources'], guide: ['GET /api/docs/how-it-works', '307 -> signed PDF, 15 minutes'] },
        notes: [['Request contracts', 'Pydantic validates session_id, category (community), subject, and EN/ES language. Chat needs text or an image.'], ['Response and docs', 'Chat returns response + sources: doc_id, file_name, page, url. /docs and /openapi.json describe the API; sources may be empty.'], ['Explicit failures', 'JSON detail with 400, 422, 500, 502, or 503. Health success does not verify Gemini access or a complete chat exchange.']],
      },
      {
        title: 'Database',
        nodes: { pdf: ['PDFs by subject'], chunks: ['Extract text', 'Split into chunks'], embed: ['Vertex AI', 'Text embeddings'], qdrant: ['Qdrant', '1 collection / subject'], gcs: ['Cloud Storage', 'Original PDFs'], metadata: ['Document + page', 'Chunk ID + GCS URI'], memory: ['Redis / fakeredis', '6 turns + summary'], question: ['User question'], query: ['Vertex AI', 'Same model'], search: ['Similarity search', 'Chunks + metadata'], answer: ['Generate answer', 'Update memory'] },
        notes: [['Index and query', 'Use the same embedding model for ingestion and queries. Communities share subject documents rather than duplicate collections.'], ['Source metadata', 'Stable relative_path/doc_id, file_name, one-based page_number, chunk IDs, embedding model, and GCS location enable signed source URLs.'], ['Short-term memory', 'Up to 6 recent turns + a bounded rolling summary; expiry refreshes to 6 hours. fakeredis is process-local and lost on restart.']],
      },
      {
        title: 'Frontend',
        nodes: { user: ['User', 'Community + subject'], ui: ['React + Vite', 'Single-view chat'], api: ['FastAPI', 'config / create / chat'], rag: ['LangGraph + Qdrant', 'Retrieve + generate'], pdf: ['Cloud Storage', 'PDF viewer'], source: ['Source button', 'url#page=<number>'], signed: ['Signed source URLs', 'from /api/chat'], memory: ['Redis / fakeredis', 'Short-term memory'] },
        notes: [['Session flow', 'Check availability, load /api/config, initialize /api/create_system, then send /api/chat with the same session and study context.'], ['Answer and references', 'Render the answer and source buttons together. A source opens its signed URL with a page fragment; missing page defaults to 1.'], ['Service boundaries', 'The frontend never connects directly to Qdrant or Redis. /api/docs/how-it-works is a separate guide, not the source-document endpoint.']],
      },
      {
        title: 'Cloud infrastructure',
        nodes: { registry: ['Artifact Registry', 'Container image'], identity: ['Runtime identity', 'IAM URL signing'], secrets: ['Secret Manager', 'Runtime secrets'], browser: ['Public browser'], cloudrun: ['Cloud Run', 'React + FastAPI'], egress: ['Direct VPC egress', 'Serverless subnet'], vm: ['Private Qdrant VM', 'No external IP'], ai: ['Vertex AI / Gemini', 'Embeddings / chat'], docs: ['Application bucket', 'PDFs + prompts'], nat: ['Cloud NAT', 'Outbound internet'], disk: ['Persistent disk', 'Qdrant data'] },
        notes: [['Network and identity', 'Qdrant has a dedicated subnet, firewall TCP 6333, IAP admin access, and on-demand startup. Runtime and deployment identities are separate.'], ['Demo limits', 'Public Cloud Run; 1 instance + 1 worker share fakeredis. Idle shutdown reduces VM uptime but adds startup delay. Redis is not provisioned by Terraform.'], ['State and governance', 'Application documents and Terraform state use separate buckets. Private networking is not complete protection; some IAM is managed outside this repository.']],
      },
      {
        title: 'Infrastructure as code and workflows',
        nodes: { merge: ['dev PR merged', 'into main'], auth: ['GCP authentication', 'Workload Identity'], changed: ['App directories', 'changed?'], build: ['Build + push image', 'Artifact Registry'], reuse: ['Reuse existing image'], plan: ['Terraform init / plan', 'Production GCS state'], artifacts: ['Save plan + function', 'source archive'], approval: ['Required reviewers?', 'Wait if configured'], apply: ['Job 2: auth / init', 'apply saved tfplan'] },
        notes: [['Repeatable delivery', 'Reusable infra/modules feed one environments/prod environment. Build only when tracked application directories change.'], ['Saved-plan handoff', 'Job 1 uploads the plan and function archive; job 2 downloads them, initializes the same GCS backend, and applies tfplan.'], ['Approval is conditional', 'The production environment name does not enforce review. Configure required reviewers in GitHub to gate apply; this demo defines only one environment.']],
      },
    ],
  },
  es: {
    audience: '¿Cómo funciona?',
    source: 'Fuente: README de BasicRAGapp · Secciones 1–9',
    project: {
      subtitle: 'Recorrido esquemático del sistema BasicRAGapp',
      fullDescription: 'El código de PAUHelper: interfaz web React, backend FastAPI, flujo RAG fijo con LangGraph e infraestructura en Google Cloud.',
      modalTags: ['React + Vite', 'FastAPI', 'LangGraph', 'Gemini', 'Vertex AI', 'Qdrant', 'Terraform', 'GCP'],
    },
    edges: { yes: 'Sí', no: 'No', port: 'TCP 6333' },
    sections: [
      {
        title: 'Resumen de negocio, caso de uso y valor',
        nodes: { subject: ['Asignatura'], community: ['Comunidad', 'autónoma'], docs: ['Colección documental', 'por asignatura'], instructions: ['Instrucciones', 'del examen'], answer: ['Respuesta', 'con contexto'], sources: ['Referencias a fuentes'] },
        notes: [['Selección de contenido', 'La asignatura elige los documentos; asignatura + comunidad eligen las instrucciones.'], ['Trazabilidad', 'Las respuestas remiten a los documentos de estudio. Las referencias facilitan verificar, pero no garantizan exactitud.'], ['Alcance', 'PAUHelper usaba Android; este repositorio ofrece React. Las herramientas visuales por asignatura son extensiones potenciales.']],
      },
      {
        title: 'Requisitos y guía de configuración',
        nodes: { tools: ['Python 3.12 + uv', 'Node.js 24 + npm'], config: ['.env + credenciales', 'MODE=LOCAL'], ingest: ['vector_db.ingest', 'PDFs -> vectores'], backend: ['Uvicorn / FastAPI', 'localhost:8000'], cloud: ['Gemini + Vertex AI', 'Cloud Storage'], qdrant: ['Qdrant', 'localhost:6333'], web: ['React / Vite :3000', '/api -> :8000'] },
        notes: [['Preparar', 'Instalar dependencias y configurar claves, permisos GCP, bucket y el mismo modelo de embeddings. Las credenciales quedan fuera de Git.'], ['Indexar y ejecutar', 'Organizar PDFs por colección, ingerirlos si es necesario y arrancar backend y frontend en terminales distintas.'], ['Local no significa sin nube', 'Se necesitan Vertex AI y Cloud Storage. GET /api/ solo comprueba Qdrant; una pregunta verifica el flujo completo.']],
      },
      {
        title: 'Estructura del repositorio',
        nodes: { root: ['BasicRAGapp/'], frontend: ['frontend/', 'React + Vite', 'features/ai-chat'], backend: ['src/', 'api/ + system/', 'config/ + utils/'], vectors: ['vector_db/', 'ingest.py', 'manager.py'], infra: ['infra/', 'modules/', 'environments/prod'], quality: ['tests/ + .github/', '.githooks/', 'app_func_tests/'] },
        notes: [['Aplicación', 'frontend/src separa chat, componentes compartidos, integración API, traducciones y layouts.'], ['Backend y datos', 'src/app.py arranca FastAPI; src/system y src/utils coordinan RAG, prompts, embeddings, caché y logs.'], ['Entrega y calidad', 'Módulos Terraform, pruebas unitarias y de integración de frontend/backend, workflows, peticiones de ejemplo y hooks de Git.']],
      },
      {
        title: 'Sistema RAG agéntico',
        nodes: { context: ['Elegir asignatura', '+ comunidad'], prompts: ['Cargar prompt GCS', 'Elegir colección'], system: ['Inicializar sistema', 'Fuera del grafo'], start: ['START', 'Pregunta + memoria'], retrieve: ['retrieve', 'Embedding + top k=4'], generate: ['generate', 'Instrucciones + LLM'], end: ['END', 'Respuesta + fuentes'], qdrant: ['Qdrant', 'Colección por materia'] },
        notes: [['Grafo fijo', 'START -> retrieve -> generate -> END. No hay selección dinámica de herramientas ni bucles entre agentes.'], ['Recuperación', 'Convertir la pregunta en un embedding y recuperar hasta cuatro fragmentos de la colección de la asignatura.'], ['Generación', 'Combinar instrucciones, contexto y mensajes. Si falla la carga del prompt, se registra el fallo y se usa un tutor genérico.']],
      },
      {
        title: 'FastAPI',
        nodes: { client: ['Cliente React', 'Contexto de sesión'], api: ['FastAPI', 'Prefijo /api'], health: ['GET /api/', 'Estado Qdrant + caché'], config: ['GET /api/config', 'Opciones localizadas'], create: ['POST /api/create_system', 'Inicializar / recuperar sistema'], chat: ['POST /api/chat', 'Texto o imagen -> respuesta + fuentes'], guide: ['GET /api/docs/how-it-works', '307 -> PDF firmado, 15 minutos'] },
        notes: [['Contratos de entrada', 'Pydantic valida session_id, category (comunidad), asignatura e idioma EN/ES. El chat requiere texto o imagen.'], ['Respuesta y documentación', 'El chat devuelve response + sources: doc_id, file_name, page, url. /docs y /openapi.json describen la API; puede no haber fuentes.'], ['Fallos explícitos', 'JSON detail con 400, 422, 500, 502 o 503. Una comprobación de salud correcta no verifica Gemini ni una conversación completa.']],
      },
      {
        title: 'Base de datos',
        nodes: { pdf: ['PDFs por asignatura'], chunks: ['Extraer texto', 'Dividir en fragmentos'], embed: ['Vertex AI', 'Embeddings de texto'], qdrant: ['Qdrant', '1 colección / materia'], gcs: ['Cloud Storage', 'PDFs originales'], metadata: ['Documento + página', 'Chunk ID + URI GCS'], memory: ['Redis / fakeredis', '6 turnos + resumen'], question: ['Pregunta del usuario'], query: ['Vertex AI', 'Mismo modelo'], search: ['Similitud', 'Texto + metadatos'], answer: ['Generar respuesta', 'Actualizar memoria'] },
        notes: [['Índice y consulta', 'Usar el mismo modelo de embeddings al ingerir y consultar. Las comunidades comparten documentos por asignatura, sin duplicar colecciones.'], ['Metadatos de origen', 'relative_path/doc_id estable, file_name, page_number desde 1, identificadores de fragmento, modelo y ubicación GCS permiten URLs firmadas.'], ['Memoria a corto plazo', 'Hasta 6 turnos recientes + resumen acotado; la caducidad se renueva a 6 horas. fakeredis es local al proceso y se pierde al reiniciar.']],
      },
      {
        title: 'Frontend',
        nodes: { user: ['Usuario', 'Comunidad + materia'], ui: ['React + Vite', 'Chat de vista única'], api: ['FastAPI', 'config / create / chat'], rag: ['LangGraph + Qdrant', 'Recuperar + generar'], pdf: ['Cloud Storage', 'Visor PDF'], source: ['Botón de fuente', 'url#page=<número>'], signed: ['URLs de fuentes', 'desde /api/chat'], memory: ['Redis / fakeredis', 'Memoria de sesión'] },
        notes: [['Flujo de sesión', 'Comprobar disponibilidad, cargar /api/config, inicializar /api/create_system y enviar /api/chat con la misma sesión y contexto.'], ['Respuesta y referencias', 'Mostrar respuesta y botones de fuentes. Cada fuente abre su URL firmada con fragmento de página; si no hay página, se usa 1.'], ['Límites de servicio', 'El frontend no conecta directamente con Qdrant o Redis. /api/docs/how-it-works es una guía independiente, no el endpoint de fuentes.']],
      },
      {
        title: 'Infraestructura cloud',
        nodes: { registry: ['Artifact Registry', 'Imagen Docker'], identity: ['Identidad de runtime', 'Firma IAM de URLs'], secrets: ['Secret Manager', 'Secretos de runtime'], browser: ['Navegador público'], cloudrun: ['Cloud Run', 'React + FastAPI'], egress: ['Direct VPC egress', 'Subred serverless'], vm: ['VM Qdrant privada', 'Sin IP externa'], ai: ['Vertex AI / Gemini', 'Embeddings / chat'], docs: ['Bucket de aplicación', 'PDFs + prompts'], nat: ['Cloud NAT', 'Internet de salida'], disk: ['Disco persistente', 'Datos de Qdrant'] },
        notes: [['Red e identidad', 'Qdrant tiene subred propia, firewall TCP 6333, acceso IAP y arranque bajo demanda. Identidades de runtime y despliegue separadas.'], ['Límites de la demo', 'Cloud Run público; 1 instancia + 1 worker comparten fakeredis. El apagado por inactividad reduce uso, pero añade espera. Terraform no crea Redis.'], ['Estado y gobierno', 'Buckets separados para documentos y estado Terraform. La red privada no protege por sí sola; parte del IAM se gestiona fuera del repositorio.']],
      },
      {
        title: 'Infraestructura como código y workflows',
        nodes: { merge: ['PR de dev fusionada', 'en main'], auth: ['Autenticación GCP', 'Workload Identity'], changed: ['¿Cambios en', 'directorios de app?'], build: ['Crear y subir imagen', 'Artifact Registry'], reuse: ['Reutilizar imagen'], plan: ['Terraform init / plan', 'Estado GCS de prod'], artifacts: ['Plan + código', 'de la función'], approval: ['¿Revisores exigidos?', 'Esperar si se exige'], apply: ['Job 2: auth / init', 'apply tfplan'] },
        notes: [['Entrega repetible', 'Módulos infra/modules para un único environments/prod. Crear imagen solo si cambian los directorios de aplicación seguidos.'], ['Transferencia del plan', 'El primer job sube plan y código de función; el segundo los descarga, inicializa el mismo backend GCS y aplica tfplan.'], ['Aprobación condicional', 'El nombre production no exige revisión. Configurar revisores obligatorios en GitHub para bloquear apply; la demo solo define un entorno.']],
      },
    ],
  },
}

export function getPauhelperTechnical(language) {
  const content = copy[language]
  return {
    ...content,
    showOverview: false,
    slides: content.sections.map((section, index) => {
      const layout = layouts[index]
      return [`${index + 1}. ${section.title}`, section.notes, {
        width: 1120,
        height: layout.height,
        section: index + 1,
        caption: `${index + 1} · ${section.title}`,
        nodes: layout.nodes.map(node => ({ ...node, label: section.nodes[node.id] })),
        edges: layout.edges.map(edge => ({ ...edge, label: content.edges[edge.label] })),
      }]
    }),
  }
}
