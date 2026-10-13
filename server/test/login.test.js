import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import vm from 'node:vm'

const html = await readFile(new URL('../../auth-portal/index.html', import.meta.url), 'utf8')
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1])
const script = scripts.find((source) => source.includes('signInSuccessUrl'))

async function setup({ sessionError, configFailure = false, networkFailure, signInError, signInWait, resetError } = {}) {
  const calls = { redirects: [], requests: [], signOuts: 0, errors: [], signIns: [], resets: [] }
  const elements = Object.fromEntries(
    ['auth-status', 'auth-error', 'login-form', 'login-fields', 'email', 'password',
      'reset-password', 'toggle-password', 'submit-spinner', 'submit-label'].map((id) => [id, {
      textContent: '', value: '', type: id === 'password' ? 'password' : 'email',
      hidden: ['login-form', 'auth-error', 'submit-spinner'].includes(id),
      disabled: false, listeners: {}, attributes: {},
      addEventListener(event, handler) { this.listeners[event] = handler },
      reportValidity() { return this.valid !== false },
      setAttribute(name, value) { this.attributes[name] = value },
    }])
  )
  const auth = {
    async setPersistence(value) { calls.persistence = value },
    onAuthStateChanged(next, error) { calls.next = next; calls.error = error },
    async signOut() { calls.signOuts++; calls.next(null) },
    async signInWithEmailAndPassword(email, password) {
      calls.signIns.push({ email, password })
      if (signInWait) await signInWait
      if (signInError) throw signInError
      await calls.next({ getIdToken: async () => 'signed-in-token' })
    },
    async sendPasswordResetEmail(email) {
      calls.resets.push(email)
      if (resetError) throw resetError
    },
    fetchSignInMethodsForEmail() { assert.fail('Enumeration protection must not be bypassed') },
    createUserWithEmailAndPassword() { assert.fail('The form must never create users') },
  }
  const firebaseAuth = () => auth
  firebaseAuth.Auth = { Persistence: { NONE: 'none' } }
  await vm.runInNewContext(script, {
    firebase: { initializeApp(config) { calls.config = config }, auth: firebaseAuth },
    document: { getElementById(id) { assert.ok(elements[id]); return elements[id] } },
    window: { location: { replace(url) { calls.redirects.push(url) } } },
    console: { error(...args) { calls.errors.push(args) } },
    async fetch(url, options) {
      calls.requests.push({ url, options })
      if (url === networkFailure) throw new TypeError('Failed to fetch')
      if (url === '/auth/config') {
        return { ok: !configFailure, json: async () => ({ apiKey: 'public-key', projectId: 'example', authDomain: 'example.firebaseapp.com' }) }
      }
      assert.equal(url, '/auth/session')
      return { ok: !sessionError, json: async () => ({ error: sessionError }) }
    },
  })
  return {
    calls, elements, status: elements['auth-status'], error: elements['auth-error'],
    async submit() {
      let prevented = false
      await elements['login-form'].listeners.submit({ preventDefault() { prevented = true } })
      assert.equal(prevented, true)
    },
    reset() { return elements['reset-password'].listeners.click() },
  }
}

test('the form offers email/password and password recovery without FirebaseUI or signup', () => {
  assert.match(html, /type="email" autocomplete="email" required/)
  assert.match(html, /type="password" autocomplete="current-password" required/)
  assert.match(html, /Forgot password\?/)
  assert.doesNotMatch(html, /firebaseui|fetchSignInMethodsForEmail|createUserWithEmailAndPassword/)
})

test('runtime config loads and auth state resolves before showing the form', async () => {
  const { calls, elements } = await setup()
  assert.equal(calls.config.projectId, 'example')
  assert.equal(calls.persistence, 'none')
  assert.equal(elements['login-form'].hidden, true)
  calls.next(null)
  assert.equal(elements['login-form'].hidden, false)
})

test('an authenticated visitor establishes the server session before redirecting without showing the form', async () => {
  const { calls, elements } = await setup()
  await calls.next({ getIdToken: async () => 'verified-token' })
  assert.equal(elements['login-form'].hidden, true)
  const session = calls.requests[1]
  assert.equal(session.url, '/auth/session')
  assert.equal(session.options.method, 'POST')
  assert.deepEqual(JSON.parse(session.options.body), { idToken: 'verified-token' })
  assert.equal(session.options.credentials, 'same-origin')
  assert.equal(calls.signOuts, 1)
  assert.deepEqual(calls.redirects, ['/'])
})

