import assert from 'node:assert/strict'
import { once } from 'node:events'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, mock, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { createApp } from '../app.js'

let server
let staticDir
let baseUrl
let origin
let auth
const cookie = '__Host-portfolio_session=valid-session'
const firebaseConfig = { apiKey: 'public-api-key', authDomain: 'example.firebaseapp.com', projectId: 'example' }
const claims = () => ({ uid: 'admin-created-user', auth_time: Date.now() / 1000, firebase: { sign_in_provider: 'password' } })
const authError = (code) => Object.assign(new Error(code), { code })

beforeEach(async () => {
  staticDir = await mkdtemp(path.join(os.tmpdir(), 'portfolio-auth-test-'))
  await writeFile(path.join(staticDir, 'index.html'), '<h1>Private portfolio</h1>')
  await writeFile(path.join(staticDir, 'private.js'), 'private-content')
  await writeFile(path.join(staticDir, 'youtube-videos.json'), '[{"title":"private-video"}]')
  auth = {
    verifyIdToken: mock.fn(async () => claims()),
    createSessionCookie: mock.fn(async () => 'valid-session'),
    verifySessionCookie: mock.fn(async () => claims()),
  }
  server = createApp({
    auth,
    firebaseConfig,
    staticDir,
    loginFile: fileURLToPath(new URL('../../auth-portal/index.html', import.meta.url)),
  }).listen(0, '127.0.0.1')
  await once(server, 'listening')
  const host = `127.0.0.1:${server.address().port}`
  baseUrl = `http://${host}`
  origin = `https://${host}`
})

afterEach(async () => {
  server.closeAllConnections()
  await new Promise((resolve) => server.close(resolve))
  await rm(staticDir, { recursive: true })
})

function request(route, options = {}) {
  return fetch(`${baseUrl}${route}`, { redirect: 'manual', ...options })
}

function sessionRequest(idToken = 'valid-token', requestOrigin = origin) {
  return request('/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: requestOrigin },
    body: JSON.stringify({ idToken }),
  })
}

test('login, web configuration, and health check are public, but never contain portfolio content', async () => {
  const login = await request('/login')
  assert.equal(login.status, 200)
  assert.match(await login.text(), /firebase-ui-auth\.js/)
  assert.deepEqual(await (await request('/auth/config')).json(), firebaseConfig)
  assert.equal(await (await request('/healthz')).text(), 'ok')
  assert.equal(auth.verifySessionCookie.mock.callCount(), 0)
})

test('all portfolio routes and assets require a session, including HEAD requests', async () => {
  for (const route of ['/', '/index.html', '/projects', '/private.js', '/youtube-videos.json', '/assets/app.js']) {
    for (const method of ['GET', 'HEAD']) {
      const response = await request(route, { method })
      assert.equal(response.status, 303, `${method} ${route}`)
      assert.equal(response.headers.get('location'), '/login')
      assert.doesNotMatch(await response.text(), /Private portfolio|private-content/)
    }
  }
})

test('a verified session serves files and SPA routes without public caching', async () => {
  for (const route of ['/', '/projects', '/private.js', '/youtube-videos.json']) {
    const response = await request(route, { headers: { Cookie: cookie } })
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('cache-control'), 'private, no-store')
    await response.text()
  }
  assert.deepEqual(auth.verifySessionCookie.mock.calls[0].arguments, ['valid-session', true])
})

test('a returning authenticated visitor skips the login page', async () => {
  const response = await request('/login', { headers: { Cookie: cookie } })
  assert.equal(response.status, 303)
  assert.equal(response.headers.get('location'), '/')
})

test('invalid, expired, revoked, deleted, or disabled sessions never expose content', async () => {
  for (const code of ['auth/argument-error', 'auth/session-cookie-expired', 'auth/session-cookie-revoked', 'auth/user-disabled', 'auth/user-not-found']) {
    auth.verifySessionCookie.mock.mockImplementation(async () => { throw authError(code) })
    const response = await request('/private.js', { headers: { Cookie: cookie } })
    assert.equal(response.status, 303)
    assert.match(response.headers.get('set-cookie'), /__Host-portfolio_session=;/)
    assert.doesNotMatch(await response.text(), /private-content/)
  }
})

