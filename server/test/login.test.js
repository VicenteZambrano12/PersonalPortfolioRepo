import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import vm from 'node:vm'

const html = await readFile(new URL('../../auth-portal/index.html', import.meta.url), 'utf8')
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1]

async function setup({ sessionError, configFailure = false } = {}) {
  const calls = { starts: [], redirects: [], requests: [], signOuts: 0, errors: [], resets: 0, instances: 0 }
  const status = { textContent: '' }
  const auth = {
    async setPersistence(value) { calls.persistence = value },
    onAuthStateChanged(next, error) { calls.next = next; calls.error = error },
    async signOut() { calls.signOuts++; calls.next(null) },
  }
  const firebaseAuth = () => auth
  firebaseAuth.EmailAuthProvider = { PROVIDER_ID: 'password' }
  firebaseAuth.Auth = { Persistence: { NONE: 'none' } }
  await vm.runInNewContext(script, {
    firebase: { initializeApp(config) { calls.config = config }, auth: firebaseAuth },
    firebaseui: { auth: {
      CredentialHelper: { NONE: 'none' },
      AuthUI: class {
        constructor(instance) { assert.equal(instance, auth); calls.instances++ }
        start(selector, config) { calls.starts.push({ selector, config }) }
        reset() { calls.resets++ }
      },
    } },
    document: { getElementById() { return status } },
    window: { location: { replace(url) { calls.redirects.push(url) } } },
    console: { error(...args) { calls.errors.push(args) } },
    async fetch(url, options) {
      calls.requests.push({ url, options })
      if (url === '/auth/config') {
        return { ok: !configFailure, json: async () => ({ apiKey: 'public-key', projectId: 'example', authDomain: 'example.firebaseapp.com' }) }
      }
      assert.equal(url, '/auth/session')
      return { ok: !sessionError, json: async () => ({ error: sessionError }) }
    },
  })
  return { calls, status }
}

test('runtime config loads and auth state resolves before rendering the login widget', async () => {
  const { calls } = await setup()
  assert.equal(calls.config.projectId, 'example')
  assert.equal(calls.persistence, 'none')
  assert.equal(calls.instances, 0)
  calls.next(null)
  calls.next(null)
  assert.equal(calls.starts.length, 1)
  const { selector, config } = calls.starts[0]
  assert.equal(selector, '#firebaseui-auth-container')
  assert.equal(config.signInOptions.length, 1)
  assert.equal(config.signInOptions[0].provider, 'password')
  assert.equal(config.signInOptions[0].disableSignUp.status, true)
  assert.equal(config.callbacks.signInSuccessWithAuthResult(), false)
})

test('an authenticated visitor establishes the server session before redirecting without a widget', async () => {
  const { calls } = await setup()
  await calls.next({ getIdToken: async () => 'verified-token' })
  assert.equal(calls.instances, 0)
  const session = calls.requests[1]
  assert.equal(session.url, '/auth/session')
  assert.equal(session.options.method, 'POST')
  assert.deepEqual(JSON.parse(session.options.body), { idToken: 'verified-token' })
  assert.equal(session.options.credentials, 'same-origin')
  assert.equal(calls.signOuts, 1)
  assert.deepEqual(calls.redirects, ['/'])
})

test('new email sign-in exchanges its token and prevents a premature FirebaseUI redirect', async () => {
  const { calls } = await setup()
  calls.next(null)
  assert.equal(calls.starts[0].config.callbacks.signInSuccessWithAuthResult(), false)
  await calls.next({ getIdToken: async () => 'new-login-token' })
  assert.equal(calls.requests.length, 2)
  assert.deepEqual(calls.redirects, ['/'])
  assert.equal(calls.starts.length, 1)
})

test('concurrent auth notifications exchange only one token', async () => {
  const { calls } = await setup()
  let resolveToken
  const user = { getIdToken: () => new Promise((resolve) => { resolveToken = resolve }) }
  const exchange = calls.next(user)
  calls.next(user)
  resolveToken('one-token')
  await exchange
  assert.equal(calls.requests.filter(({ url }) => url === '/auth/session').length, 1)
})

test('failed session exchange reports the error, signs out, and permits a fresh login', async () => {
  const { calls, status } = await setup({ sessionError: 'Please sign in again.' })
  calls.next(null)
  await calls.next({ getIdToken: async () => 'old-token' })
  assert.equal(status.textContent, 'Please sign in again.')
  assert.equal(calls.redirects.length, 0)
  assert.equal(calls.signOuts, 1)
  assert.equal(calls.resets, 1)
  assert.equal(calls.starts.length, 2)
  await calls.next({ getIdToken: async () => 'retry-token' })
  assert.equal(calls.requests.length, 3)
})

test('config and auth-state failures are visible and do not redirect', async () => {
  const failed = await setup({ configFailure: true })
  assert.match(failed.status.textContent, /Unable to load login configuration/)
  assert.equal(failed.calls.instances, 0)
  assert.equal(failed.calls.redirects.length, 0)
  const normal = await setup()
  normal.calls.error(new Error('Session unavailable'))
  assert.equal(normal.status.textContent, 'Session unavailable')
  assert.equal(normal.calls.errors.length, 1)
})
