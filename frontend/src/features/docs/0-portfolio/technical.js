function node(id, x, y, kind = 'service', width = 210, height = 76) {
  return { id, x, y, kind, width, height }
}

function edge(from, to, options = {}) {
  return { from, to, ...options }
}

const layouts = [
  {
    height: 260,
    icons: { gateway: 'react', auth: 'firebase', demos: 'gcp', foundation: 'cloudRun' },
    nodes: [node('reviewers', 10, 20), node('gateway', 290, 20), node('auth', 570, 20), node('demos', 850, 20), node('owner', 570, 170), node('foundation', 850, 170, 'store')],
    edges: [edge('reviewers', 'gateway'), edge('gateway', 'auth'), edge('auth', 'demos'), edge('owner', 'auth', { fromSide: 'top', toSide: 'bottom' }), edge('demos', 'foundation', { fromSide: 'bottom', toSide: 'top' })],
  },
  {
    height: 280,
    icons: { root: 'github', workflows: 'githubActions', portal: 'firebase', frontend: 'react', infra: 'terraform', server: 'node', files: ['docker', 'nginx'] },
    nodes: [
      node('root', 410, 10, 'store', 300, 76),
      ...['workflows', 'portal', 'frontend', 'infra', 'server', 'files'].map((id, index) => node(id, 10 + index * 185, 180, id === 'files' ? 'store' : 'service', 175, 90)),
    ],
    edges: ['workflows', 'portal', 'frontend', 'infra', 'server', 'files'].map(id => edge('root', id, { fromSide: 'bottom', toSide: 'top' })),
  },
  {
    height: 300,
    icons: { slides: ['tailwind', 'reveal'], ui: ['react', 'vite'], backend: ['node', 'express'], auth: 'firebase', actions: 'githubActions', terraform: 'terraform', gcp: 'gcp', docker: 'docker' },
    nodes: [node('slides', 10, 20), node('ui', 290, 20), node('backend', 570, 20), node('auth', 850, 20), node('actions', 10, 200), node('terraform', 290, 200), node('gcp', 570, 200), node('docker', 850, 200, 'store')],
    edges: [
      edge('slides', 'ui'), edge('ui', 'backend'), edge('backend', 'auth', { bidirectional: true }),
      edge('backend', 'docker', { fromSide: 'bottom', toSide: 'top', via: [[675, 145], [955, 145]] }),
      edge('docker', 'gcp'), edge('actions', 'terraform'), edge('terraform', 'gcp'),
    ],
  },
  {
    height: 356,
    icons: { portfolio: ['react', 'vite'], overview: 'reveal', vm: 'computeEngine', launch: 'vite' },
    nodes: [
      node('user', 10, 140, 'service', 190), node('portfolio', 235, 140, 'service', 190),
      node('overview', 460, 10, 'service', 190), node('video', 460, 140, 'service', 190), node('card', 460, 270, 'service', 190),
      node('slides', 685, 140, 'store', 190), node('modal', 685, 270, 'service', 190),
      node('vm', 910, 10, 'store', 190), node('app', 910, 140, 'service', 190), node('launch', 910, 270, 'service', 190),
    ],
    edges: [
      edge('user', 'portfolio'), edge('portfolio', 'overview'), edge('portfolio', 'video'), edge('portfolio', 'card'),
      edge('overview', 'slides', { fromSide: 'right', toSide: 'top', via: [[780, 48]] }),
      edge('card', 'modal'), edge('modal', 'slides', { fromSide: 'top', toSide: 'bottom' }),
      edge('modal', 'launch'), edge('launch', 'app', { fromSide: 'top', toSide: 'bottom' }),
      edge('launch', 'vm', { fromSide: 'right', toSide: 'right', via: [[1112, 308], [1112, 48]] }),
    ],
  },
  {
    height: 290,
    icons: { firebase: 'firebase', portal: 'firebase', verify: 'express', cookie: 'node' },
    nodes: [node('admin', 10, 20), node('firebase', 290, 20), node('protected', 850, 20, 'decision'), node('user', 10, 190), node('portal', 290, 190), node('verify', 570, 190), node('cookie', 850, 190, 'store')],
    edges: [
      edge('admin', 'firebase'), edge('user', 'portal'), edge('firebase', 'portal', { fromSide: 'bottom', toSide: 'top', label: 'idToken' }),
      edge('portal', 'verify'), edge('verify', 'firebase', { fromSide: 'top', toSide: 'right', via: [[675, 58]] }),
      edge('verify', 'cookie'), edge('cookie', 'protected', { fromSide: 'top', toSide: 'bottom' }),
    ],
  },
  {
    height: 380,
    icons: { secrets: 'secretManager', workflow: 'githubActions', registry: 'artifactRegistry', terraform: 'terraform', run: 'cloudRun', container: 'docker', auth: ['firebase', 'identityPlatform'], network: 'vpc' },
    nodes: [
      node('secrets', 10, 10, 'store'), node('workflow', 290, 10), node('registry', 570, 10, 'store'),
      node('terraform', 290, 150), node('run', 570, 150), node('container', 850, 150),
      node('user', 10, 290), node('auth', 290, 290), node('network', 850, 290, 'store'),
    ],
    edges: [
      edge('secrets', 'workflow'), edge('workflow', 'registry'), edge('workflow', 'terraform', { fromSide: 'bottom', toSide: 'top' }),
      edge('registry', 'run', { fromSide: 'bottom', toSide: 'top' }), edge('terraform', 'run'), edge('run', 'container'),
      edge('container', 'network', { fromSide: 'bottom', toSide: 'top', label: 'egress' }),
      edge('user', 'auth'), edge('user', 'run', { fromSide: 'top', toSide: 'bottom', via: [[115, 262], [675, 262]], label: 'https' }),
    ],
  },
  {
    height: 360,
    icons: { merge: 'github', build: 'docker', reuse: 'artifactRegistry', plan: 'terraform', apply: 'terraform', approval: 'githubActions', artifact: 'githubActions' },
    nodes: [
      node('merge', 10, 75), node('changed', 290, 75, 'decision'), node('build', 570, 10), node('reuse', 570, 140), node('plan', 850, 75),
      node('apply', 10, 270), node('approval', 290, 270, 'decision'), node('artifact', 570, 270, 'store'),
    ],
    edges: [
      edge('merge', 'changed'),
      edge('changed', 'build', { via: [[535, 113], [535, 48]], label: 'yes' }), edge('changed', 'reuse', { via: [[535, 113], [535, 178]], label: 'no' }),
      edge('build', 'plan', { via: [[815, 48], [815, 113]] }), edge('reuse', 'plan', { via: [[815, 178], [815, 113]] }),
      edge('plan', 'artifact', { fromSide: 'bottom', toSide: 'right', via: [[955, 308]] }),
      edge('artifact', 'approval'), edge('approval', 'apply'),
    ],
  },
]