test('authentication service failures fail closed with an explicit error', async () => {
  auth.verifySessionCookie.mock.mockImplementation(async () => { throw authError('auth/insufficient-permission') })
  const response = await request('/private.js', { headers: { Cookie: cookie } })
  assert.equal(response.status, 503)
  assert.match((await response.json()).error, /Unable to process/)
  assert.equal(response.headers.get('set-cookie'), null)
})

test('recent password login creates a five-day secure HttpOnly host-only session', async () => {
  const response = await sessionRequest()
  assert.equal(response.status, 204)
  const header = response.headers.get('set-cookie')
  for (const attribute of ['__Host-portfolio_session=valid-session', 'Max-Age=432000', 'Path=/', 'HttpOnly', 'Secure', 'SameSite=Lax']) {
    assert.ok(header.includes(attribute), attribute)
  }
  assert.ok(!header.includes('Domain='))
  assert.deepEqual(auth.verifyIdToken.mock.calls[0].arguments, ['valid-token', true])
  assert.deepEqual(auth.createSessionCookie.mock.calls[0].arguments, ['valid-token', { expiresIn: 432000000 }])
})

test('cross-origin or missing-origin requests cannot create sessions or log out', async () => {
  for (const invalidOrigin of ['https://attacker.example', 'null', '']) {
    assert.equal((await sessionRequest('token', invalidOrigin)).status, 403)
    assert.equal((await request('/auth/logout', { method: 'POST', headers: { Origin: invalidOrigin } })).status, 403)
  }
  assert.equal(auth.verifyIdToken.mock.callCount(), 0)
})

test('missing, non-string, malformed, and oversized tokens are rejected', async () => {
  for (const idToken of ['', null, 42, {}]) {
    assert.equal((await sessionRequest(idToken)).status, 400)
  }
  const malformed = await request('/auth/session', {
    method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: '{',
  })
  assert.equal(malformed.status, 400)
  assert.equal((await sessionRequest('x'.repeat(17000))).status, 413)
  assert.equal(auth.verifyIdToken.mock.callCount(), 0)
})

test('expired or revoked ID tokens cannot create sessions', async () => {
  for (const code of ['auth/invalid-id-token', 'auth/id-token-expired', 'auth/id-token-revoked', 'auth/user-disabled']) {
    auth.verifyIdToken.mock.mockImplementation(async () => { throw authError(code) })
    assert.equal((await sessionRequest()).status, 401)
  }
  assert.equal(auth.createSessionCookie.mock.callCount(), 0)
})

test('authentication must be within five minutes, allowing only small clock skew', async () => {
  for (const authTime of [Date.now() / 1000 - 301, Date.now() / 1000 + 61, undefined]) {
    auth.verifyIdToken.mock.mockImplementation(async () => ({ ...claims(), auth_time: authTime }))
    assert.equal((await sessionRequest()).status, 401)
  }
  auth.verifyIdToken.mock.mockImplementation(async () => ({ ...claims(), auth_time: Date.now() / 1000 - 299 }))
  assert.equal((await sessionRequest()).status, 204)
})

test('anonymous and other providers cannot establish application sessions', async () => {
  for (const provider of ['anonymous', 'google.com', undefined]) {
    auth.verifyIdToken.mock.mockImplementation(async () => ({ ...claims(), firebase: { sign_in_provider: provider } }))
    assert.equal((await sessionRequest()).status, 403)
  }
  assert.equal(auth.createSessionCookie.mock.callCount(), 0)
})

test('session creation failures are explicit and never set a cookie', async () => {
  auth.createSessionCookie.mock.mockImplementation(async () => { throw authError('auth/internal-error') })
  const response = await sessionRequest()
  assert.equal(response.status, 503)
  assert.equal(response.headers.get('set-cookie'), null)
})

test('same-origin logout clears the server cookie and returns to login', async () => {
  const response = await request('/auth/logout', { method: 'POST', headers: { Origin: origin, Cookie: cookie } })
  assert.equal(response.status, 303)
  assert.equal(response.headers.get('location'), '/login')
  assert.match(response.headers.get('set-cookie'), /__Host-portfolio_session=;/)
  assert.match(response.headers.get('set-cookie'), /HttpOnly; Secure; SameSite=Lax/)
})

test('authenticated missing assets return 404, not the SPA document', async () => {
  const response = await request('/assets/missing.js', { headers: { Cookie: cookie } })
  assert.equal(response.status, 404)
  assert.equal(await response.text(), 'Not found')
})
