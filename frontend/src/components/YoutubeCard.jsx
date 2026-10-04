import { useEffect, useState } from 'react'
import { YOUTUBE_CHANNEL_URL, validateYoutubeVideos } from '../lib/youtube.js'
import { createLogger } from '../utils/logger.js'
import { getStyles } from '../utils/styles.jsx'
import robotIcon from '../assets/robot-icon.png'

const log = createLogger('youtube')

function YoutubeCard({ theme, t }) {
  const styles = getStyles(theme)
  const [videos, setVideos] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    async function loadVideos() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}youtube-videos.json`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`Video list request failed: HTTP ${response.status}`)
        const data = validateYoutubeVideos(await response.json())
        if (!controller.signal.aborted) setVideos(data)
      } catch (error) {
        if (controller.signal.aborted) return
        log.error('Unable to load latest YouTube videos', { message: error.message })
        setFailed(true)
      }
    }
    loadVideos()
    return () => controller.abort()
  }, [])

  return (
    <section
      className="youtube-card rounded-2xl p-6 flex flex-col h-full"
      style={styles.youtubeCard}
      aria-labelledby="youtube-card-title"
    >
      <div className="flex items-center gap-4 mb-4">
        <div style={styles.youtubeIconBox}>
          <img src={robotIcon} alt="" className="w-8 h-8" />
        </div>
        <div>
          <h3 id="youtube-card-title" style={styles.youtubeTitle}>{t.title}</h3>
          <p style={styles.youtubeSubtitle}>{t.subtitle}</p>
        </div>
      </div>
      <p className="mb-6 text-xl font-semibold italic" style={styles.youtubeTagline}>
        {t.tagline}
      </p>
      <h4 className="font-semibold mb-3" style={styles.youtubeTitle}>{t.latestVideos}</h4>
      {failed ? (
        <p role="alert" className="mb-6" style={styles.cardDescription}>{t.videosError}</p>
      ) : videos ? (
        <ul className="space-y-3 mb-6">
          {videos.map((video) => (
            <li key={video.id}>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 rounded-lg p-3 hover:underline focus-visible:outline-2"
                style={styles.panel}
              >
                <i className="ph ph-play-circle shrink-0 mt-1" aria-hidden="true" style={styles.youtubeCta}></i>
                <span>{video.title}</span>
                <i className="ph ph-arrow-up-right shrink-0 mt-1 ml-auto" aria-hidden="true"></i>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p role="status" className="mb-6" style={styles.cardDescription}>{t.videosLoading}</p>
      )}
      <a
        href={YOUTUBE_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center gap-2 hover:underline"
        style={styles.youtubeCta}
      >
        {t.cta} <i className="ph ph-arrow-right" aria-hidden="true"></i>
      </a>
    </section>
  )
}

export default YoutubeCard
