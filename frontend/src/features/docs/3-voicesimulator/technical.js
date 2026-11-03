function node(id, x, y, kind = 'service') {
  return { id, x, y, kind, width: 250, height: 76 }
}

function makeSection(title, nodes, connections, notes) {
  return { title, nodes, connections, notes }
}

const copy = {
  en: {
    audience: 'How it works?',
    source: 'Source: Plinius README · Sections 1–10',
    project: {
      subtitle: 'A schematic tour of Plinius, from voice input to cloud deployment',
      fullDescription: 'Plinius combines a React and Vite frontend with a FastAPI backend, a custom STT–LLM–TTS pipeline, RAG retrieval, and Google Cloud infrastructure managed with Terraform.',
      modalTags: [
        'Python',
        'FastAPI',
        'React + Vite',
        'Gemini',
        'SQLite / Qdrant',
        'Google Cloud',
        'Terraform',
      ],
    },
    sections: [
      makeSection('Overview', {
        visitor: ['Visitor', 'Rome historic sites'],
        frontend: ['React + Vite', 'Map, route, guide'],
        api: ['FastAPI', 'Chat endpoint'],
        pipeline: ['Custom voice pipeline', 'STT · LLM · TTS'],
        gemini: ['Gemini API', 'LLM + embeddings'],
        retrieval: ['RAG retrieval', 'Curated knowledge'],
        sources: ['Answer sources', 'PDF pages'],
      }, [
        ['visitor', 'frontend'], ['frontend', 'api'], ['api', 'pipeline'],
        ['pipeline', 'gemini'], ['pipeline', 'retrieval'], ['retrieval', 'sources'],
      ], [
        ['Application', 'The frontend is a React application built and served with Vite; the backend uses Python and FastAPI.'],
        ['Agent system', 'Custom classes handle utilities, agent memory, and workflow. The README says no agent framework is used.'],
        ['Grounded answers', 'RAG grounds answers in curated knowledge, and users can consult the sources behind each answer.'],
      ]),
      makeSection('Use Case and Business Value', {
        question: ['Visitor question', 'and current stop'],
        intent: ['Extract intent', 'historic / restaurant'],
        filter: ['Metadata filter', 'stop + type'],
        vectors: ['Vector collection', 'knowledge chunks'],
        answer: ['LLM agent', 'grounded answer'],
        sources: ['Sources', 'document + page'],
      }, [
        ['question', 'intent'], ['intent', 'filter'], ['filter', 'vectors'],
        ['question', 'vectors'], ['vectors', 'answer'], ['answer', 'sources'],
      ], [
        ['Pipeline control', 'The documented control points are Speech-to-Text, the Large Language Model, and Text-to-Speech.'],
        ['Context control', 'The selected stop provides context, and retrieval also filters by the content type selected from the user’s intent.'],
        ['Source traceability', 'Answers include sources so users can consult the documents behind them.'],
      ]),
      makeSection('Prerequisites and Installation Guide', {
        docs: ['PDF documents', 'by stop / type'],
        database: ['Knowledge base', 'SQLite snapshot'],
        backend: ['Python 3.10+', 'uv · FastAPI :8000'],
        frontend: ['Node.js + npm', 'React · Vite'],
        credentials: ['Gemini API key', 'embeddings + LLM'],
        cloud: ['GCP mode', 'Cloud Storage + Qdrant'],
      }, [
        ['docs', 'database'], ['database', 'backend'], ['credentials', 'backend'],
        ['backend', 'frontend'], ['cloud', 'backend'],
      ], [
        ['Prerequisites', 'The README specifies Python 3.10 or later, Node.js and npm, and a Gemini API key. Docker, gcloud, and Qdrant are for cloud deployment.'],
        ['Configuration', 'ENV selects LOCAL or GCP. Configuration precedence is process environment, APP_SECRETS_JSON, root .env, then defaults.'],
        ['Local setup', 'Generate the SQLite snapshot, start FastAPI on port 8000, then start the Vite frontend, which proxies /api to the backend.'],
      ]),
      makeSection('Tech Stack', {
        backend: ['Backend', 'Python + FastAPI', 'custom classes'],
        llm: ['LLM', 'Google AI Studio', 'Gemini API'],
        frontend: ['Frontend', 'React + Vite'],
        cloud: ['Cloud', 'Google Cloud Platform'],
        iac: ['Infrastructure as Code', 'Terraform'],
        retrieval: ['Retrieval', 'SQLite local / Qdrant cloud'],
      }, [
        ['backend', 'llm'], ['backend', 'retrieval'], ['frontend', 'backend'],
        ['cloud', 'iac'], ['cloud', 'retrieval'],
      ], [
        ['Backend', 'Python and FastAPI provide the backend; custom classes handle utilities, memory, and workflow without an agent framework.'],
        ['Frontend', 'The user interface is built with React and Vite.'],
        ['Cloud', 'The README identifies Google Cloud Platform as the cloud platform and Terraform as the infrastructure-as-code tool.'],
      ]),
      makeSection('Voice Processing', {
        input: ['Question', 'audio or text'],
        stt: ['STT', 'audio → text'],
        agent: ['LLM agent', 'routing + RAG'],
        tts: ['TTS', 'text → audio'],
        text: ['Text answer'],
        audio: ['Voice answer'],
      }, [
        ['input', 'stt'], ['input', 'agent'], ['stt', 'agent'],
        ['agent', 'tts'], ['agent', 'text'], ['tts', 'audio'],
      ], [
        ['Pipeline', 'The custom pipeline places the LLM agent between optional Speech-to-Text and Text-to-Speech layers.'],
        ['Modes', 'full is audio-to-audio; stt is audio-to-text; tts is text-to-audio; text is text-to-text.'],
        ['Mode behavior', 'The request mode determines whether STT and TTS run around the LLM agent in the same endpoint.'],
      ]),
      makeSection('RAG Agent', {
        question: ['Question + stop'],
        intent: ['Intent', 'historic / restaurant'],
        embed: ['Embed question'],
        filter: ['Filter metadata', 'stop + type'],
        collection: ['Vector collection', 'document chunks'],
        rank: ['Relevant chunks', 'and source data'],
        generate: ['LLM agent', 'generate answer'],
        answer: ['Answer + sources'],
      }, [
        ['question', 'intent'], ['question', 'embed'], ['intent', 'filter'],
        ['filter', 'collection'], ['embed', 'collection'], ['collection', 'rank'],
        ['rank', 'generate'], ['generate', 'answer'],
      ], [
        ['Stored metadata', 'Each document chunk is stored with its stop name and type, such as historic or restaurants, alongside document information.'],
        ['Retrieval', 'The current stop and the intent-derived type filter the collection; the question is embedded to find relevant chunks.'],
        ['Response', 'The LLM agent generates an answer from the retrieved chunks and returns the associated sources.'],
      ]),
      makeSection('FastAPI Endpoints', {
        client: ['Frontend client'],
        api: ['FastAPI', 'local root / cloud /api'],
        health: ['GET /health', 'liveness'],
        chat: ['POST /chat', 'text / audio / NDJSON'],
        documents: ['GET /documents/{source}', 'cited PDF'],
        ready: ['GET /demo/ready', 'knowledge-base status'],
        start: ['POST /demo/start', 'request VM startup'],
      }, [
        ['client', 'api'], ['api', 'health'], ['api', 'chat'],
        ['api', 'documents'], ['api', 'ready'], ['api', 'start'],
      ], [
        ['Chat request', 'POST /chat accepts query, mode, language, and stop; request_type is optional and stream enables NDJSON progress and results.'],
        ['Outputs and sources', 'Text modes return JSON with text and sources; audio modes return WAV with sources in X-PDF-Sources.'],
        ['Readiness and tracing', '/demo/ready checks the vector collection, /demo/start requests VM startup, and responses carry an X-Request-ID.'],
      ]),
      makeSection('Frontend', {
        visitor: ['Visitor'],
        controls: ['Top bar', 'language + voice mode'],
        stop: ['Route bar / map', 'select current stop'],
        question: ['Ask', 'suggested / text / voice'],
        answer: ['Guide panel', 'answer + progress'],
        sources: ['Sources panel', 'documents + pages'],
        pdf: ['Source PDF', 'cited page'],
      }, [
        ['visitor', 'controls'], ['controls', 'stop'], ['stop', 'question'],
        ['question', 'answer'], ['answer', 'sources'], ['sources', 'pdf'],
      ], [
        ['User input', 'Visitors can choose suggested questions, type a message, or record a voice question.'],
        ['Context and mode', 'The selected map or route stop sets RAG context; the voice toggle controls spoken versus text answers.'],
        ['Source access', 'The sources panel lists documents and pages used for the last answer, and each source links to its PDF.'],
      ]),
      makeSection('Google Cloud Platform Deployment', {
        user: ['User browser'],
        cloudrun: ['Cloud Run', 'React / + FastAPI /api'],
        gemini: ['Gemini API'],
        storage: ['Cloud Storage', 'prompts + documents'],
        qdrant: ['Qdrant VM', 'chunks + embeddings'],
        secret: ['Secret Manager', 'APP_SECRETS_JSON'],
        registry: ['Artifact Registry', 'container image'],
        terraform: ['Terraform', 'GCP resources'],
      }, [
        ['user', 'cloudrun'], ['registry', 'cloudrun'], ['terraform', 'cloudrun'],
        ['cloudrun', 'gemini'], ['cloudrun', 'storage'], ['cloudrun', 'qdrant'],
        ['secret', 'cloudrun'],
      ], [
        ['Single container', 'Cloud Run serves the React frontend at / and the FastAPI backend at /api.'],
        ['Runtime services', 'Cloud Storage holds prompts and PDFs; the Qdrant VM serves retrieval chunks; Secret Manager supplies APP_SECRETS_JSON.'],
        ['Deployment configuration', 'The README specifies a linux/amd64 image, port 8080, a non-root user, and Cloud Run with 2 CPU, 2 GiB, and one minimum/maximum instance.'],
      ]),
      makeSection('Infrastructure as Code with Terraform', {
        merge: ['Merge dev PR', 'into main'],
        auth: ['Workload Identity', 'Federation'],
        build: ['Build + publish', 'immutable image digest'],
        plan: ['Terraform plan', 'plan checker'],
        artifact: ['Saved plan'],
        approval: ['Protected prod', 'review + approve'],
        apply: ['Terraform apply', 'reviewed plan'],
        deploy: ['Cloud Run', 'new revision'],
      }, [
        ['merge', 'auth'], ['auth', 'build'], ['build', 'plan'],
        ['plan', 'artifact'], ['artifact', 'approval'], ['approval', 'apply'],
        ['apply', 'deploy'],
      ], [
        ['Workflow trigger', 'Deployment is triggered when a same-repository pull request from dev is merged into main.'],
        ['Plan and approval', 'The workflow saves a plan, checks that it contains only allowed changes, and waits for review in the protected prod environment.'],
        ['Apply safeguards', 'Terraform applies the reviewed plan. The README also documents immutable image digests, remote state, keyless authentication, protected resources, and serialized runs.'],
      ]),
    ],
  },
  es: {
    audience: '¿Cómo funciona?',
    source: 'Fuente: README de Plinius · Secciones 1–10',
    project: {
      subtitle: 'Recorrido esquemático de Plinius, desde la voz hasta el despliegue cloud',
      fullDescription: 'Plinius combina un frontend React y Vite con un backend FastAPI, un pipeline personalizado STT–LLM–TTS, recuperación RAG e infraestructura de Google Cloud gestionada con Terraform.',
      modalTags: [
        'Python',
        'FastAPI',
        'React + Vite',
        'Gemini',
        'SQLite / Qdrant',
        'Google Cloud',
        'Terraform',
      ],
    },
    sections: [
      makeSection('Descripción general', {
        visitor: ['Visitante', 'lugares históricos de Roma'],
        frontend: ['React + Vite', 'mapa, ruta, guía'],
        api: ['FastAPI', 'endpoint de chat'],
        pipeline: ['Pipeline de voz', 'STT · LLM · TTS'],
        gemini: ['API de Gemini', 'LLM + embeddings'],
        retrieval: ['Recuperación RAG', 'conocimiento seleccionado'],
        sources: ['Fuentes', 'páginas PDF'],
      }, [
        ['visitor', 'frontend'], ['frontend', 'api'], ['api', 'pipeline'],
        ['pipeline', 'gemini'], ['pipeline', 'retrieval'], ['retrieval', 'sources'],
      ], [
        ['Aplicación', 'El frontend es una aplicación React construida y servida con Vite; el backend utiliza Python y FastAPI.'],
        ['Sistema agéntico', 'Clases personalizadas gestionan utilidades, memoria del agente y flujo de trabajo. El README indica que no se utiliza un framework de agentes.'],
        ['Respuestas fundamentadas', 'RAG fundamenta las respuestas en conocimiento seleccionado y permite consultar sus fuentes.'],
      ]),
      makeSection('Caso de uso y valor de negocio', {
        question: ['Pregunta y parada', 'del visitante'],
        intent: ['Extraer intención', 'historia / restaurante'],
        filter: ['Filtro de metadatos', 'parada + tipo'],
        vectors: ['Colección vectorial', 'fragmentos'],
        answer: ['Agente LLM', 'respuesta fundamentada'],
        sources: ['Fuentes', 'documento + página'],
      }, [
        ['question', 'intent'], ['intent', 'filter'], ['filter', 'vectors'],
        ['question', 'vectors'], ['vectors', 'answer'], ['answer', 'sources'],
      ], [
        ['Control del pipeline', 'Los puntos de control documentados son voz a texto, el modelo de lenguaje grande y texto a voz.'],
        ['Control del contexto', 'La parada seleccionada proporciona el contexto y la recuperación también filtra por el tipo que se obtiene de la intención.'],
        ['Trazabilidad', 'Las respuestas incluyen fuentes para que los usuarios puedan consultar los documentos utilizados.'],
      ]),
      makeSection('Requisitos y guía de instalación', {
        docs: ['PDFs', 'por parada / tipo'],
        database: ['Base de conocimiento', 'snapshot SQLite'],
        backend: ['Python 3.10+', 'uv · FastAPI :8000'],
        frontend: ['Node.js + npm', 'React · Vite'],
        credentials: ['Clave API Gemini', 'embeddings + LLM'],
        cloud: ['Modo GCP', 'Cloud Storage + Qdrant'],
      }, [
        ['docs', 'database'], ['database', 'backend'], ['credentials', 'backend'],
        ['backend', 'frontend'], ['cloud', 'backend'],
      ], [
        ['Requisitos', 'El README especifica Python 3.10 o posterior, Node.js y npm, y una clave API de Gemini. Docker, gcloud y Qdrant se necesitan para el despliegue cloud.'],
        ['Configuración', 'ENV selecciona LOCAL o GCP. El orden de configuración es entorno del proceso, APP_SECRETS_JSON, .env raíz y valores predeterminados.'],
        ['Entorno local', 'Generar el snapshot SQLite, iniciar FastAPI en el puerto 8000 y después Vite, que redirige /api al backend.'],
      ]),
      makeSection('Stack tecnológico', {
        backend: ['Backend', 'Python + FastAPI', 'clases personalizadas'],
        llm: ['LLM', 'Google AI Studio', 'API Gemini'],
        frontend: ['Frontend', 'React + Vite'],
        cloud: ['Cloud', 'Google Cloud Platform'],
        iac: ['Infraestructura como código', 'Terraform'],
        retrieval: ['Recuperación', 'SQLite local / Qdrant cloud'],
      }, [
        ['backend', 'llm'], ['backend', 'retrieval'], ['frontend', 'backend'],
        ['cloud', 'iac'], ['cloud', 'retrieval'],
      ], [
        ['Backend', 'Python y FastAPI proporcionan el backend; clases personalizadas gestionan utilidades, memoria y flujo sin un framework de agentes.'],
        ['Frontend', 'La interfaz está construida con React y Vite.'],
        ['Cloud', 'El README identifica Google Cloud Platform como plataforma cloud y Terraform como herramienta de infraestructura como código.'],
      ]),
      makeSection('Procesamiento de voz', {
        input: ['Pregunta', 'audio o texto'],
        stt: ['STT', 'audio → texto'],
        agent: ['Agente LLM', 'enrutamiento + RAG'],
        tts: ['TTS', 'texto → audio'],
        text: ['Respuesta de texto'],
        audio: ['Respuesta de voz'],
      }, [
        ['input', 'stt'], ['input', 'agent'], ['stt', 'agent'],
        ['agent', 'tts'], ['agent', 'text'], ['tts', 'audio'],
      ], [
        ['Pipeline', 'El pipeline personalizado sitúa el agente LLM entre las capas opcionales de voz a texto y texto a voz.'],
        ['Modos', 'full es audio a audio; stt es audio a texto; tts es texto a audio; text es texto a texto.'],
        ['Comportamiento del modo', 'El modo de la petición determina si STT y TTS se ejecutan alrededor del agente LLM en el mismo endpoint.'],
      ]),
      makeSection('Agente RAG', {
        question: ['Pregunta + parada'],
        intent: ['Intención', 'historia / restaurante'],
        embed: ['Embedding de pregunta'],
        filter: ['Filtrar metadatos', 'parada + tipo'],
        collection: ['Colección vectorial', 'fragmentos'],
        rank: ['Fragmentos relevantes', 'y fuentes'],
        generate: ['Agente LLM', 'generar respuesta'],
        answer: ['Respuesta + fuentes'],
      }, [
        ['question', 'intent'], ['question', 'embed'], ['intent', 'filter'],
        ['filter', 'collection'], ['embed', 'collection'], ['collection', 'rank'],
        ['rank', 'generate'], ['generate', 'answer'],
      ], [
        ['Metadatos guardados', 'Cada fragmento se almacena con el nombre de la parada y el tipo, como historia o restaurantes, junto con la información del documento.'],
        ['Recuperación', 'La parada actual y el tipo derivado de la intención filtran la colección; la pregunta se convierte en embedding para buscar fragmentos relevantes.'],
        ['Respuesta', 'El agente LLM genera una respuesta a partir de los fragmentos recuperados y devuelve las fuentes asociadas.'],
      ]),
      makeSection('Endpoints FastAPI', {
        client: ['Cliente frontend'],
        api: ['FastAPI', 'raíz local /api cloud'],
        health: ['GET /health', 'disponibilidad'],
        chat: ['POST /chat', 'texto / audio / NDJSON'],
        documents: ['GET /documents/{source}', 'PDF citado'],
        ready: ['GET /demo/ready', 'estado base conocimiento'],
        start: ['POST /demo/start', 'solicitar inicio VM'],
      }, [
        ['client', 'api'], ['api', 'health'], ['api', 'chat'],
        ['api', 'documents'], ['api', 'ready'], ['api', 'start'],
      ], [
        ['Petición de chat', 'POST /chat acepta query, mode, language y stop; request_type es opcional y stream habilita progreso y resultados NDJSON.'],
        ['Respuestas y fuentes', 'Los modos de texto devuelven JSON con text y sources; los modos de audio devuelven WAV con las fuentes en X-PDF-Sources.'],
        ['Disponibilidad y trazas', '/demo/ready comprueba la colección vectorial, /demo/start solicita iniciar la VM y las respuestas incluyen X-Request-ID.'],
      ]),
      makeSection('Frontend', {
        visitor: ['Visitante'],
        controls: ['Barra superior', 'idioma + modo de voz'],
        stop: ['Barra de ruta / mapa', 'seleccionar parada'],
        question: ['Preguntar', 'sugerida / texto / voz'],
        answer: ['Panel de guía', 'respuesta + progreso'],
        sources: ['Panel de fuentes', 'documentos + páginas'],
        pdf: ['PDF fuente', 'página citada'],
      }, [
        ['visitor', 'controls'], ['controls', 'stop'], ['stop', 'question'],
        ['question', 'answer'], ['answer', 'sources'], ['sources', 'pdf'],
      ], [
        ['Entrada', 'Los visitantes pueden elegir preguntas sugeridas, escribir un mensaje o grabar una pregunta por voz.'],
        ['Contexto y modo', 'La parada seleccionada en el mapa o la ruta establece el contexto RAG; el control de voz determina respuestas habladas o de texto.'],
        ['Acceso a las fuentes', 'El panel enumera los documentos y páginas de la última respuesta, y cada fuente enlaza con su PDF.'],
      ]),
      makeSection('Despliegue en Google Cloud Platform', {
        user: ['Navegador del usuario'],
        cloudrun: ['Cloud Run', 'React / + FastAPI /api'],
        gemini: ['API Gemini'],
        storage: ['Cloud Storage', 'prompts + documentos'],
        qdrant: ['VM Qdrant', 'fragmentos + embeddings'],
        secret: ['Secret Manager', 'APP_SECRETS_JSON'],
        registry: ['Artifact Registry', 'imagen del contenedor'],
        terraform: ['Terraform', 'recursos GCP'],
      }, [
        ['user', 'cloudrun'], ['registry', 'cloudrun'], ['terraform', 'cloudrun'],
        ['cloudrun', 'gemini'], ['cloudrun', 'storage'], ['cloudrun', 'qdrant'],
        ['secret', 'cloudrun'],
      ], [
        ['Contenedor único', 'Cloud Run sirve el frontend React en / y el backend FastAPI en /api.'],
        ['Servicios de runtime', 'Cloud Storage contiene prompts y PDFs; la VM Qdrant sirve los fragmentos de recuperación; Secret Manager proporciona APP_SECRETS_JSON.'],
        ['Configuración de despliegue', 'El README especifica una imagen linux/amd64, puerto 8080, usuario no root y Cloud Run con 2 CPU, 2 GiB y una instancia mínima/máxima.'],
      ]),
      makeSection('Infraestructura como código con Terraform', {
        merge: ['Fusionar PR de dev', 'en main'],
        auth: ['Workload Identity', 'Federation'],
        build: ['Construir + publicar', 'digest imagen inmutable'],
        plan: ['Terraform plan', 'comprobador de plan'],
        artifact: ['Plan guardado'],
        approval: ['Entorno prod', 'revisar + aprobar'],
        apply: ['Terraform apply', 'plan revisado'],
        deploy: ['Cloud Run', 'nueva revisión'],
      }, [
        ['merge', 'auth'], ['auth', 'build'], ['build', 'plan'],
        ['plan', 'artifact'], ['artifact', 'approval'], ['approval', 'apply'],
        ['apply', 'deploy'],
      ], [
        ['Activador del workflow', 'El despliegue se activa al fusionar en main un pull request de dev del mismo repositorio.'],
        ['Plan y aprobación', 'El workflow guarda un plan, comprueba que solo contenga cambios permitidos y espera su revisión en el entorno protegido prod.'],
        ['Controles de aplicación', 'Terraform aplica el plan revisado. El README también documenta digest de imagen inmutable, estado remoto, autenticación sin claves, recursos protegidos y ejecuciones serializadas.'],
      ]),
    ],
  },
}

const positions = [
  [10, 20], [290, 20], [570, 20], [850, 20],
  [10, 190], [290, 190], [570, 190], [850, 190],
]

export function getPliniusTechnical(language) {
  const content = copy[language]
  return {
    ...content,
    showOverview: false,
    slides: content.sections.map((section, index) => {
      const entries = Object.entries(section.nodes)
      const nodes = entries.map(([id, label], nodeIndex) => ({
        ...node(id, ...positions[nodeIndex], [
          'retrieval', 'sources', 'database', 'cloud', 'vectors', 'collection',
          'documents', 'storage', 'qdrant', 'secret', 'registry', 'artifact',
        ].includes(id) ? 'store' : 'service'),
        label,
      }))
      return [`${index + 1}. ${section.title}`, section.notes, {
        width: 1120,
        height: 300,
        section: index + 1,
        caption: `${index + 1} · ${section.title}`,
        nodes,
        edges: section.connections.map(([from, to]) => ({ from, to })),
      }]
    }),
  }
}
