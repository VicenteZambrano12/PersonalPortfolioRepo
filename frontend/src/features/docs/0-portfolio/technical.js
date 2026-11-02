function node(id, x, y, label, kind = 'service') {
  return { id, x, y, width: 250, height: 76, label, kind }
}

function section(title, nodes, connections, notes) {
  return { title, nodes, connections, notes }
}

const positions = [
  [10, 20], [290, 20], [570, 20], [850, 20],
  [10, 190], [290, 190], [570, 190], [850, 190],
]

const copy = {
  en: {
    audience: 'How it works?',
    source: 'Source: PersonalPortfolioRepo README · Sections 2–7',
    project: {
      subtitle: 'A technical tour of the portfolio gateway',
      fullDescription: 'The portfolio combines a React frontend, a Node.js and Express authentication backend, Firebase Authentication managed through Google Cloud Identity Platform, and GCP infrastructure deployed with Docker, Terraform, and GitHub Actions.',
      modalTags: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'Firebase Authentication', 'Identity Platform', 'Docker', 'Terraform', 'GitHub Actions', 'Cloud Run'],
    },
    sections: [
      section('Repository structure', {
        root: ['PersonalPortfolioRepo'],
        frontend: ['frontend/', 'React application'],
        infra: ['infra/', 'Terraform configuration'],
        server: ['server/', 'Authentication backend'],
        portal: ['auth-portal/', 'Sign-in page'],
        workflows: ['.github/workflows/', 'Deployment workflows'],
        docker: ['Dockerfile'],
        nginx: ['nginx.conf.template'],
      }, [
        ['root', 'frontend'], ['root', 'infra'], ['root', 'server'],
        ['root', 'portal'], ['root', 'workflows'], ['root', 'docker'], ['root', 'nginx'],
      ], [
        ['Application modules', 'frontend contains the React portfolio; server contains the authentication backend.'],
        ['Authentication interface', 'auth-portal contains the HTML authentication portal served by the application.'],
        ['Delivery configuration', 'infra contains Terraform configuration; GitHub Actions workflows, Dockerfile, and Nginx template are at the repository root.'],
      ]),
      section('Tech stack', {
        user: ['Browser'],
        frontend: ['React + Vite', 'Tailwind CSS'],
        slides: ['Reveal.js', 'HTML presentations'],
        backend: ['Node.js + Express', 'Authentication backend'],
        firebase: ['Firebase Admin SDK', 'Token + session verification'],
        identity: ['Firebase Authentication', 'Google Cloud Identity Platform'],
        docker: ['Docker', 'Application container'],
        gcp: ['Google Cloud Platform'],
      }, [
        ['user', 'frontend'], ['frontend', 'slides'], ['frontend', 'backend'],
        ['backend', 'firebase'], ['firebase', 'identity'],
        ['backend', 'docker'], ['docker', 'gcp'],
      ], [
        ['Frontend', 'React and Vite provide the user interface, Tailwind CSS handles styling, and Reveal.js powers HTML slide presentations.'],
        ['Authentication', 'Node.js and Express serve the application; Firebase Authentication is managed through Google Cloud Identity Platform, and Firebase Admin SDK verifies tokens and session cookies.'],
        ['Infrastructure', 'Docker packages the frontend and backend into a container image running on Google Cloud Platform. Terraform and GitHub Actions manage infrastructure and deployment.'],
      ]),
      section('Frontend', {
        user: ['Authorized user'],
        portfolio: ['Portfolio frontend'],
        projects: ['Project cards', 'description + stack'],
        demos: ['Project demo', 'application link'],
        presentations: ['HTML presentations', 'business + technical'],
        videos: ['Video walkthroughs'],
        env: ['Build-time environment', 'demo URLs'],
        pauhelper: ['PauHelper demo', 'best-effort VM start'],
      }, [
        ['user', 'portfolio'], ['portfolio', 'projects'], ['projects', 'demos'],
        ['projects', 'presentations'], ['portfolio', 'videos'],
        ['env', 'demos'], ['demos', 'pauhelper'],
      ], [
        ['Portfolio content', 'Users can explore project cards, demo videos, and project applications.'],
        ['Project details', 'A project card opens a modal with the description, technology stack, and a button to open its application.'],
        ['Demo configuration', 'Demo URLs are configured through build-time environment variables. Clicking the PauHelper demo also sends a best-effort request to start its Qdrant VM without waiting to open the demo.'],
      ]),
      section('Authorization', {
        admin: ['Administrator'],
        provision: ['Manually provisioned', 'user accounts'],
        auth: ['Firebase Authentication', 'email + password'],
        portal: ['Authentication portal'],
        token: ['Firebase token'],
        server: ['Backend', 'verify token'],
        cookie: ['Secure, HTTP-only', 'session cookie'],
        check: ['Protected requests', 'check revoked / disabled'],
      }, [
        ['admin', 'provision'], ['provision', 'auth'], ['portal', 'auth'],
        ['auth', 'token'], ['token', 'server'], ['server', 'cookie'], ['cookie', 'check'],
      ], [
        ['Account access', 'Administrators manually provision accounts through Firebase Authentication; public self-registration is disabled.'],
        ['Sign-in method', 'The current implementation uses administrator-provided email/password accounts, not federated sign-in or one-time passwords.'],
        ['Session checks', 'After sign-in, the backend verifies the Firebase token and creates a secure, HTTP-only session cookie. Protected requests check for revoked credentials or disabled accounts.'],
      ]),
      section('Cloud infrastructure', {
        browser: ['User browser'],
        cloudrun: ['Cloud Run', 'application container'],
        app: ['React frontend', 'Express backend'],
        registry: ['Artifact Registry', 'container images'],
        identity: ['Firebase Authentication', 'Identity Platform'],
        secrets: ['Secret Manager', 'configuration values'],
        vpc: ['VPC + serverless subnet', 'Direct VPC egress'],
        terraform: ['Terraform'],
      }, [
        ['browser', 'cloudrun'], ['registry', 'cloudrun'], ['cloudrun', 'app'],
        ['app', 'identity'], ['secrets', 'terraform'], ['terraform', 'cloudrun'],
        ['cloudrun', 'vpc'],
      ], [
        ['Application service', 'Cloud Run runs the application container, which serves both the React frontend and authentication backend.'],
        ['Supporting services', 'Artifact Registry stores deployment images; Firebase Authentication / Identity Platform manages user accounts; Secret Manager stores configuration values.'],
        ['Private networking', 'A VPC and serverless subnet provide Cloud Run with Direct VPC egress for traffic to private network addresses.'],
      ]),
      section('Infrastructure as code and versioning', {
        merge: ['PR from dev', 'merged into main'],
        source: ['Application source', 'changed?'],
        build: ['Build + push image', 'commit SHA tag'],
        reuse: ['Reuse latest image', 'Artifact Registry'],
        plan: ['Terraform plan'],
        artifact: ['Saved plan', 'workflow artifact'],
        approve: ['Protected production', 'team approval'],
        apply: ['Apply saved plan'],
      }, [
        ['merge', 'source'], ['source', 'build'], ['source', 'reuse'],
        ['build', 'plan'], ['reuse', 'plan'], ['plan', 'artifact'],
        ['artifact', 'approve'], ['approve', 'apply'],
      ], [
        ['Workflow trigger', 'The GitHub Actions deployment workflow runs when a pull request from dev is merged into main.'],
        ['Build or reuse', 'When application source changes, the workflow builds and pushes an image tagged with the commit SHA. Otherwise it reuses the latest image in Artifact Registry.'],
        ['Review and apply', 'The workflow uploads the Terraform plan as an artifact, waits for team approval in the protected production environment, then applies the saved plan.'],
      ]),
    ],
  },
  es: {
    audience: '¿Cómo funciona?',
    source: 'Fuente: README de PersonalPortfolioRepo · Secciones 2–7',
    project: {
      subtitle: 'Recorrido técnico del portal del portfolio',
      fullDescription: 'El portfolio combina un frontend React, un backend de autenticación con Node.js y Express, Firebase Authentication gestionado mediante Google Cloud Identity Platform e infraestructura GCP desplegada con Docker, Terraform y GitHub Actions.',
      modalTags: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'Firebase Authentication', 'Identity Platform', 'Docker', 'Terraform', 'GitHub Actions', 'Cloud Run'],
    },
    sections: [
      section('Estructura del repositorio', {
        root: ['PersonalPortfolioRepo'],
        frontend: ['frontend/', 'aplicación React'],
        infra: ['infra/', 'configuración Terraform'],
        server: ['server/', 'backend de autenticación'],
        portal: ['auth-portal/', 'página de acceso'],
        workflows: ['.github/workflows/', 'workflows de despliegue'],
        docker: ['Dockerfile'],
        nginx: ['nginx.conf.template'],
      }, [
        ['root', 'frontend'], ['root', 'infra'], ['root', 'server'],
        ['root', 'portal'], ['root', 'workflows'], ['root', 'docker'], ['root', 'nginx'],
      ], [
        ['Módulos de aplicación', 'frontend contiene el portfolio React; server contiene el backend de autenticación.'],
        ['Interfaz de autenticación', 'auth-portal contiene el portal HTML de autenticación que sirve la aplicación.'],
        ['Configuración de entrega', 'infra contiene la configuración Terraform; los workflows de GitHub Actions, Dockerfile y plantilla Nginx están en la raíz del repositorio.'],
      ]),
      section('Stack tecnológico', {
        user: ['Navegador'],
        frontend: ['React + Vite', 'Tailwind CSS'],
        slides: ['Reveal.js', 'presentaciones HTML'],
        backend: ['Node.js + Express', 'backend de autenticación'],
        firebase: ['Firebase Admin SDK', 'verificación de tokens + sesión'],
        identity: ['Firebase Authentication', 'Google Cloud Identity Platform'],
        docker: ['Docker', 'contenedor de aplicación'],
        gcp: ['Google Cloud Platform'],
      }, [
        ['user', 'frontend'], ['frontend', 'slides'], ['frontend', 'backend'],
        ['backend', 'firebase'], ['firebase', 'identity'],
        ['backend', 'docker'], ['docker', 'gcp'],
      ], [
        ['Frontend', 'React y Vite proporcionan la interfaz, Tailwind CSS gestiona los estilos y Reveal.js permite las presentaciones HTML.'],
        ['Autenticación', 'Node.js y Express sirven la aplicación; Firebase Authentication se gestiona mediante Google Cloud Identity Platform y Firebase Admin SDK verifica tokens y cookies de sesión.'],
        ['Infraestructura', 'Docker empaqueta el frontend y el backend en una imagen de contenedor que se ejecuta en Google Cloud Platform. Terraform y GitHub Actions gestionan infraestructura y despliegues.'],
      ]),
      section('Frontend', {
        user: ['Usuario autorizado'],
        portfolio: ['Frontend del portfolio'],
        projects: ['Tarjetas de proyecto', 'descripción + stack'],
        demos: ['Demo del proyecto', 'enlace a aplicación'],
        presentations: ['Presentaciones HTML', 'negocio + técnica'],
        videos: ['Vídeos demostrativos'],
        env: ['Variables de build', 'URLs de demos'],
        pauhelper: ['Demo de PauHelper', 'inicio VM best-effort'],
      }, [
        ['user', 'portfolio'], ['portfolio', 'projects'], ['projects', 'demos'],
        ['projects', 'presentations'], ['portfolio', 'videos'],
        ['env', 'demos'], ['demos', 'pauhelper'],
      ], [
        ['Contenido del portfolio', 'Los usuarios pueden explorar tarjetas de proyectos, vídeos demostrativos y aplicaciones de proyectos.'],
        ['Detalles del proyecto', 'Una tarjeta abre un modal con la descripción, el stack tecnológico y un botón para abrir la aplicación.'],
        ['Configuración de demos', 'Las URLs se configuran mediante variables de entorno durante la compilación. Al hacer clic en la demo de PauHelper también se envía una petición best-effort para iniciar su VM Qdrant, sin esperar antes de abrir la demo.'],
      ]),
      section('Autorización', {
        admin: ['Administrador'],
        provision: ['Cuentas creadas', 'manualmente'],
        auth: ['Firebase Authentication', 'email + contraseña'],
        portal: ['Portal de autenticación'],
        token: ['Token Firebase'],
        server: ['Backend', 'verificar token'],
        cookie: ['Cookie de sesión', 'segura y HTTP-only'],
        check: ['Peticiones protegidas', 'comprobar revocación / cuenta'],
      }, [
        ['admin', 'provision'], ['provision', 'auth'], ['portal', 'auth'],
        ['auth', 'token'], ['token', 'server'], ['server', 'cookie'], ['cookie', 'check'],
      ], [
        ['Acceso de cuentas', 'El administrador crea manualmente las cuentas mediante Firebase Authentication; el registro público está deshabilitado.'],
        ['Método de acceso', 'La implementación actual utiliza cuentas de email y contraseña proporcionadas por el administrador, no inicio de sesión federado ni códigos de un solo uso.'],
        ['Comprobación de sesión', 'Tras el acceso, el backend verifica el token Firebase y crea una cookie de sesión segura y HTTP-only. Las peticiones protegidas comprueban credenciales revocadas o cuentas deshabilitadas.'],
      ]),
      section('Infraestructura cloud', {
        browser: ['Navegador del usuario'],
        cloudrun: ['Cloud Run', 'contenedor de aplicación'],
        app: ['Frontend React', 'backend Express'],
        registry: ['Artifact Registry', 'imágenes de contenedor'],
        identity: ['Firebase Authentication', 'Identity Platform'],
        secrets: ['Secret Manager', 'valores de configuración'],
        vpc: ['VPC + subred serverless', 'Direct VPC egress'],
        terraform: ['Terraform'],
      }, [
        ['browser', 'cloudrun'], ['registry', 'cloudrun'], ['cloudrun', 'app'],
        ['app', 'identity'], ['secrets', 'terraform'], ['terraform', 'cloudrun'],
        ['cloudrun', 'vpc'],
      ], [
        ['Servicio de aplicación', 'Cloud Run ejecuta el contenedor que sirve tanto el frontend React como el backend de autenticación.'],
        ['Servicios de apoyo', 'Artifact Registry almacena las imágenes; Firebase Authentication / Identity Platform gestiona cuentas; Secret Manager almacena valores de configuración.'],
        ['Red privada', 'Una VPC y una subred serverless proporcionan a Cloud Run Direct VPC egress para el tráfico hacia direcciones de red privadas.'],
      ]),
      section('Infraestructura como código y versionado', {
        merge: ['PR de dev', 'fusionado en main'],
        source: ['¿Cambió el código', 'de la aplicación?'],
        build: ['Construir + publicar', 'tag de commit SHA'],
        reuse: ['Reutilizar última imagen', 'Artifact Registry'],
        plan: ['Terraform plan'],
        artifact: ['Plan guardado', 'artefacto workflow'],
        approve: ['Producción protegida', 'aprobación del equipo'],
        apply: ['Aplicar plan guardado'],
      }, [
        ['merge', 'source'], ['source', 'build'], ['source', 'reuse'],
        ['build', 'plan'], ['reuse', 'plan'], ['plan', 'artifact'],
        ['artifact', 'approve'], ['approve', 'apply'],
      ], [
        ['Activador del workflow', 'El workflow de GitHub Actions se ejecuta al fusionar en main un pull request de dev.'],
        ['Crear o reutilizar', 'Si cambia el código de la aplicación, el workflow construye y publica una imagen etiquetada con el commit SHA. De lo contrario reutiliza la última imagen de Artifact Registry.'],
        ['Revisar y aplicar', 'El workflow sube el plan Terraform como artefacto, espera la aprobación del equipo en el entorno production protegido y aplica el plan guardado.'],
      ]),
    ],
  },
}

export function getPortfolioTechnical(language) {
  const content = copy[language]
  return {
    ...content,
    showOverview: false,
    slides: content.sections.map((item, index) => {
      const entries = Object.entries(item.nodes)
      const nodes = entries.map(([id, label], nodeIndex) => node(
        id,
        ...positions[nodeIndex],
        label,
        ['infra', 'identity', 'firebase', 'secrets', 'registry', 'gcp', 'artifact'].includes(id)
          ? 'store'
          : 'service',
      ))
      return [`${index + 2}. ${item.title}`, item.notes, {
        width: 1120,
        height: 300,
        section: index + 2,
        caption: `${index + 2} · ${item.title}`,
        nodes,
        edges: item.connections.map(([from, to]) => ({ from, to })),
      }]
    }),
  }
}
