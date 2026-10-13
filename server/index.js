import { applicationDefault, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createApp } from './app.js'

function requiredEnv(name) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`${name} must be configured`)
  return value
}

const projectId = requiredEnv('FIREBASE_PROJECT_ID')
const firebaseConfig = {
  apiKey: requiredEnv('FIREBASE_API_KEY'),
  authDomain: requiredEnv('FIREBASE_AUTH_DOMAIN'),
  projectId,
}
const staticDir = fileURLToPath(new URL('../frontend/dist/', import.meta.url))
const loginFile = fileURLToPath(new URL('../auth-portal/index.html', import.meta.url))
await access(new URL('../frontend/dist/index.html', import.meta.url))
await access(loginFile)

const firebaseApp = initializeApp({ credential: applicationDefault(), projectId })
const development = process.env.NODE_ENV === 'development'
const app = createApp({
  auth: getAuth(firebaseApp),
  firebaseConfig,
  staticDir,
  loginFile,
  secureCookies: !development,
})
const port = Number(process.env.PORT ?? 8080)
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be a valid TCP port')

app.listen(port, development ? '127.0.0.1' : '0.0.0.0', () => {
  console.log(`Portfolio authentication server listening on port ${port}`)
})
