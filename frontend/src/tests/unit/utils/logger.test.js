import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createLogger, installGlobalErrorHandlers, logger, setLogLevel } from '../../../utils/logger.js'

describe('logger', () => {
  let spies

  beforeEach(() => {
    spies = {
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
    setLogLevel('debug')
  })

  it('routes each level to the matching console method with scope and message', () => {
    const log = createLogger('unit')
    log.error('boom')
    log.warn('careful')
    log.info('hello')
    log.debug('details')

    expect(spies.error).toHaveBeenCalledWith(expect.stringContaining('ERROR (unit) boom'))
    expect(spies.warn).toHaveBeenCalledWith(expect.stringContaining('WARN (unit) careful'))
    expect(spies.info).toHaveBeenCalledWith(expect.stringContaining('INFO (unit) hello'))
    expect(spies.debug).toHaveBeenCalledWith(expect.stringContaining('DEBUG (unit) details'))
  })

  it('passes structured context through to the console call', () => {
    const context = { projectId: 'pauhelper' }
    logger.info('Project opened', context)

    expect(spies.info).toHaveBeenCalledWith(expect.stringContaining('Project opened'), context)
  })

  it('suppresses entries below the active level', () => {
    setLogLevel('warn')
    const log = createLogger('unit')

    log.info('should be hidden')
    log.debug('also hidden')
    log.warn('shown')
    log.error('shown too')

    expect(spies.info).not.toHaveBeenCalled()
    expect(spies.debug).not.toHaveBeenCalled()
    expect(spies.warn).toHaveBeenCalledTimes(1)
    expect(spies.error).toHaveBeenCalledTimes(1)
  })

  it('silences everything at the silent level', () => {
    setLogLevel('silent')
    const log = createLogger('unit')

    log.error('nope')
    log.warn('nope')

    expect(spies.error).not.toHaveBeenCalled()
    expect(spies.warn).not.toHaveBeenCalled()
  })

  it('ignores unknown level names', () => {
    setLogLevel('warn')
    setLogLevel('not-a-level')
    const log = createLogger('unit')

    log.info('still hidden at warn threshold')
    expect(spies.info).not.toHaveBeenCalled()
  })

  describe('installGlobalErrorHandlers', () => {
    function makeTarget() {
      const listeners = {}
      return {
        addEventListener: (type, handler) => {
          listeners[type] = handler
        },
        dispatch: (type, event) => listeners[type]?.(event),
      }
    }

    it('logs uncaught errors and unhandled rejections once installed', () => {
      const target = makeTarget()
      installGlobalErrorHandlers(target)

      target.dispatch('error', { message: 'kaboom', filename: 'app.js', lineno: 1, colno: 2 })
      target.dispatch('unhandledrejection', { reason: new Error('async fail') })

      expect(spies.error).toHaveBeenCalledWith(
        expect.stringContaining('Uncaught error'),
        expect.objectContaining({ message: 'kaboom', source: 'app.js' }),
      )
      expect(spies.error).toHaveBeenCalledWith(
        expect.stringContaining('Unhandled promise rejection'),
        expect.objectContaining({ reason: 'async fail' }),
      )
    })

    it('does not register handlers twice on the same target', () => {
      const target = makeTarget()
      const addSpy = vi.spyOn(target, 'addEventListener')

      installGlobalErrorHandlers(target)
      installGlobalErrorHandlers(target)

      expect(addSpy).toHaveBeenCalledTimes(2)
    })
  })
})