test('direct password sign-in works without discovering sign-in methods, preserves password spaces, and clears the input', async () => {
  const context = await setup()
  context.calls.next(null)
  context.elements.email.value = ' user@example.com '
  context.elements.password.value = ' password with spaces '
  await context.submit()
  assert.deepEqual(context.calls.signIns, [{ email: 'user@example.com', password: ' password with spaces ' }])
  assert.equal(context.elements.password.value, '')
  assert.equal(context.calls.requests.length, 2)
  assert.deepEqual(context.calls.redirects, ['/'])
})

test('concurrent auth notifications exchange only one token and block extra form submissions', async () => {
  const context = await setup()
  let resolveToken
  const user = { getIdToken: () => new Promise((resolve) => { resolveToken = resolve }) }
  const exchange = context.calls.next(user)
  context.calls.next(user)
  await context.submit()
  assert.equal(context.calls.signIns.length, 0)
  resolveToken('one-token')
  await exchange
  assert.equal(context.calls.requests.filter(({ url }) => url === '/auth/session').length, 1)
})

test('failed session exchange reports the error, signs out, and permits a fresh login', async () => {
  const { calls, error, elements } = await setup({ sessionError: 'Please sign in again.' })
  await calls.next({ getIdToken: async () => 'old-token' })
  assert.equal(error.textContent, 'Please sign in again.')
  assert.equal(error.hidden, false)
  assert.equal(elements['submit-spinner'].hidden, true)
  assert.equal(elements['login-form'].attributes['aria-busy'], 'false')
  assert.equal(calls.redirects.length, 0)
  assert.equal(calls.signOuts, 1)
  assert.equal(elements['login-form'].hidden, false)
  assert.equal(elements['login-fields'].disabled, false)
  await calls.next({ getIdToken: async () => 'retry-token' })
  assert.equal(calls.requests.length, 3)
})

test('wrong-password and nonexistent-account errors are indistinguishable and allow retry', async () => {
  for (const code of ['auth/invalid-credential', 'auth/invalid-login-credentials', 'auth/wrong-password', 'auth/user-not-found']) {
    const context = await setup({ signInError: { code, message: 'Sensitive backend details' } })
    context.calls.next(null)
    context.elements.email.value = 'user@example.com'
    context.elements.password.value = 'incorrect'
    await context.submit()
    assert.equal(context.error.textContent, 'Email or password is incorrect.')
    assert.equal(context.error.hidden, false)
    assert.equal(context.status.hidden, true)
    assert.equal(context.elements.email.value, 'user@example.com')
    assert.equal(context.elements['login-fields'].disabled, false)
    assert.equal(context.elements.password.value, '')
    assert.equal(context.calls.requests.length, 1)
    assert.equal(context.calls.redirects.length, 0)
    await context.submit()
    assert.equal(context.calls.signIns.length, 2)
  }
})

test('password reset confirmation does not reveal whether an account exists', async () => {
  const context = await setup()
  context.calls.next(null)
  context.elements.email.value = ' user@example.com '
  await context.reset()
  assert.deepEqual(context.calls.resets, ['user@example.com'])
  assert.equal(context.status.textContent, 'If an account exists for this email, a password reset email has been sent.')
  assert.equal(context.elements['login-fields'].disabled, false)
  assert.equal(context.calls.redirects.length, 0)
})

test('password reset validates the email and displays network failures', async () => {
  const context = await setup({ resetError: { code: 'auth/network-request-failed' } })
  context.elements.email.valid = false
  await context.reset()
  assert.equal(context.calls.resets.length, 0)
  context.elements.email.valid = true
  await context.reset()
  assert.match(context.error.textContent, /Check your connection/)
  assert.equal(context.elements['login-fields'].disabled, false)
})

test('config and auth-state failures are visible and do not redirect', async () => {
  const failed = await setup({ configFailure: true })
  assert.match(failed.error.textContent, /Unable to load login configuration/)
  assert.equal(failed.elements['login-form'].hidden, true)
  assert.equal(failed.calls.redirects.length, 0)
  const normal = await setup()
  normal.calls.error(new Error('Session unavailable'))
  assert.equal(normal.error.textContent, 'Session unavailable')
  assert.equal(normal.calls.errors.length, 1)
})

test('password visibility toggle is accessible and resets after an error', async () => {
  const { elements, submit } = await setup({ signInError: { code: 'auth/invalid-credential' } })
  const toggle = elements['toggle-password']
  elements.password.value = 'private-password'
  toggle.listeners.click()
  assert.equal(elements.password.type, 'text')
  assert.equal(toggle.attributes['aria-label'], 'Hide password')
  assert.equal(toggle.attributes['aria-pressed'], 'true')
  toggle.listeners.click()
  assert.equal(elements.password.type, 'password')
  assert.equal(toggle.attributes['aria-label'], 'Show password')
  assert.equal(toggle.attributes['aria-pressed'], 'false')
  toggle.listeners.click()
  await submit()
  assert.equal(elements.password.value, '')
  assert.equal(elements.password.type, 'password')
  assert.equal(toggle.attributes['aria-pressed'], 'false')
})

