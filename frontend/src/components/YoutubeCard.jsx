import { getStyles } from '../utils/styles.jsx'

function YoutubeCard({ theme, t, onSelect }) {
  const styles = getStyles(theme)

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-haspopup="dialog"
      aria-labelledby="youtube-card-title youtube-card-cta"
      className="youtube-card group rounded-2xl p-6 sm:p-8 text-left transition-colors duration-200 hover:shadow-xl cursor-pointer flex flex-col h-full min-w-0"
      style={styles.youtubeCard}
    >
      <div className="flex items-center gap-4 mb-4">
        <div style={styles.youtubeIconBox}>
          <img src="/logo.png" alt="" width="48" height="48" className="brand-logo w-12 h-12" />
        </div>
        <div>
          <h3 id="youtube-card-title" style={styles.youtubeTitle}>{t.title}</h3>
          <p style={styles.youtubeSubtitle}>{t.subtitle}</p>
        </div>
      </div>
      <p className="mb-6 flex-grow text-xl font-semibold italic" style={styles.youtubeTagline}>
        {t.tagline}
      </p>
      <span id="youtube-card-cta" className="mt-auto inline-flex items-center gap-2" style={styles.youtubeCta}>
        {t.openVideos} <i className="ph ph-arrow-right" aria-hidden="true"></i>
      </span>
    </button>
  )
}

export default YoutubeCard
