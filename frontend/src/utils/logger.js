// Centralized, environment-aware logger for the portfolio SPA.
// Level is derived from the Vite build mode (debug in dev, error in prod) and
// can be overridden with the VITE_LOG_LEVEL env var (silent|error|warn|info|debug).

const LEVELS = { silent: 0, error: 1, warn: 2, info: 3, debug: 4 }

const CONSOLE_METHOD = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  debug: 'debug',
}

function resolveLevel() {
  const env = typeof import.meta !== 'undefined' ? import.meta.env : undefined
  const override = env?.VITE_LOG_LEVEL
  if (override && override in LEVELS) return LEVELS[override]
  return env?.PROD ? LEVELS.error : LEVELS.debug
}

let activeLevel = resolveLevel()

// Overrides the active threshold; unknown names are ignored.
export function setLogLevel(name) {
  if (name in LEVELS) activeLevel = LEVELS[name]
}

function emit(level, scope, message, context) {
  if (LEVELS[level] > activeLevel) return
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] ${level.toUpperCase()} (${scope}) ${message}`
  const write = console[CONSOLE_METHOD[level]] ?? console.log
  if (context === undefined) write(prefix)
  else write(prefix, context)
}

// Builds a logger bound to a scope label so entries are easy to trace.
export function createLogger(scope) {
  return {
    error: (message, context) => emit('error', scope, message, context),
    warn: (message, context) => emit('warn', scope, message, context),
    info: (message, context) => emit('info', scope, message, context),
    debug: (message, context) => emit('debug', scope, message, context),
  }
}

export const logger = createLogger('app')

// Wires window-level error and unhandled rejection events into the logger once.
export function installGlobalErrorHandlers(target = typeof window !== 'undefined' ? window : undefined) {
  if (!target || target.__portfolioErrorHandlersInstalled) return
  target.__portfolioErrorHandlersInstalled = true

  const log = createLogger('global')

  target.addEventListener('error', (event) => {
    log.error('Uncaught error', {
      message: event.message,
      source: event.filename,
      line: event.lineno,
      column: event.colno,
    })
  })

  target.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason
    log.error('Unhandled promise rejection', {
      reason: reason?.message ?? String(reason),
    })
  })
}
