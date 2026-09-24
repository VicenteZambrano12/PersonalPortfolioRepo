import { getStyles } from '../utils/styles.jsx'

function ExternalLinkCard({ href, icon, iconImage, title, subtitle, tagline, cta, theme }) {
  const styles = getStyles(theme)

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="youtube-card group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col h-full relative overflow-hidden"
      style={styles.youtubeCard}
    >
      <i
        className={`ph-fill ${icon} absolute -bottom-6 -right-6 text-9xl opacity-10 transform group-hover:scale-110 transition-transform duration-500`}
        style={{ color: styles.youtubeSubtitle.color }}
      ></i>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          <div style={styles.youtubeIconBox}>
            {iconImage ? (
              <img src={iconImage} alt="" className="w-8 h-8" />
            ) : (
              <i className={`ph-fill ${icon} text-2xl`}></i>
            )}
          </div>
          <div>
            <h3 style={styles.youtubeTitle}>{title}</h3>
            <p style={styles.youtubeSubtitle}>{subtitle}</p>
          </div>
        </div>
        <p className="mb-6 flex-grow text-xl font-semibold italic pl-4" style={styles.youtubeTagline}>
          {tagline}
        </p>
        <div className="mt-auto flex items-center gap-2 group-hover:gap-3 transition-all" style={styles.youtubeCta}>
          {cta} <i className="ph ph-arrow-right"></i>
        </div>
      </div>
    </a>
  )
}

export default ExternalLinkCard
