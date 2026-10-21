function node(id, x, y, kind = 'service', width = 210, height = 76) {
  return { id, x, y, kind, width, height }
}

function edge(from, to, options = {}) {
  return { from, to, ...options }
}

const layouts = {
  3: {
    height: 300,
    nodes: [node('tools', 10, 20), node('config', 300, 20), node('install', 600, 20), node('api', 890, 20), node('assets', 300, 210, 'store'), node('gemini', 600, 210), node('vite', 890, 210)],
    edges: [edge('tools', 'config'), edge('config', 'install'), edge('install', 'api'), edge('assets', 'api', { fromSide: 'top', toSide: 'bottom', via: [[405, 145], [995, 145]] }), edge('api', 'gemini'), edge('vite', 'api', { bidirectional: true })],
  },
  4: {
    height: 340,
    nodes: [node('root', 450, 10), node('backend', 10, 140), node('frontend', 300, 140), node('infra', 600, 140), node('database', 890, 140, 'store'), node('workflow', 10, 250), node('scripts', 300, 250), node('package', 600, 250), node('docker', 890, 250)],
    edges: ['backend', 'frontend', 'infra', 'database', 'workflow', 'scripts', 'package', 'docker'].map(id => edge('root', id, { fromSide: 'bottom', toSide: 'top' })),
  },
  5: {
    height: 330,
    nodes: [node('react', 10, 20), node('api', 300, 20), node('python', 600, 20), node('gemini', 890, 20), node('docker', 10, 230), node('cloudrun', 300, 230), node('sql', 600, 230, 'store'), node('assets', 890, 230, 'store')],
    edges: [edge('react', 'api'), edge('api', 'python'), edge('python', 'gemini'), edge('docker', 'cloudrun'), edge('cloudrun', 'sql'), edge('cloudrun', 'assets', { fromSide: 'bottom', toSide: 'bottom', via: [[405, 320], [995, 320]] })],
  },
  6: {
    height: 400,
    nodes: [node('request', 10, 10), node('pipeline', 300, 10), node('router', 600, 10), node('dispatch', 890, 10, 'decision'), node('routine', 10, 170), node('exercise', 300, 170), node('history', 600, 170), node('fallback', 890, 170), node('store', 300, 310, 'store'), node('response', 600, 310)],
    edges: [
      edge('request', 'pipeline'), edge('pipeline', 'router'), edge('router', 'dispatch'),
      ...['routine', 'exercise', 'history', 'fallback'].map(id => edge('dispatch', id, { fromSide: 'bottom', toSide: 'top', via: [[995, 125], [layoutsColumn(id), 125]] })),
      ...['routine', 'exercise', 'history', 'fallback'].map(id => edge(id, 'store', { fromSide: 'bottom', toSide: 'top', via: [[layoutsColumn(id), 275], [405, 275]] })),
      edge('store', 'response'),
    ],
  },
  '6.1': {
    height: 360,
    nodes: [node('catalog', 10, 10), node('context', 300, 10), node('llm', 600, 10), node('validate', 890, 10, 'decision'), node('error', 890, 150), node('fallback', 600, 270), node('pipeline', 300, 270), node('agent', 10, 270)],
    edges: [
      edge('catalog', 'context'), edge('context', 'llm'), edge('llm', 'validate'),
      edge('validate', 'llm', { fromSide: 'bottom', toSide: 'bottom', via: [[995, 110], [705, 110]], label: 'retry' }),
      edge('validate', 'error', { label: 'exhausted' }),
      edge('validate', 'fallback', { fromSide: 'bottom', toSide: 'right', via: [[840, 115], [840, 308]], label: 'no_system' }),
      edge('validate', 'pipeline', { fromSide: 'bottom', toSide: 'top', via: [[995, 125], [405, 125]], label: 'valid' }),
      edge('pipeline', 'agent'),
    ],
  },
  '6.2': {
    height: 400,
    nodes: [node('context', 10, 10), node('decision', 300, 10), node('validate', 600, 10, 'decision'), node('complete', 890, 10, 'decision'), node('missing', 890, 150), node('catalog', 600, 150, 'store'), node('generate', 300, 150), node('plan', 10, 150, 'decision'), node('draft', 10, 310, 'store'), node('preview', 300, 310), node('confirm', 600, 310, 'decision'), node('persist', 890, 310, 'store')],
    edges: [
      edge('context', 'decision'), edge('decision', 'validate'), edge('validate', 'complete', { label: 'valid' }),
      edge('validate', 'decision', { fromSide: 'bottom', toSide: 'bottom', via: [[705, 110], [405, 110]], label: 'retry' }),
      edge('complete', 'missing', { label: 'no' }), edge('complete', 'catalog', { label: 'yes' }),
      edge('missing', 'context', { fromSide: 'bottom', toSide: 'bottom', via: [[995, 260], [245, 260], [245, 105], [115, 105]], label: 'followup' }),
      edge('catalog', 'generate'), edge('generate', 'plan'),
      edge('plan', 'generate', { fromSide: 'top', toSide: 'top', via: [[115, 125], [405, 125]], label: 'retry' }),
      edge('plan', 'draft', { label: 'valid' }), edge('draft', 'preview'), edge('preview', 'confirm'), edge('confirm', 'persist', { label: 'save' }),
      edge('confirm', 'context', { fromSide: 'bottom', toSide: 'left', via: [[705, 395], [0, 395], [0, 48]], label: 'changes' }),
    ],
  },
  '6.3': {
    height: 360,
    nodes: [node('query', 10, 10), node('extract', 300, 10), node('match', 600, 10), node('resolved', 890, 10, 'decision'), node('clarify', 890, 150), node('records', 600, 270, 'store'), node('explain', 300, 270), node('response', 10, 270)],
    edges: [
      edge('query', 'extract'), edge('extract', 'match'), edge('match', 'resolved'),
      edge('extract', 'clarify', { fromSide: 'bottom', toSide: 'left', via: [[405, 125], [850, 125], [850, 188]], label: 'empty' }),
      edge('resolved', 'clarify', { label: 'no' }),
      edge('clarify', 'query', { fromSide: 'bottom', toSide: 'bottom', via: [[995, 245], [115, 245]], label: 'followup' }),
      edge('resolved', 'records', { fromSide: 'right', toSide: 'right', via: [[1110, 48], [1110, 308]], label: 'yes' }),
      edge('records', 'explain'), edge('explain', 'response'),
    ],
  },
  '6.4': {
    height: 400,
    nodes: [node('query', 10, 10), node('route', 300, 10), node('validate', 600, 10, 'decision'), node('error', 890, 10), node('latest', 10, 170, 'store'), node('compare', 300, 170, 'store'), node('weekly', 600, 170, 'store'), node('rows', 890, 170, 'store'), node('explain', 890, 310), node('response', 600, 310), node('view', 300, 310)],
    edges: [
      edge('query', 'route'), edge('route', 'validate'),
      edge('validate', 'route', { fromSide: 'bottom', toSide: 'bottom', via: [[705, 110], [405, 110]], label: 'retry' }),
      edge('validate', 'error', { label: 'exhausted' }),
      ...['latest', 'compare', 'weekly'].map((id, index) => edge('validate', id, { fromSide: 'bottom', toSide: 'top', via: [[705, 125], [115 + index * 295, 125]] })),
      ...['latest', 'compare', 'weekly'].map((id, index) => edge(id, 'rows', { fromSide: 'bottom', toSide: 'bottom', via: [[115 + index * 295, 275], [995, 275]] })),
      edge('rows', 'explain'), edge('explain', 'response'), edge('response', 'view'),
    ],
  },
  '6.5': {
    height: 310,
    nodes: [node('session', 10, 10), node('turns', 300, 10, 'store'), node('pipeline', 600, 10), node('response', 890, 10), node('scope', 10, 210), node('draft', 300, 210, 'store'), node('routine', 600, 210), node('sql', 890, 210, 'store')],
    edges: [
      edge('session', 'turns'), edge('turns', 'pipeline'), edge('pipeline', 'response'),
      edge('response', 'turns', { fromSide: 'bottom', toSide: 'bottom', via: [[995, 135], [405, 135]], label: 'success' }),
      edge('scope', 'draft'), edge('draft', 'routine', { bidirectional: true }), edge('routine', 'sql', { label: 'confirm' }),
    ],
  },
  7: {
    height: 390,
    nodes: [node('users', 10, 10, 'store', 490, 110), node('routines', 610, 10, 'store', 500, 110), node('exercises', 10, 200, 'store', 490, 180), node('sets', 610, 200, 'store', 500, 180)],
    edges: [
      edge('users', 'routines', { label: 'owns' }), edge('routines', 'sets', { label: 'contains' }),
      edge('users', 'sets', { fromSide: 'bottom', toSide: 'top', via: [[255, 155], [860, 155]], label: 'records' }),
      edge('exercises', 'sets', { label: 'identifies' }),
    ],
  },
  8: {
    height: 390,
    nodes: [node('client', 10, 155), node('api', 300, 155), node('health', 650, 10, 'service', 450, 60), node('chat', 650, 85, 'service', 450, 76), node('users', 650, 176, 'service', 450, 60), node('routines', 650, 251, 'service', 450, 60), node('workouts', 650, 326, 'service', 450, 60)],
    edges: [edge('client', 'api'), ...['health', 'chat', 'users', 'routines', 'workouts'].map(id => edge('api', id))],
  },
  9: {
    height: 380,
    nodes: [node('startup', 10, 10), node('health', 300, 10), node('session', 600, 10), node('workspace', 890, 10, 'decision'), node('chat', 10, 150), node('stream', 300, 150), node('views', 600, 150), node('save', 890, 150), node('routine', 10, 290), node('edit', 300, 290), node('workout', 600, 290), node('activity', 890, 290)],
    edges: [
      edge('startup', 'health'), edge('startup', 'session', { fromSide: 'bottom', toSide: 'bottom', via: [[115, 115], [705, 115]] }),
      edge('health', 'workspace', { fromSide: 'top', toSide: 'top', via: [[405, 0], [995, 0]] }), edge('session', 'workspace'),
      edge('workspace', 'chat', { fromSide: 'bottom', toSide: 'top', via: [[995, 125], [115, 125]] }),
      edge('workspace', 'routine', { fromSide: 'right', toSide: 'left', via: [[1110, 48], [1110, 265], [0, 265], [0, 328]] }),
      edge('chat', 'stream'), edge('stream', 'views'), edge('views', 'save'),
      edge('routine', 'edit'),
      edge('routine', 'workout', { fromSide: 'bottom', toSide: 'bottom', via: [[115, 375], [705, 375]] }),
      edge('workout', 'activity'),
    ],
  },
  10: {
    height: 400,
    nodes: [node('delivery', 10, 10), node('registry', 300, 10, 'store'), node('state', 600, 10, 'store'), node('runtime', 890, 10), node('browser', 10, 170), node('cloudrun', 300, 170), node('memory', 600, 170, 'store'), node('sql', 890, 170, 'store'), node('gemini', 10, 310), node('images', 300, 310, 'store'), node('secrets', 600, 310, 'store')],
    edges: [
      edge('delivery', 'registry'), edge('delivery', 'state', { fromSide: 'top', toSide: 'top', via: [[115, 0], [705, 0]] }),
      edge('registry', 'cloudrun'), edge('browser', 'cloudrun', { label: 'https' }), edge('cloudrun', 'memory', { bidirectional: true }),
      edge('cloudrun', 'sql', { fromSide: 'bottom', toSide: 'bottom', via: [[405, 275], [995, 275]], label: 'tls' }),
      edge('runtime', 'cloudrun', { fromSide: 'bottom', toSide: 'top', via: [[995, 125], [405, 125]] }),
      edge('cloudrun', 'gemini', { fromSide: 'bottom', toSide: 'top', via: [[405, 270], [115, 270]] }),
      edge('cloudrun', 'images'), edge('cloudrun', 'secrets', { fromSide: 'bottom', toSide: 'top', via: [[405, 285], [705, 285]] }),
    ],
  },
  11: {
    height: 390,
    nodes: [node('merge', 10, 10), node('auth', 300, 10), node('changed', 600, 10, 'decision'), node('build', 890, 10), node('reuse', 890, 150), node('plan', 600, 150), node('artifact', 300, 150, 'store'), node('approval', 10, 150, 'decision'), node('stop', 10, 300), node('apply', 300, 300), node('state', 600, 300, 'store'), node('verify', 890, 300)],
    edges: [
      edge('merge', 'auth'), edge('auth', 'changed'), edge('changed', 'build', { label: 'yes' }),
      edge('changed', 'reuse', { fromSide: 'bottom', toSide: 'left', via: [[705, 125], [850, 125], [850, 188]], label: 'no' }),
      edge('build', 'plan'), edge('reuse', 'plan'), edge('plan', 'artifact'), edge('artifact', 'approval'),
      edge('approval', 'stop', { label: 'rejected' }),
      edge('approval', 'apply', { fromSide: 'right', toSide: 'top', via: [[255, 188], [255, 265], [405, 265]], label: 'approved' }),
      edge('apply', 'state'), edge('state', 'verify'),
    ],
  },
}