test('pending sign-in disables controls, announces loading, and blocks duplicate clicks', async () => {
  let complete
  const signInWait = new Promise((resolve) => { complete = resolve })
  const context = await setup({ signInWait, signInError: { code: 'auth/invalid-credential' } })
  context.calls.next(null)
  const pending = context.submit()
  assert.equal(context.elements['login-fields'].disabled, true)
  assert.equal(context.elements['login-form'].attributes['aria-busy'], 'true')
  assert.equal(context.elements['submit-spinner'].hidden, false)
  assert.equal(context.elements['submit-label'].textContent, 'Signing in...')
  assert.equal(context.status.textContent, 'Signing in...')
  await context.submit()
  assert.equal(context.calls.signIns.length, 1)
  complete()
  await pending
  assert.equal(context.elements['login-fields'].disabled, false)
  assert.equal(context.elements['login-form'].attributes['aria-busy'], 'false')
  assert.equal(context.elements['submit-spinner'].hidden, true)
  assert.equal(context.elements['submit-label'].textContent, 'Sign in')
})

test('loading continues throughout the server session exchange', async () => {
  const context = await setup()
  let complete
  const pending = context.calls.next({ getIdToken: () => new Promise((resolve) => { complete = resolve }) })
  assert.equal(context.elements['login-fields'].disabled, true)
  assert.equal(context.elements['submit-spinner'].hidden, false)
  assert.equal(context.elements['login-form'].attributes['aria-busy'], 'true')
  complete('verified-token')
  await pending
  assert.deepEqual(context.calls.redirects, ['/'])
})

test('Firebase and fetch network failures display connection guidance without dropping the email', async () => {
  for (const options of [
    { signInError: { code: 'auth/network-request-failed' } },
    { networkFailure: '/auth/session' },
  ]) {
    const context = await setup(options)
    context.calls.next(null)
    context.elements.email.value = 'user@example.com'
    context.elements.password.value = 'private-password'
    await context.submit()
    assert.equal(context.error.textContent, 'Unable to connect. Check your connection and try again.')
    assert.equal(context.error.hidden, false)
    assert.equal(context.elements.email.value, 'user@example.com')
    assert.equal(context.elements.password.value, '')
    assert.equal(context.elements['login-fields'].disabled, false)
    assert.equal(context.calls.redirects.length, 0)
    assert.equal(context.calls.errors.length, 1)
  }
  const failed = await setup({ networkFailure: '/auth/config' })
  assert.match(failed.error.textContent, /Check your connection/)
})

test('a recovery request clears old errors and announces enumeration-safe confirmation', async () => {
  const context = await setup({ signInError: { code: 'auth/invalid-credential' } })
  context.calls.next(null)
  context.elements.email.value = 'user@example.com'
  await context.submit()
  assert.equal(context.error.hidden, false)
  await context.reset()
  assert.equal(context.error.hidden, true)
  assert.equal(context.error.textContent, '')
  assert.equal(context.status.hidden, false)
  assert.match(context.status.textContent, /If an account exists/)
  assert.equal(context.elements['submit-spinner'].hidden, true)
})

test('theme matches stored portfolio preferences or system preference and logs unavailable storage', () => {
  for (const [stored, prefersLight, expected] of [
    ['light', false, 'light'],
    ['dark', true, 'dark'],
    [null, true, 'light'],
    [null, false, 'dark'],
    ['invalid', true, 'light'],
  ]) {
    const document = { documentElement: { dataset: {} } }
    vm.runInNewContext(scripts[0], {
      document,
      window: {
        localStorage: { getItem(key) { assert.equal(key, 'portfolio-theme'); return stored } },
        matchMedia: () => ({ matches: prefersLight }),
      },
    })
    assert.equal(document.documentElement.dataset.theme, expected)
  }
  const document = { documentElement: { dataset: {} } }
  const warnings = []
  vm.runInNewContext(scripts[0], {
    document,
    window: {
      localStorage: { getItem() { throw new Error('Storage blocked') } },
      matchMedia: () => ({ matches: false }),
    },
    console: { warn(...args) { warnings.push(args) } },
  })
  assert.equal(document.documentElement.dataset.theme, 'dark')
  assert.equal(warnings.length, 1)
})
