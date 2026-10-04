import { mkdir, writeFile } from 'node:fs/promises'
import { YOUTUBE_CHANNEL_URL } from '../src/lib/youtube.js'
import { extractYoutubeVideos } from './youtube.mjs'

const response = await fetch(`${YOUTUBE_CHANNEL_URL}/videos`, {
  headers: { 'Accept-Language': 'es-ES,es;q=0.9' },
  signal: AbortSignal.timeout(30000),
})
if (!response.ok) throw new Error(`YouTube request failed: HTTP ${response.status}`)

const videos = extractYoutubeVideos(await response.text())
const publicDirectory = new URL('../public/', import.meta.url)
await mkdir(publicDirectory, { recursive: true })
await writeFile(
  new URL('youtube-videos.json', publicDirectory),
  `${JSON.stringify(videos, null, 2)}\n`,
)
console.info(`Refreshed ${videos.length} regular YouTube videos`)