function layoutsColumn(id) {
  return { routine: 115, exercise: 405, history: 705, fallback: 995 }[id]
}

const sectionIds = ['3', '4', '5', '6', '6.1', '6.2', '6.3', '6.4', '6.5', '7', '8', '9', '10', '11']

const copy = {
  en: {
    audience: 'How it works?',
    source: 'Source: Orchestrator App README · Technical sections 3–11, including 6.1–6.5',
    project: {
      subtitle: 'Form: a schematic tour from intent routing to deployment',
      fullDescription: 'A React fitness application backed by FastAPI, custom Python agents, controlled SQL access, and GCP infrastructure with Neon PostgreSQL.',
      modalTags: ['React + Vite', 'FastAPI', 'Python', 'Pydantic', 'Gemini', 'SQLite / Neon PostgreSQL', 'Terraform', 'GCP'],
    },
    edges: {
      yes: 'Yes', no: 'No', retry: 'Invalid: retry', exhausted: '3 failures',
      valid: 'Valid', no_system: 'no_system', empty: 'No names', followup: 'User clarifies',
      save: 'Confirm save', changes: 'Request changes', success: 'Append success', confirm: 'Confirm',
      owns: '1:N owns', records: '1:N records', contains: '1:N contains', identifies: '1:N identifies',
      https: 'HTTPS', tls: 'Pooled TLS', rejected: 'Rejected', approved: 'Approved / no rule',
    },
    sections: [
      {
        title: 'Dependencies, installation, and local execution',
        nodes: { tools: ['Git + Node 22.12+', 'Python 3.12 + uv'], config: ['Root .env', 'MODE=LOCAL', 'SQL_DATABASE_TYPE=sqlite'], install: ['backend: uv sync', '--locked --python 3.12', 'frontend: npm ci'], api: ['Uvicorn / FastAPI', '127.0.0.1:8000'], assets: ['Bundled gym_app.db', 'database/images'], gemini: ['Gemini API', 'Key + model + quota'], vite: ['Vite :5173', '/api -> :8000', 'Strip /api prefix'] },
        notes: [['Configure and install', 'Use the backend project, not the root Python package. Set SQLITE_DATABASE_PATH, GEMINI_API_KEY and a nonblank LLM_MODEL; process variables override .env.'], ['Run and check', 'Run Uvicorn and Vite separately. /health checks liveness, not Gemini or SQL. Built assets can instead run with python -m server on :8080, API under /api.'], ['Keep the demo assets', 'Preserve the bundled SQLite database and images; local writes change the database. No local Redis, PostgreSQL, cloud migration, or Docker is required. Gemini still needs internet and quota.']],
      },
      {
        title: 'Repository structure',
        nodes: { root: ['OrchestratorApp/'], backend: ['backend/', 'src/ + tests/', 'pyproject.toml'], frontend: ['frontend/', 'src/ + tests/', 'public/ + package.json'], infra: ['infra/', 'modules/', 'environments/prod/'], database: ['database/', 'gym_app.db', 'database_schema.json'], workflow: ['.github/workflows/', 'terraform-deploy.yml'], scripts: ['scripts/', 'migrate_database.py', 'migrate_images.py'], package: ['src/orchestratorapp/', 'Root Python package'], docker: ['Dockerfile', 'Multi-stage image'] },
        notes: [['Application modules', 'backend contains the API, orchestration and agents; frontend contains React and browser tests. The separate root Python package is not the API development project.'], ['Infrastructure and delivery', 'infra modules cover artifact_registry, cloudrun, database, secrets and storage. Production composition is in environments/prod; bootstrap scripts live in infra/scripts.'], ['Supporting assets', 'database includes SQLite and its schema reference. scripts migrates records and images and registers exercise images; .github/workflows contains the deployment workflow.']],
      },
      {
        title: 'Technology stack used',
        nodes: { react: ['React + Vite', 'Tailwind CSS'], api: ['Python / FastAPI', 'uv dependencies'], python: ['Custom Python classes', 'Pydantic validation'], gemini: ['Gemini API', 'Google AI Studio'], docker: ['Docker + Terraform', 'GitHub Actions'], cloudrun: ['Cloud Run', 'Frontend + backend'], sql: ['Local: SQLite', 'Cloud: Neon PostgreSQL'], assets: ['Cloud Storage images', 'Secret Manager'] },
        notes: [['Backend', 'Custom Python classes coordinate agents and API calls rather than an agent orchestration framework. Pydantic validates structured outputs; Gemini supplies the AI models.'], ['Frontend', 'React uses Vite and its React plugin for builds, with Tailwind CSS styling. The UI/UX Pro Max skill with Claude supported interface design.'], ['Delivery and services', 'Docker packages one frontend/backend image. Terraform and GitHub Actions manage delivery; Artifact Registry stores images, Neon stores SQL data, and GCP provides hosting, images and secrets.']],
      },
      {
        title: 'How the agent system works',
        nodes: { request: ['POST /{id}/chat', 'query + EN / ES', 'Optional user_id'], pipeline: ['Pipeline', 'Latest 2 session turns'], router: ['Orchestrator', 'Select routing ID only'], dispatch: ['Validated ID', 'Pipeline invokes one'], routine: ['routine_maker'], exercise: ['exercise_explainer'], history: ['past_routines_analyzer'], fallback: ['no_system', 'Configured EN / ES text'], store: ['Store successful turn', 'Session conversation'], response: ['subsystem + response', 'JSON or NDJSON result'] },
        notes: [['Separation of responsibilities', 'The orchestrator selects an ID; it neither answers nor executes an agent. The pipeline invokes only the selected subsystem with the original query, language and relevant context.'], ['Context and scope', 'Session id provides conversation context. Routine creation and history analysis also require user_id; the chat endpoint supplies the latest two session turns.'], ['Output and failure', 'JSON returns subsystem + response. NDJSON adds progress and a terminal result or error. A valid no_system uses configured text without another LLM call; routing failures are errors, not fallbacks.']],
      },
      {
        title: 'First step: the orchestrator',
        nodes: { catalog: ['systems.json', 'IDs + descriptions'], context: ['System instructions', 'query + systems + language', '+ optional memory'], llm: ['Gemini routing call', 'One plain-text ID'], validate: ['Pydantic', 'Allowed strict string?'], error: ['Raise routing error', 'No silent selection'], fallback: ['Configured fallback', 'EN / ES; no LLM call'], pipeline: ['Pipeline dispatch', 'Valid subsystem ID'], agent: ['Selected agent', 'Execute separately'] },
        notes: [['Routing contract', 'Explicitly validate EN or ES. The LLM receives the selected code, not the language map; return one plain-text ID, not JSON, explanation, an answer or a tool call.'], ['Allowed results', 'routine_maker creates or modifies plans; exercise_explainer explains technique; past_routines_analyzer retrieves training history. Unsupported requests use no_system.'], ['Validation and retries', 'Reject invented IDs and extra text; log rejection and retry with the same context, three attempts total. Exhaustion, provider and configuration failures propagate; no_system alone uses the predefined fallback.']],
      },
      {
        title: 'Routine Maker',
        nodes: { context: ['Session + user state', 'Saved plans + catalog'], decision: ['LLM: action + parameters', 'create / update / save'], validate: ['Pydantic decision', 'Valid JSON?'], complete: ['Merge cached values', 'All 4 parameters?'], missing: ['LLM: ask missing values', 'Cache needs_parameters'], catalog: ['Exercise catalog', 'At or below user level'], generate: ['LLM: routine JSON', 'Instructions + schema'], plan: ['Validate plan', 'Catalog + constraints'], draft: ['Cache unsaved draft', 'Unique draft_id'], preview: ['awaiting_confirmation', 'routine_id = null'], confirm: ['User decision', 'Preview / revise / save'], persist: ['Persist new version', 'Make current routine'] },
        notes: [['Requirements', 'routine_type: weider or ppl; days_per_week: 1–7; hours_per_session: >0 and ≤24; level: beginner, intermediate or advanced. Validate before completeness; merge turns without invented defaults.'], ['Plan schema', 'Routine: name, summary, days, recovery. Day: day, day_type, info, duration_minutes, exercises. Exercise: exercise_id, name, sets, reps, rest_seconds, notes. Names come from the catalog; no prescribed weights.'], ['Validate, then confirm', 'Decision and plan validation each allow three attempts; exhaustion errors. Check consecutive days, duration, sets/rest, catalog IDs and duplicates. Generation only caches a draft; explicit confirmation saves and activates it. Direct POST save needs no LLM call.']],
      },
      {
        title: 'Exercise Explainer',
        nodes: { query: ['Query + EN / ES', 'Optional recent memory'], extract: ['LLM: exercises + message', 'Pydantic extraction'], match: ['Read catalog ID + name', 'Normalize / match in Python'], resolved: ['All names resolved', 'confidently?'], clarify: ['Ask exact name / variant', 'Up to 3 candidates', 'Do not guess or subset'], records: ['Deduplicate in order', 'Parameterized full records'], explain: ['One LLM call per exercise', 'Reject blank explanation'], response: ['List, even for 1 exercise', 'DB facts + llm_explanation'] },
        notes: [['Extract and resolve', 'Translate Spanish exercise names to English while preserving variants/equipment. No name means clarification, not inference from a muscle or equipment. Prefer unique exact matches; fuzzy score ≥0.78 and lead ≥0.08.'], ['Response schema', 'Preserve id, name, description, instructions, icon_url and anatomy_diagram_url. Decode media_url into media_urls: null or exactly two paths. Only llm_explanation is generated; there is no separate muscle-group field.'], ['Generation and errors', 'Explain purpose, muscles, setup, execution, breathing, mistakes and safety for each unique match. Any unresolved name stops all explanations. No three-attempt repair loop; validation, provider and SQL failures propagate.']],
      },
      {
        title: 'Past Routines Analyzer',
        nodes: { query: ['Query + language', 'user_id + optional memory'], route: ['Sub-orchestrator LLM', 'route + day_type JSON'], validate: ['Pydantic route/filter', 'Allowlist + normalization'], error: ['Raise routing error', 'No arbitrary SQL'], latest: ['past_day_exercise', 'Latest workout', 'user_id + day_type'], compare: ['compare_last_two_workouts', 'Latest 2 workouts', 'user_id + day_type'], weekly: ['weekly_performance', 'Today + 6 preceding days', 'user_id; day_type = null'], rows: ['Static SQL templates', 'Bound parameters', 'Unchanged database rows'], explain: ['LLM: explain records', 'No invented history'], response: ['Validated envelope', 'route, day_type,', 'data, llm_explain'], view: ['Predefined React report', 'Statistics from data'] },
        notes: [['Routes and filters', 'Latest workout, last-two comparison, or last seven calendar days including today. day_type is an optional English training keyword matched against routine names, not a weekday; weekly requires null. Unclear intent defaults to latest.'], ['Retrieval schema', 'Bind user_id for every route. Rows include session/date, day, exercise/order, muscle, set/reps, weight/unit, duration, distance and RPE. Comparison training_rank is 1 for latest, 2 for previous. No model-generated SQL.'], ['Grounded reports', 'Routing gets three attempts. Only llm_explain is generated; data stays unchanged. Empty history is explicit; one session cannot support a two-session comparison. React computes visualizations from data; invalid/blank output and provider/SQL failures error.']],
      },
      {
        title: 'Memory',
        nodes: { session: ['session_id', 'Conversation scope'], turns: ['Process-local fakeredis', 'Stored conversation turns'], pipeline: ['Read latest 2 turns', 'Chronological context'], response: ['Successful response'], scope: ['session_id + user_id', 'Routine workflow scope'], draft: ['Requirements + draft', 'Confirmation state'], routine: ['Routine Maker'], sql: ['Persistent SQL', 'Saved plans + workouts'] },
        notes: [['Conversation context', 'Read the latest two turns, or fewer when unavailable. This is a retrieval limit, not a cap on stored turns. Successful turns append to the session history; user_id does not filter conversation retrieval.'], ['Workflow state', 'Routine requirements, draft and confirmation state use both session_id and user_id. The shared store comes from redis_deps and RedisClient; user_id also scopes SQL routines and workouts.'], ['Durability boundary', 'fakeredis is local to one backend process: lost on restart and not shared between processes. No persistent Redis service or long-term conversational memory is implemented. SQL records are application data, not conversation memory.']],
      },
      {
        title: 'Databases and image storage',
        nodes: { users: ['dim_users', 'id, username, weight_unit, created_at'], routines: ['dim_routines', 'id, user_id, name, description', 'is_active, updated_at, created_at'], exercises: ['dim_exercises', 'id, name, description, instructions', 'primary_muscle, secondary_muscles', 'pattern, equipment, level, tracking_type', 'media_url, icon_url, anatomy_diagram_url'], sets: ['fact_workout_sets', 'id, user_id, routine_id, exercise_id', 'training_id, exercise_order, set_number', 'reps, weight, duration_seconds', 'distance_meters, rpe, created_at'] },
        notes: [['Schema and providers', 'SQLite locally and Neon PostgreSQL in cloud share this logical schema. description serializes modern routine content/metadata. training_id groups sessions; null legacy template sets are excluded from analysis. Migration is separate from Terraform.'], ['SQL boundary', 'SQLClient translates ? / :parameter placeholders to psycopg without value interpolation. Transactions commit or roll back and close; SQLite enforces foreign keys. Cloud DATABASE_URL requires TLS; configuration/query errors never silently switch providers.'], ['External image assets', 'SQL stores references, not bytes. MODE selects bundled database/images or private GCS images/ objects read by the runtime identity. API serves /database/images, or /api/database/images when combined. Image migration is independent of builds.']],
      },
      {
        title: 'FastAPI backend',
        nodes: { client: ['Client', 'Request / response models'], api: ['FastAPI', 'Pydantic validation'], health: ['GET /health', 'Liveness only'], chat: ['POST /{id}/routine/save', 'POST /{id}/chat', 'POST /{id}/key'], users: ['GET /users', 'POST /users'], routines: ['GET /users/{user_id}/routine', 'PUT /users/{user_id}/routine'], workouts: ['POST /users/{user_id}/workouts', 'GET /users/{user_id}/days'] },
        notes: [['Contracts and transport', 'ChatRequest: nonblank query, EN/ES, optional positive user_id, client_saves_routine=false. ChatResponse: subsystem + response. JSON by default; Accept: application/x-ndjson adds progress, heartbeats and terminal result/error. IDs are not authentication.'], ['Routine and workout models', 'PUT takes RoutinePlan itself; preview confirmation pairs session_id + draft_id and requires an exact plan match. GET/PUT expose X-Routine-Id. WorkoutRequest: positive routine_id + nonempty sets; exercise_id positive, positive reps/time/distance, weight ≥0, RPE 1–10.'], ['Profiles, docs and failures', 'Username: 1–80 trimmed characters; units kg/lbs. Users/workouts create with 201; other successes use 200. /docs, /redoc, /openapi.json expose schemas. Input: 422; unknown: 404; conflict: 409; failures: 500. Stream execution errors are in-band after 200.']],
      },
      {
        title: 'Frontend',
        nodes: { startup: ['App startup', 'Parallel prerequisites'], health: ['GET /health', 'Liveness + retry'], session: ['GET /users -> first profile', 'POST /{id}/key'], workspace: ['Both succeed?', 'MainView workspace'], chat: ['AI Chat', 'query + EN/ES + user_id'], stream: ['NDJSON progress', 'Normalize terminal JSON'], views: ['Predefined React views', 'Cards / preview / reports'], save: ['Explicit save', 'PUT exact cached preview'], routine: ['My Routine', 'GET + X-Routine-Id'], edit: ['Edit future targets', 'PUT new active version'], workout: ['Actual performed sets', 'POST workout + receipt'], activity: ['GET /users/{user_id}/days', '7 UTC dates + logged flags'] },
        notes: [['Startup and chat', 'Show a skeleton until health and session setup succeed; separate failure/retry screens. Chat uses client_saves_routine=true, streams progress and blocks overlapping mutations. Response type selects cards, previews, reports or Markdown.'], ['Plan versus performance', 'Save previews via PUT with session_id, draft_id and language, including save_requested confirmations. My Routine edits create new versions; completed sets POST to workouts. Timers and unsaved edits are local. Failed saves retain drafts or workout inputs for retry.'], ['Profiles, reset and inspection', 'Selectable profiles are not password-protected accounts. Switching initializes the new session before remounting. New Chat resets memory/drafts only after backend confirmation, not SQL history. EN/ES, themes and workflow monitor show execution metadata, not private reasoning.']],
      },
      {
        title: 'Cloud infrastructure',
        nodes: { delivery: ['GitHub Actions + Terraform', 'Deployment identity'], registry: ['Artifact Registry', 'Immutable image digest'], state: ['Separate GCS backend', 'State + locks', 'Deployment access only'], runtime: ['Runtime service account', 'Separate least privilege'], browser: ['User browser', 'Public managed ingress'], cloudrun: ['Cloud Run: React + API', '0–1 instance, 1 vCPU', '512 MiB; port 8080'], memory: ['In-process fakeredis', 'Ephemeral turns + drafts'], sql: ['Neon PostgreSQL', 'Persistent data; free plan'], gemini: ['Gemini API'], images: ['Private GCS bucket', 'Read images/ prefix'], secrets: ['Secret Manager', 'Read-only app JSON', 'Separate DB secret'] },
        notes: [['One cloud-oriented image', 'Node 22 builds React, Python 3.12 + uv installs locked backend dependencies, then a non-root Python runtime serves both at :8080. Build targets linux/amd64; MODE=CLOUD by default. Local SQLite/images are not copied into the image.'], ['Separate identities and storage', 'Runtime reads required secrets and private images, not Terraform state. The state bucket is pre-existing; populated app-secret versions are supplied outside Terraform. Public Cloud Run ingress does not make secrets/buckets public or implement app authentication.'], ['Demo limitations', 'Scales to zero; fakeredis disappears on shutdown, restart or rollout. One instance is not durable. External Redis wiring is not provisioned. No VPC, subnet, connector, private database route or CloudFront is configured.']],
      },
      {
        title: 'Infrastructure as Code (IaC) and Terraform',
        nodes: { merge: ['dev PR merged into main', 'Start deployment jobs'], auth: ['Workload Identity', 'Deployment service account'], changed: ['Application source', 'changed?'], build: ['Buildx linux/amd64', 'Push image -> digest'], reuse: ['Reuse existing image', 'Resolve immutable digest'], plan: ['fmt -> init -> validate', 'plan with image digest'], artifact: ['Show + upload tfplan', 'Short-lived artifact'], approval: ['prod reviewers?', 'Conditional review gate'], stop: ['Apply does not run'], apply: ['Same revision + auth', 'Download plan + init', 'apply saved plan'], state: ['Shared remote state', 'Serialized prod runs'], verify: ['Revision + image ready', 'API + frontend checks', 'Verified release'] },
        notes: [['Trigger and artifact', 'Two branches, dev/main, one cloud environment; development is local. Only a merged dev-to-main PR starts deployment jobs. New builds use the revision tag and immutable sha256 digest as app_container_image; otherwise reuse an image.'], ['Plan and approval', 'build-and-plan checks fmt, init, validate and plan; it does not apply, but can publish/prune images. The prod environment does not enforce review by itself: required reviewers must be configured. PR review and deploy approval are separate.'], ['Apply and verify', 'Apply checks out the same revision, authenticates, downloads tfplan, initializes the same backend and applies that saved plan. Verify revision readiness, expected image, health and frontend; failures stay visible. Production runs are serialized.']],
      },
    ],
  },
  es: {
    audience: '¿Cómo funciona?',
    source: 'Fuente: README de Orchestrator App · Secciones técnicas 3–11, incluidas 6.1–6.5',
    project: {
      subtitle: 'Form: recorrido esquemático del enrutamiento al despliegue',
      fullDescription: 'Una aplicación de fitness en React con FastAPI, agentes Python propios, acceso SQL controlado e infraestructura GCP con Neon PostgreSQL.',
      modalTags: ['React + Vite', 'FastAPI', 'Python', 'Pydantic', 'Gemini', 'SQLite / Neon PostgreSQL', 'Terraform', 'GCP'],
    },
    edges: {
      yes: 'Sí', no: 'No', retry: 'Inválido: reintentar', exhausted: '3 fallos',
      valid: 'Válido', no_system: 'no_system', empty: 'Sin nombres', followup: 'Usuario aclara',
      save: 'Confirmar guardado', changes: 'Pedir cambios', success: 'Añadir éxito', confirm: 'Confirmar',
      owns: '1:N posee', records: '1:N registra', contains: '1:N contiene', identifies: '1:N identifica',
      https: 'HTTPS', tls: 'TLS con pool', rejected: 'Rechazado', approved: 'Aprobado / sin regla',
    },
    sections: [
      {
        title: 'Dependencias, instalación y ejecución local',
        nodes: { tools: ['Git + Node 22.12+', 'Python 3.12 + uv'], config: ['.env en raíz', 'MODE=LOCAL', 'SQL_DATABASE_TYPE=sqlite'], install: ['backend: uv sync', '--locked --python 3.12', 'frontend: npm ci'], api: ['Uvicorn / FastAPI', '127.0.0.1:8000'], assets: ['gym_app.db incluido', 'database/images'], gemini: ['API de Gemini', 'Clave + modelo + cuota'], vite: ['Vite :5173', '/api -> :8000', 'Quitar prefijo /api'] },
        notes: [['Configurar e instalar', 'Usar el proyecto backend, no el paquete Python raíz. Definir SQLITE_DATABASE_PATH, GEMINI_API_KEY y LLM_MODEL no vacío; las variables de proceso prevalecen sobre .env.'], ['Ejecutar y comprobar', 'Ejecutar Uvicorn y Vite por separado. /health comprueba actividad, no Gemini ni SQL. Los recursos compilados pueden servirse con python -m server en :8080, con API bajo /api.'], ['Conservar los recursos', 'Mantener SQLite e imágenes incluidos; las escrituras locales modifican la base. No se necesitan Redis, PostgreSQL, migración cloud ni Docker en local. Gemini sí requiere internet y cuota.']],
      },
      {
        title: 'Estructura del repositorio',
        nodes: { root: ['OrchestratorApp/'], backend: ['backend/', 'src/ + tests/', 'pyproject.toml'], frontend: ['frontend/', 'src/ + tests/', 'public/ + package.json'], infra: ['infra/', 'modules/', 'environments/prod/'], database: ['database/', 'gym_app.db', 'database_schema.json'], workflow: ['.github/workflows/', 'terraform-deploy.yml'], scripts: ['scripts/', 'migrate_database.py', 'migrate_images.py'], package: ['src/orchestratorapp/', 'Paquete Python raíz'], docker: ['Dockerfile', 'Imagen multietapa'] },
        notes: [['Módulos de aplicación', 'backend contiene API, orquestación y agentes; frontend contiene React y pruebas de navegador. El paquete Python raíz es independiente del proyecto de desarrollo de la API.'], ['Infraestructura y entrega', 'Los módulos infra cubren artifact_registry, cloudrun, database, secrets y storage. environments/prod compone producción; infra/scripts contiene scripts de acceso inicial.'], ['Recursos de apoyo', 'database incluye SQLite y su esquema. scripts migra registros e imágenes y registra imágenes de ejercicios; .github/workflows contiene el flujo de despliegue.']],
      },
      {
        title: 'Tecnologías utilizadas',
        nodes: { react: ['React + Vite', 'Tailwind CSS'], api: ['Python / FastAPI', 'Dependencias con uv'], python: ['Clases Python propias', 'Validación Pydantic'], gemini: ['API de Gemini', 'Google AI Studio'], docker: ['Docker + Terraform', 'GitHub Actions'], cloudrun: ['Cloud Run', 'Frontend + backend'], sql: ['Local: SQLite', 'Cloud: Neon PostgreSQL'], assets: ['Imágenes Cloud Storage', 'Secret Manager'] },
        notes: [['Backend', 'Clases Python propias coordinan agentes y llamadas API, sin framework de orquestación de agentes. Pydantic valida salidas estructuradas; Gemini aporta los modelos de IA.'], ['Frontend', 'React utiliza Vite y su plugin React para compilar, con estilos Tailwind CSS. La skill UI/UX Pro Max con Claude apoyó el diseño de la interfaz.'], ['Entrega y servicios', 'Docker empaqueta frontend/backend juntos. Terraform y GitHub Actions gestionan la entrega; Artifact Registry almacena imágenes, Neon guarda SQL y GCP aporta alojamiento, imágenes y secretos.']],
      },
      {
        title: 'Cómo funciona el sistema de agentes',
        nodes: { request: ['POST /{id}/chat', 'query + EN / ES', 'user_id opcional'], pipeline: ['Pipeline', 'Últimos 2 turnos'], router: ['Orquestador', 'Solo selecciona un ID'], dispatch: ['ID validado', 'Pipeline invoca uno'], routine: ['routine_maker'], exercise: ['exercise_explainer'], history: ['past_routines_analyzer'], fallback: ['no_system', 'Texto configurado EN / ES'], store: ['Guardar turno exitoso', 'Conversación de sesión'], response: ['subsystem + response', 'Resultado JSON o NDJSON'] },
        notes: [['Responsabilidades separadas', 'El orquestador selecciona un ID; no responde ni ejecuta agentes. El pipeline invoca solo el subsistema seleccionado con la consulta original, el idioma y el contexto pertinente.'], ['Contexto y ámbito', 'El id de sesión aporta contexto conversacional. Crear rutinas y analizar historial requiere también user_id; el endpoint de chat aporta los últimos dos turnos de la sesión.'], ['Salida y fallos', 'JSON devuelve subsystem + response. NDJSON añade progreso y un resultado o error terminal. Un no_system válido usa texto configurado sin otra llamada LLM; los fallos de enrutamiento son errores, no respuestas de respaldo.']],
      },
      {
        title: 'Primer paso: el orquestador',
        nodes: { catalog: ['systems.json', 'IDs + descripciones'], context: ['Instrucciones de sistema', 'query + sistemas + idioma', '+ memoria opcional'], llm: ['Gemini: enrutamiento', 'Un ID en texto plano'], validate: ['Pydantic', '¿Cadena permitida?'], error: ['Error de enrutamiento', 'Sin selección silenciosa'], fallback: ['Respuesta configurada', 'EN / ES; sin llamada LLM'], pipeline: ['Despacho del pipeline', 'ID de subsistema válido'], agent: ['Agente seleccionado', 'Ejecución independiente'] },
        notes: [['Contrato de enrutamiento', 'Validar EN o ES explícitamente. El LLM recibe el código elegido, no el mapa de idiomas; devuelve un ID en texto plano, sin JSON, explicación, respuesta ni llamada a herramientas.'], ['Resultados permitidos', 'routine_maker crea o modifica planes; exercise_explainer explica técnica; past_routines_analyzer recupera historial. Las peticiones no compatibles usan no_system.'], ['Validación y reintentos', 'Rechazar IDs inventados y texto extra; registrar el rechazo y reintentar con el mismo contexto, tres intentos totales. Agotarlos o fallos de proveedor/configuración propagan error; solo no_system usa el texto predefinido.']],
      },
      {
        title: 'Routine Maker',
        nodes: { context: ['Estado de sesión + usuario', 'Planes guardados + catálogo'], decision: ['LLM: acción + parámetros', 'create / update / save'], validate: ['Decisión Pydantic', '¿JSON válido?'], complete: ['Combinar valores previos', '¿Están los 4 parámetros?'], missing: ['LLM: pedir datos faltantes', 'Guardar needs_parameters'], catalog: ['Catálogo de ejercicios', 'Nivel igual o inferior'], generate: ['LLM: JSON de rutina', 'Instrucciones + esquema'], plan: ['Validar plan', 'Catálogo + restricciones'], draft: ['Borrador sin guardar', 'draft_id único'], preview: ['awaiting_confirmation', 'routine_id = null'], confirm: ['Decisión del usuario', 'Revisar / cambiar / guardar'], persist: ['Guardar nueva versión', 'Activar rutina actual'] },
        notes: [['Requisitos', 'routine_type: weider o ppl; days_per_week: 1–7; hours_per_session: >0 y ≤24; level: beginner, intermediate o advanced. Validar antes de comprobar datos; combinar turnos sin inventar valores.'], ['Esquema del plan', 'Rutina: name, summary, days, recovery. Día: day, day_type, info, duration_minutes, exercises. Ejercicio: exercise_id, name, sets, reps, rest_seconds, notes. Nombres del catálogo; sin pesos prescritos.'], ['Validar y confirmar', 'Decisión y plan permiten tres intentos cada uno; agotarlos produce error. Comprobar días consecutivos, duración, series/descanso, IDs y duplicados. Generar solo crea un borrador; confirmar guarda y activa. POST de guardado directo no llama al LLM.']],
      },
      {
        title: 'Exercise Explainer',
        nodes: { query: ['Consulta + EN / ES', 'Memoria reciente opcional'], extract: ['LLM: exercises + message', 'Extracción con Pydantic'], match: ['Leer IDs y nombres', 'Normalizar / cotejar Python'], resolved: ['¿Todos los nombres', 'resueltos con confianza?'], clarify: ['Pedir nombre / variante', 'Hasta 3 candidatos', 'Sin adivinar ni subconjunto'], records: ['Deduplicar en orden', 'Registros parametrizados'], explain: ['Una llamada por ejercicio', 'Rechazar explicación vacía'], response: ['Lista, incluso para 1', 'Datos BD + llm_explanation'] },
        notes: [['Extraer y resolver', 'Traducir nombres españoles al inglés conservando variantes/equipo. Sin nombre, pedir aclaración; no inferir por músculo o equipo. Priorizar coincidencia exacta única; similitud ≥0.78 y ventaja ≥0.08.'], ['Esquema de respuesta', 'Conservar id, name, description, instructions, icon_url y anatomy_diagram_url. Decodificar media_url en media_urls: null o exactamente dos rutas. Solo llm_explanation se genera; no hay campo muscular independiente.'], ['Generación y errores', 'Explicar propósito, músculos, preparación, ejecución, respiración, errores y seguridad por coincidencia única. Un nombre sin resolver detiene todas las explicaciones. Sin bucle reparador de tres intentos; los fallos de validación, proveedor y SQL se propagan.']],
      },
      {
        title: 'Past Routines Analyzer',
        nodes: { query: ['Consulta + idioma', 'user_id + memoria opcional'], route: ['LLM suborquestador', 'JSON route + day_type'], validate: ['Pydantic: ruta y filtro', 'Lista permitida + normalizar'], error: ['Error de enrutamiento', 'Sin SQL arbitrario'], latest: ['past_day_exercise', 'Último entrenamiento', 'user_id + day_type'], compare: ['compare_last_two_workouts', 'Últimos 2 entrenamientos', 'user_id + day_type'], weekly: ['weekly_performance', 'Hoy + 6 días anteriores', 'user_id; day_type = null'], rows: ['Plantillas SQL estáticas', 'Parámetros vinculados', 'Filas originales de la BD'], explain: ['LLM: explicar registros', 'Sin inventar historial'], response: ['Respuesta validada', 'route, day_type,', 'data, llm_explain'], view: ['Informe React predefinido', 'Estadísticas desde data'] },
        notes: [['Rutas y filtros', 'Última sesión, comparación de dos o últimos siete días naturales con hoy incluido. day_type es un término de entrenamiento en inglés cotejado con nombres de rutina, no un día semanal; semanal exige null. Intención poco clara usa última sesión.'], ['Esquema de recuperación', 'Vincular user_id en cada ruta. Filas: sesión/fecha, día, ejercicio/orden, músculo, serie/repeticiones, peso/unidad, duración, distancia y RPE. training_rank: 1 para última y 2 para anterior. Sin SQL generado por el modelo.'], ['Informes fundamentados', 'Enrutamiento: tres intentos. Solo llm_explain se genera; data no cambia. Historial vacío explícito; una sesión no permite comparar dos. React calcula visualizaciones desde data; salidas inválidas/vacías y fallos de proveedor/SQL producen error.']],
      },
      {
        title: 'Memoria',
        nodes: { session: ['session_id', 'Ámbito conversacional'], turns: ['fakeredis del proceso', 'Turnos almacenados'], pipeline: ['Leer últimos 2 turnos', 'Contexto cronológico'], response: ['Respuesta exitosa'], scope: ['session_id + user_id', 'Ámbito de rutina'], draft: ['Requisitos + borrador', 'Estado de confirmación'], routine: ['Routine Maker'], sql: ['SQL persistente', 'Planes + entrenamientos'] },
        notes: [['Contexto conversacional', 'Leer los últimos dos turnos, o menos si no existen. Es un límite de recuperación, no de turnos almacenados. Los turnos exitosos se añaden a la sesión; user_id no filtra su recuperación.'], ['Estado de trabajo', 'Requisitos, borrador y confirmación usan session_id y user_id. redis_deps y RedisClient proporcionan el almacén compartido; user_id también delimita rutinas y entrenamientos SQL.'], ['Límite de durabilidad', 'fakeredis vive en un proceso: se pierde al reiniciar y no se comparte entre procesos. No hay Redis persistente ni memoria conversacional a largo plazo. Los registros SQL son datos de aplicación, no memoria conversacional.']],
      },
      {
        title: 'Bases de datos y almacenamiento de imágenes',
        nodes: { users: ['dim_users', 'id, username, weight_unit, created_at'], routines: ['dim_routines', 'id, user_id, name, description', 'is_active, updated_at, created_at'], exercises: ['dim_exercises', 'id, name, description, instructions', 'primary_muscle, secondary_muscles', 'pattern, equipment, level, tracking_type', 'media_url, icon_url, anatomy_diagram_url'], sets: ['fact_workout_sets', 'id, user_id, routine_id, exercise_id', 'training_id, exercise_order, set_number', 'reps, weight, duration_seconds', 'distance_meters, rpe, created_at'] },
        notes: [['Esquema y proveedores', 'SQLite local y Neon PostgreSQL cloud comparten este esquema lógico. description serializa la rutina moderna/metadatos. training_id agrupa sesiones; las plantillas antiguas con null quedan fuera del análisis. Migrar es independiente de Terraform.'], ['Frontera SQL', 'SQLClient traduce ? / :parameter a psycopg sin interpolar valores. Las transacciones confirman o revierten y cierran; SQLite activa claves foráneas. DATABASE_URL cloud exige TLS; errores de configuración/consulta no cambian el proveedor en silencio.'], ['Imágenes externas', 'SQL guarda referencias, no bytes. MODE selecciona database/images local u objetos privados GCS images/ leídos por la identidad de ejecución. API: /database/images, o /api/database/images combinada. Migrar imágenes es independiente de compilar.']],
      },
      {
        title: 'Backend FastAPI',
        nodes: { client: ['Cliente', 'Modelos de entrada/salida'], api: ['FastAPI', 'Validación Pydantic'], health: ['GET /health', 'Solo actividad'], chat: ['POST /{id}/routine/save', 'POST /{id}/chat', 'POST /{id}/key'], users: ['GET /users', 'POST /users'], routines: ['GET /users/{user_id}/routine', 'PUT /users/{user_id}/routine'], workouts: ['POST /users/{user_id}/workouts', 'GET /users/{user_id}/days'] },
        notes: [['Contratos y transporte', 'ChatRequest: query no vacía, EN/ES, user_id positivo opcional, client_saves_routine=false. ChatResponse: subsystem + response. JSON por defecto; Accept: application/x-ndjson añade progreso, latidos y resultado/error terminal. Los IDs no autentican.'], ['Modelos de rutina y sesión', 'PUT recibe RoutinePlan sin envoltorio; confirmar borrador exige session_id + draft_id y plan idéntico. GET/PUT exponen X-Routine-Id. WorkoutRequest: routine_id positivo + sets no vacíos; exercise_id positivo, repeticiones/tiempo/distancia positivos, peso ≥0, RPE 1–10.'], ['Perfiles, docs y fallos', 'Username: 1–80 caracteres recortados; unidades kg/lbs. Crear usuario/sesión: 201; otros éxitos: 200. /docs, /redoc, /openapi.json exponen esquemas. Entrada: 422; desconocido: 404; conflicto: 409; fallos: 500. Errores de ejecución en stream llegan tras 200.']],
      },
      {
        title: 'Frontend',
        nodes: { startup: ['Inicio de App', 'Requisitos en paralelo'], health: ['GET /health', 'Actividad + reintento'], session: ['GET /users -> primer perfil', 'POST /{id}/key'], workspace: ['¿Ambos correctos?', 'Espacio MainView'], chat: ['AI Chat', 'query + EN/ES + user_id'], stream: ['Progreso NDJSON', 'Normalizar JSON terminal'], views: ['Vistas React predefinidas', 'Tarjetas / planes / informes'], save: ['Guardado explícito', 'PUT del borrador exacto'], routine: ['My Routine', 'GET + X-Routine-Id'], edit: ['Editar objetivos futuros', 'PUT nueva versión activa'], workout: ['Series realizadas', 'POST sesión + recibo'], activity: ['GET /users/{user_id}/days', '7 fechas UTC + actividad'] },
        notes: [['Inicio y chat', 'Mostrar esqueleto hasta completar salud y sesión; pantallas de error/reintento separadas. Chat usa client_saves_routine=true, muestra progreso y bloquea mutaciones simultáneas. El tipo de respuesta elige tarjetas, planes, informes o Markdown.'], ['Plan frente a ejecución', 'Guardar borradores con PUT, session_id, draft_id e idioma, también al recibir save_requested. Editar My Routine crea versiones; series completadas usan POST workouts. Temporizadores y cambios sin guardar son locales. Ante fallo se conservan borradores o datos para reintentar.'], ['Perfiles, reinicio e inspección', 'Los perfiles no tienen contraseña. Cambiar inicializa sesión antes de remontar. New Chat borra memoria/borradores tras confirmación del backend, no historial SQL. EN/ES, temas y monitor muestran metadatos de ejecución, no razonamiento privado.']],
      },
      {
        title: 'Infraestructura cloud',
        nodes: { delivery: ['GitHub Actions + Terraform', 'Identidad de despliegue'], registry: ['Artifact Registry', 'Digest inmutable de imagen'], state: ['Backend GCS separado', 'Estado + bloqueos', 'Solo acceso de despliegue'], runtime: ['Cuenta de ejecución', 'Privilegios separados'], browser: ['Navegador', 'Entrada pública gestionada'], cloudrun: ['Cloud Run: React + API', '0–1 instancia, 1 vCPU', '512 MiB; puerto 8080'], memory: ['fakeredis del proceso', 'Turnos + borradores efímeros'], sql: ['Neon PostgreSQL', 'Datos persistentes; gratis'], gemini: ['API de Gemini'], images: ['Bucket GCS privado', 'Leer prefijo images/'], secrets: ['Secret Manager', 'JSON app de solo lectura', 'Secreto BD separado'] },
        notes: [['Una imagen orientada a cloud', 'Node 22 compila React, Python 3.12 + uv instala backend bloqueado y un runtime Python no root sirve ambos en :8080. Destino linux/amd64; MODE=CLOUD por defecto. SQLite/imágenes locales no se copian a la imagen.'], ['Identidades y almacenes separados', 'La ejecución lee secretos e imágenes privadas, no estado Terraform. Su bucket ya existe; las versiones pobladas del secreto de app se aportan fuera de Terraform. Entrada pública no publica secretos/buckets ni implementa autenticación de aplicación.'], ['Límites de la demo', 'Escala a cero; fakeredis se pierde al apagar, reiniciar o desplegar. Una instancia no aporta durabilidad. Redis externo no está conectado. No se configura VPC, subred, conector, ruta privada a BD ni CloudFront.']],
      },
      {
        title: 'Infraestructura como código (IaC) y Terraform',
        nodes: { merge: ['PR dev fusionada en main', 'Iniciar despliegue'], auth: ['Workload Identity', 'Cuenta de despliegue'], changed: ['¿Cambios en código', 'de aplicación?'], build: ['Buildx linux/amd64', 'Publicar imagen -> digest'], reuse: ['Reutilizar imagen', 'Resolver digest inmutable'], plan: ['fmt -> init -> validate', 'plan con digest de imagen'], artifact: ['Mostrar + subir tfplan', 'Artefacto de corta duración'], approval: ['¿Revisores de prod?', 'Revisión condicional'], stop: ['No se ejecuta apply'], apply: ['Misma revisión + auth', 'Descargar plan + init', 'apply del plan guardado'], state: ['Estado remoto compartido', 'Ejecuciones serializadas'], verify: ['Revisión + imagen listas', 'Comprobar API + frontend', 'Entrega verificada'] },
        notes: [['Activación y artefacto', 'Dos ramas dev/main, un entorno cloud y desarrollo local. Solo una PR dev a main fusionada activa los jobs. Nuevas imágenes usan etiqueta de revisión y digest sha256 inmutable como app_container_image; si no, reutilizar imagen.'], ['Plan y aprobación', 'build-and-plan ejecuta fmt, init, validate y plan; no aplica, pero puede publicar/purgar imágenes. El entorno prod no impone revisión por sí solo: configurar revisores obligatorios. Revisión de PR y aprobación de despliegue son controles distintos.'], ['Aplicar y verificar', 'Apply usa la misma revisión, autentica, descarga tfplan, inicializa el mismo backend y aplica ese plan. Verificar revisión lista, imagen esperada, salud y frontend; los fallos siguen visibles. Producción se ejecuta de forma serializada.']],
      },
    ],
  },
}

export function getOrchestratorTechnical(language) {
  const content = copy[language]
  return {
    ...content,
    showOverview: false,
    slides: content.sections.map((section, index) => {
      const id = sectionIds[index]
      const layout = layouts[id]
      return [`${id}. ${section.title}`, section.notes, {
        width: 1120,
        height: layout.height,
        section: id,
        caption: `${id} · ${section.title}`,
        nodes: layout.nodes.map(node => ({ ...node, label: section.nodes[node.id] })),
        edges: layout.edges.map(edge => ({ ...edge, label: content.edges[edge.label] })),
      }]
    }),
  }
}