const copy = {
  en: {
    audience: 'How it works?',
    source: 'Source: PersonalPortfolioRepo README · Sections 1–7',
    project: {
      subtitle: 'A schematic tour of the portfolio gateway',
      fullDescription: 'A React frontend and Express authentication backend packaged in one container, running on Google Cloud Run and managed with Terraform and GitHub Actions.',
      modalTags: ['React + Vite', 'Tailwind CSS', 'Reveal.js', 'Node.js + Express', 'Firebase Auth', 'Docker', 'Cloud Run', 'Terraform'],
    },
    edges: { idToken: 'ID token', egress: 'Private egress', https: 'HTTPS', yes: 'Yes', no: 'No' },
    sections: [
      {
        title: 'Business overview, use case and value',
        nodes: { reviewers: ['Clients, contractors', '+ hiring teams'], gateway: ['Portfolio gateway', 'Docs + videos'], auth: ['Firebase Auth', 'Authorized users'], demos: ['Demo apps', 'on GCP'], owner: ['Administrator', 'Manual user pool'], foundation: ['Low-cost base', 'Scales up'] },
        notes: [['Show, not list', 'Explanations, demo videos, and working applications show how knowledge becomes working solutions.', 'react'], ['Controlled access', 'Only authorized people can use the demos, rather than exposing LLM access to everyone.', 'lock'], ['Cost-effective start', 'A basic, low-cost foundation designed to scale and support more features over time.', 'gcp']],
      },
      {
        title: 'Repo structure',
        nodes: { root: ['PersonalPortfolioRepo/'], workflows: ['.github/', 'workflows/'], portal: ['auth-portal/', 'index.html'], frontend: ['frontend/', 'React app'], infra: ['infra/', 'Terraform'], server: ['server/', 'Auth backend'], files: ['Dockerfile', 'nginx template'] },
        notes: [['frontend/', 'The React web application: public assets plus application source and tests.', 'react'], ['server/ + auth-portal/', 'The Express backend handles authentication; the portal HTML provides the sign-in page.', 'node'], ['infra/ + workflows', 'Terraform files and deployment configuration, automated by GitHub Actions workflows.', 'terraform']],
      },
      {
        title: 'Tech stack',
        nodes: { slides: ['Tailwind CSS', 'Reveal.js'], ui: ['React + Vite', 'User interface'], backend: ['Node.js + Express', 'Serves the app'], auth: ['Firebase Admin', 'Tokens + cookies'], actions: ['GitHub Actions', 'Deployment'], terraform: ['Terraform', 'Cloud resources'], gcp: ['Google Cloud', 'Cloud Run'], docker: ['Docker image', 'Frontend + backend'] },
        notes: [['Frontend', 'React and Vite build the UI, Tailwind CSS styles it, and Reveal.js powers the HTML slide presentations.', 'react'], ['Backend and auth', 'Node.js and Express serve the app; Firebase Authentication via Identity Platform handles sign-in.', 'firebase'], ['Cloud and automation', 'Docker packages the app for GCP; Terraform manages resources and GitHub Actions deploys.', 'terraform']],
      },
      {
        title: 'Frontend',
        nodes: { user: ['Authorized user'], portfolio: ['Portfolio UI', 'React'], overview: ['Portfolio', 'explanation'], video: ['Video walkthrough', 'Video modal'], card: ['Project demo card'], slides: ['HTML slides', 'Business + technical'], modal: ['Project modal', 'Description + stack'], vm: ['PauHelper VM', 'Best-effort'], app: ['Demo application'], launch: ['Open demo', 'Build-time URL'] },
        notes: [['Three ways in', 'Open the slide explanation, watch a video walkthrough, or browse the project demo cards.', 'compass'], ['Project modal', 'Shows the description, technology stack, documentation links, and the button that opens the demo.', 'file'], ['Build-time URLs', 'Demo URLs come from env variables. PauHelper also gets a best-effort VM start; the demo never waits.', 'vite']],
      },
      {
        title: 'Authorization',
        nodes: { admin: ['Administrator', 'Provisions accounts'], firebase: ['Firebase Auth', 'Email + password'], protected: ['Protected request', 'Revoked / disabled?'], user: ['Invited user'], portal: ['Auth portal', 'Sign-in page'], verify: ['Express backend', 'Verify token'], cookie: ['Session cookie', 'Secure, HTTP-only'] },
        notes: [['Manual provisioning', 'Accounts are created by the administrator; public self-registration is disabled. No federated sign-in or OTPs.', 'userCheck'], ['Session cookies', 'After sign-in, the backend verifies the Firebase token and creates a secure, HTTP-only session cookie.', 'firebase'], ['Revocation', 'Protected requests check for revoked sessions or disabled accounts, so access can be withdrawn at any time.', 'lock']],
      },
      {
        title: 'Cloud infrastructure',
        nodes: { secrets: ['Secret Manager', 'Demo URLs'], workflow: ['GitHub Actions', 'Build + deploy'], registry: ['Artifact Registry', 'Docker images'], terraform: ['Terraform', 'Apply config'], run: ['Cloud Run', 'Service'], container: ['App container', 'React + Express'], user: ['User browser', 'Signs in'], auth: ['Firebase Auth', 'Identity Platform'], network: ['VPC + subnet', 'Direct VPC egress'] },
        notes: [['One Cloud Run service', 'A single container serves both the React frontend and the authentication backend.', 'cloudRun'], ['Supporting services', 'Artifact Registry stores images, Secret Manager holds config, and Identity Platform manages users.', 'gcp'], ['Not secret in the browser', 'Demo URLs are injected at build time and become part of the bundle, so they are public once deployed.', 'eye']],
      },
      {
        title: 'Infrastructure as code and versioning',
        nodes: { merge: ['dev PR merged', 'into main'], changed: ['App source', 'changed?'], build: ['Build + push image', 'Tag: commit SHA'], reuse: ['Reuse latest image'], plan: ['terraform plan'], apply: ['Apply', 'saved plan'], approval: ['Team approval', 'production env'], artifact: ['Plan artifact', 'Uploaded'] },
        notes: [['Stage 1: build and plan', 'Build and push a new image only when application source changed, then run terraform plan and upload it.', 'terraform'], ['Stage 2: approve and apply', 'The protected production environment waits for team approval, then applies the saved plan.', 'githubActions'], ['Traceable images', 'Tagging each image with the commit SHA ties every deployment to the source revision that built it.', 'docker']],
      },
    ],
  },
  es: {
    audience: '¿Cómo funciona?',
    source: 'Fuente: README de PersonalPortfolioRepo · Secciones 1–7',
    project: {
      subtitle: 'Un recorrido esquemático por el portal del portfolio',
      fullDescription: 'Un frontend React y un backend de autenticación Express empaquetados en un contenedor, ejecutados en Google Cloud Run y gestionados con Terraform y GitHub Actions.',
      modalTags: ['React + Vite', 'Tailwind CSS', 'Reveal.js', 'Node.js + Express', 'Firebase Auth', 'Docker', 'Cloud Run', 'Terraform'],
    },
    edges: { idToken: 'Token ID', egress: 'Salida privada', https: 'HTTPS', yes: 'Sí', no: 'No' },
    sections: [
      {
        title: 'Resumen de negocio, caso de uso y valor',
        nodes: { reviewers: ['Clientes, contratistas', '+ equipos de selección'], gateway: ['Portfolio', 'Docs + vídeos'], auth: ['Firebase Auth', 'Autorizados'], demos: ['Apps demo', 'en GCP'], owner: ['Administrador', 'Usuarios manuales'], foundation: ['Base económica', 'Escalable'] },
        notes: [['Mostrar, no enumerar', 'Explicaciones, vídeos y aplicaciones funcionales muestran cómo el conocimiento se convierte en soluciones.', 'react'], ['Acceso controlado', 'Solo las personas autorizadas usan las demos, en lugar de abrir el acceso a LLM a todo el mundo.', 'lock'], ['Inicio rentable', 'Una base sencilla y de bajo coste, diseñada para escalar y admitir más funciones.', 'gcp']],
      },
      {
        title: 'Estructura del repositorio',
        nodes: { root: ['PersonalPortfolioRepo/'], workflows: ['.github/', 'workflows/'], portal: ['auth-portal/', 'index.html'], frontend: ['frontend/', 'App React'], infra: ['infra/', 'Terraform'], server: ['server/', 'Backend auth'], files: ['Dockerfile', 'Plantilla nginx'] },
        notes: [['frontend/', 'La aplicación web React: recursos públicos, código fuente y pruebas.', 'react'], ['server/ + auth-portal/', 'El backend Express gestiona la autenticación; el HTML del portal ofrece la página de acceso.', 'node'], ['infra/ + workflows', 'Ficheros Terraform y configuración de despliegue, automatizados con workflows de GitHub Actions.', 'terraform']],
      },
      {
        title: 'Stack tecnológico',
        nodes: { slides: ['Tailwind CSS', 'Reveal.js'], ui: ['React + Vite', 'Interfaz de usuario'], backend: ['Node.js + Express', 'Sirve la app'], auth: ['Firebase Admin', 'Tokens + cookies'], actions: ['GitHub Actions', 'Despliegue'], terraform: ['Terraform', 'Recursos cloud'], gcp: ['Google Cloud', 'Cloud Run'], docker: ['Imagen Docker', 'Frontend + backend'] },
        notes: [['Frontend', 'React y Vite construyen la interfaz, Tailwind CSS la estiliza y Reveal.js genera las presentaciones HTML.', 'react'], ['Backend y autenticación', 'Node.js y Express sirven la app; Firebase Authentication con Identity Platform gestiona el acceso.', 'firebase'], ['Cloud y automatización', 'Docker empaqueta la app para GCP; Terraform gestiona los recursos y GitHub Actions despliega.', 'terraform']],
      },
      {
        title: 'Frontend',
        nodes: { user: ['Usuario autorizado'], portfolio: ['UI del portfolio', 'React'], overview: ['Explicación del', 'portfolio'], video: ['Vídeo demostrativo', 'Modal de vídeo'], card: ['Tarjeta de demo'], slides: ['Diapositivas HTML', 'Negocio + técnica'], modal: ['Modal del proyecto', 'Descripción + stack'], vm: ['VM PauHelper', 'Sin esperar'], app: ['Aplicación demo'], launch: ['Abrir demo', 'URL de build'] },
        notes: [['Tres puntos de entrada', 'Abrir la explicación en diapositivas, ver un vídeo demostrativo o explorar las tarjetas de demos.', 'compass'], ['Modal del proyecto', 'Muestra la descripción, el stack, los enlaces a documentación y el botón que abre la demo.', 'file'], ['URLs en compilación', 'Las URLs vienen de variables de entorno. PauHelper también arranca su VM sin que la demo espere.', 'vite']],
      },
      {
        title: 'Autorización',
        nodes: { admin: ['Administrador', 'Crea las cuentas'], firebase: ['Firebase Auth', 'Email + contraseña'], protected: ['Petición protegida', '¿Revocada / deshab.?'], user: ['Usuario invitado'], portal: ['Portal de acceso', 'Página de login'], verify: ['Backend Express', 'Verifica el token'], cookie: ['Cookie de sesión', 'Segura, HTTP-only'] },
        notes: [['Alta manual', 'El administrador crea las cuentas; el registro público está deshabilitado. Sin login federado ni OTP.', 'userCheck'], ['Cookies de sesión', 'Tras el acceso, el backend verifica el token de Firebase y crea una cookie de sesión segura y HTTP-only.', 'firebase'], ['Revocación', 'Las peticiones protegidas comprueban sesiones revocadas o cuentas deshabilitadas para retirar el acceso.', 'lock']],
      },
      {
        title: 'Infraestructura cloud',
        nodes: { secrets: ['Secret Manager', 'URLs de demos'], workflow: ['GitHub Actions', 'Build + despliegue'], registry: ['Artifact Registry', 'Imágenes Docker'], terraform: ['Terraform', 'Aplica la config'], run: ['Cloud Run', 'Servicio'], container: ['Contenedor', 'React + Express'], user: ['Navegador', 'Inicia sesión'], auth: ['Firebase Auth', 'Identity Platform'], network: ['VPC + subred', 'Direct VPC egress'] },
        notes: [['Un servicio Cloud Run', 'Un único contenedor sirve el frontend React y el backend de autenticación.', 'cloudRun'], ['Servicios de apoyo', 'Artifact Registry guarda imágenes, Secret Manager la configuración e Identity Platform los usuarios.', 'gcp'], ['Visibles en el navegador', 'Las URLs de demos se inyectan al compilar y forman parte del bundle, por lo que son públicas al desplegar.', 'eye']],
      },
      {
        title: 'Infraestructura como código y versionado',
        nodes: { merge: ['PR dev → main', 'fusionada'], changed: ['¿Cambió el código', 'de la app?'], build: ['Crear imagen', 'Tag: SHA commit'], reuse: ['Reutilizar imagen'], plan: ['terraform plan'], apply: ['Aplicar', 'plan guardado'], approval: ['Aprobación', 'production'], artifact: ['Artefacto', 'del plan'] },
        notes: [['Fase 1: build y plan', 'Crea y sube una imagen solo si cambió el código de la app; después ejecuta terraform plan y lo sube.', 'terraform'], ['Fase 2: aprobar y aplicar', 'El entorno protegido production espera la aprobación del equipo y aplica el plan guardado.', 'githubActions'], ['Imágenes trazables', 'Etiquetar cada imagen con el SHA del commit vincula cada despliegue con su revisión de código.', 'docker']],
      },
    ],
  },
}

export function getPortfolioTechnical(language) {
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
        nodes: layout.nodes.map(item => ({ ...item, icon: layout.icons[item.id], label: section.nodes[item.id] })),
        edges: layout.edges.map(item => ({ ...item, label: content.edges[item.label] })),
      }]
    }),
  }
}
