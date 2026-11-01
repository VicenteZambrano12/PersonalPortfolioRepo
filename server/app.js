import cookieParser from 'cookie-parser'
import express from 'express'
import path from 'node:path'

const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000
const INVALID_CREDENTIAL_CODES = new Set([
  'auth/argument-error',
  'auth/invalid-id-token',
  'auth/id-token-expired',
  'auth/id-token-revoked',
  'auth/invalid-session-cookie',
  'auth/session-cookie-expired',
  'auth/session-cookie-revoked',
  'auth/user-disabled',
  'auth/user-not-found',
])

const VIDEO_PREFIX = 'videos'
const VIDEO_SEGMENTS = {
  app: /^\d+-[a-z0-9-]+$/,
  lang: /^(EN|ES)$/,
  file: /^[A-Za-z0-9][A-Za-z0-9._-]*\.(mp4|webm)$/,
}

export function createApp({ auth, firebaseConfig, staticDir, loginFile, secureCookies = true, videoBucket }) {
  const app = express()
  const cookieName = secureCookies ? '__Host-portfolio_session' : 'portfolio_session'
  const cookieOptions = { httpOnly: true, secure: secureCookies, sameSite: 'lax', path: '/' }

  app.disable('x-powered-by')
  app.use((req, res, next) => {
    res.set('Cache-Control', 'private, no-store')
    res.set('X-Content-Type-Options', 'nosniff')
    res.set('Referrer-Policy', 'same-origin')
    res.set('X-Frame-Options', 'DENY')
    next()
  })
  app.use(cookieParser())

  function requireSameOrigin(req, res, next) {
    const expectedOrigin = `${secureCookies ? 'https' : 'http'}://${req.get('host')}`
    if (req.get('origin') !== expectedOrigin) {
      console.warn('Rejected cross-origin authentication request')
      return res.status(403).json({ error: 'Authentication requests must originate from this site.' })
    }
    next()
  }

  async function readSession(req, res, next) {
    const session = req.cookies[cookieName]
    if (!session) return next()
    try {
      req.user = await auth.verifySessionCookie(session, true)
    } catch (error) {
      if (!INVALID_CREDENTIAL_CODES.has(error.code)) return next(error)
      console.warn('Rejected session:', error.code)
      res.clearCookie(cookieName, cookieOptions)
    }
    next()
  }

  app.get('/healthz', (req, res) => res.send('ok'))
  app.get('/auth/config', (req, res) => res.json(firebaseConfig))
  app.get('/auth/brand/logo.png', (req, res) => res.sendFile(path.join(staticDir, 'logo.png')))
  app.get('/login', readSession, (req, res) => {
    if (req.user) return res.redirect(303, '/')
    res.sendFile(loginFile)
  })

  app.post('/auth/session', requireSameOrigin, express.json({ limit: '16kb' }), async (req, res) => {
    if (typeof req.body?.idToken !== 'string' || !req.body.idToken) {
      console.warn('Rejected session request without an ID token')
      return res.status(400).json({ error: 'An ID token is required.' })
    }

    try {
      const claims = await auth.verifyIdToken(req.body.idToken, true)
      const ageSeconds = Date.now() / 1000 - claims.auth_time
      if (!Number.isFinite(ageSeconds) || ageSeconds < -60 || ageSeconds > 300) {
        console.warn('Rejected session request without recent authentication')
        return res.status(401).json({ error: 'Please sign in again to create a new session.' })
      }
      if (claims.firebase?.sign_in_provider !== 'password') {
        console.warn('Rejected session request using a non-password provider')
        return res.status(403).json({ error: 'An administrator-provided email/password account is required.' })
      }

      const session = await auth.createSessionCookie(req.body.idToken, { expiresIn: SESSION_DURATION_MS })
      res.cookie(cookieName, session, { ...cookieOptions, maxAge: SESSION_DURATION_MS })
      res.status(204).end()
    } catch (error) {
      if (!INVALID_CREDENTIAL_CODES.has(error.code)) throw error
      console.warn('Rejected sign-in token:', error.code)
      res.status(401).json({ error: 'Your sign-in could not be verified. Please sign in again.' })
    }
  })

  app.post('/auth/logout', requireSameOrigin, (req, res) => {
    res.clearCookie(cookieName, cookieOptions)
    res.redirect(303, '/login')
  })

  app.use(readSession, (req, res, next) => {
    if (req.user) return next()
    res.redirect(303, '/login')
  })
  app.get('/videos/:app/:lang/:file', async (req, res, next) => {
    const { app: appName, lang, file } = req.params
    if (!videoBucket || !VIDEO_SEGMENTS.app.test(appName) || !VIDEO_SEGMENTS.lang.test(lang) || !VIDEO_SEGMENTS.file.test(file)) {
      return res.status(404).send('Not found')
    }
    try {
      const object = videoBucket.file(`${VIDEO_PREFIX}/${appName}/${lang}/${file}`)
      const [metadata] = await object.getMetadata()
      const size = Number(metadata.size)
      let start = 0
      let end = size - 1
      const range = req.get('range')
      if (range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(range)
        if (!match || (!match[1] && !match[2])) return res.status(416).set('Content-Range', `bytes */${size}`).end()
        if (match[1]) {
          start = Number(match[1])
          if (match[2]) end = Math.min(Number(match[2]), size - 1)
        } else {
          start = Math.max(size - Number(match[2]), 0)
        }
        if (start >= size || start > end) return res.status(416).set('Content-Range', `bytes */${size}`).end()
      }
      res.status(range ? 206 : 200)
      res.set({
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'private, max-age=3600',
        'Content-Length': String(end - start + 1),
        'Content-Type': metadata.contentType || 'application/octet-stream',
      })
      if (range) res.set('Content-Range', `bytes ${start}-${end}/${size}`)
      const stream = object.createReadStream({ start, end })
      stream.on('error', (error) => {
        console.error('Video stream failed:', error.code ?? error.message)
        res.destroy(error)
      })
      stream.pipe(res)
    } catch (error) {
      if (error.code === 404) return res.status(404).send('Not found')
      next(error)
    }
  })
  app.use('/src/features/docs', (req, res, next) => {
    res.set('X-Frame-Options', 'SAMEORIGIN')
    next()
  })
  app.use(express.static(staticDir, { index: false, dotfiles: 'deny', cacheControl: false }))
  app.get('/{*route}', (req, res) => {
    if (path.extname(req.path)) return res.status(404).send('Not found')
    res.sendFile(path.join(staticDir, 'index.html'))
  })

  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error)
    console.error('Portfolio server request failed:', error.code ?? error.type ?? error.message)
    if (error.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Invalid JSON request.' })
    }
    if (error.type === 'entity.too.large') {
      return res.status(413).json({ error: 'Request is too large.' })
    }
    res.status(503).json({ error: 'Unable to process your request. Please try again later.' })
  })

  return app
}
