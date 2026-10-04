import { getStyles } from '../utils/styles.jsx'
import robotIcon from '../assets/robot-icon.png'

function YoutubeCard({ theme, t, onSelect }) {
  const styles = getStyles(theme)

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-haspopup="dialog"
      aria-labelledby="youtube-card-title youtube-card-cta"
      className="youtube-card group rounded-2xl p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col h-full"
      style={styles.youtubeCard}
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
