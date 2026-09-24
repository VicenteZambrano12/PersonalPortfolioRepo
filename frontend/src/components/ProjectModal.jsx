import { useEffect, useState } from 'react'
import { getStyles } from '../utils/styles.jsx'

function ProjectModal({ project, theme, t, onClose }) {
  const [visible, setVisible] = useState(false)
  const styles = getStyles(theme)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const frame = requestAnimationFrame(() => setVisible(true))

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
      cancelAnimationFrame(frame)
    }
  }, [onClose])

  return (
    <div
      className={`flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={styles.modalOverlay}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className={`rounded-2xl shadow-2xl w-full max-w-[70vw] max-h-[90vh] flex flex-col overflow-hidden transition-transform duration-300 ${visible ? 'scale-100' : 'scale-95'}`}
        style={styles.modalContent}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6" style={styles.modalHeader}>
          <div>
            <h3 className="text-2xl font-bold" style={styles.cardTitle}>{project.title}</h3>
            <p className="font-medium" style={styles.cardSubtitle}>{project.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={styles.closeButton}
          >
            <i className="ph ph-x text-xl"></i>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow" style={styles.modalBody}>
          <div className="w-full aspect-video rounded-xl mb-8 relative overflow-hidden flex items-center justify-center group shadow-md" style={styles.videoFrame}>
            <img
              src={project.thumbUrl}
              alt="Video Thumbnail"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <button
              className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
              style={styles.playButton}
            >
              <i className="ph-fill ph-play text-3xl ml-1"></i>
            </button>
            <div className="absolute bottom-4 left-6 z-10">
              <span className="px-3 py-1.5 rounded-md text-sm backdrop-blur-md font-medium" style={styles.videoBadge}>
                <i className="ph ph-video-camera mr-1 align-middle"></i> {t.modal.videoWalkthrough}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
            <div className="lg:col-span-2">
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2" style={styles.panelHeading}>
                <i className="ph ph-info" style={styles.sectionIcon}></i> {t.modal.description}
              </h4>
              <p style={styles.cardDescription}>{project.fullDescription}</p>
            </div>
            <div className="p-5 rounded-xl" style={styles.panel}>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={styles.panelHeading}>{t.modal.techStack}</h4>
              <div className="flex flex-wrap gap-2">
                {project.modalTags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs font-semibold rounded-md" style={styles.modalTag}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 pt-6" style={{ borderTop: styles.panel.border }}>
                <a
                  href="#"
                  className="w-full flex items-center justify-center gap-2 transition-colors"
                  style={styles.buttonPrimary}
                >
                  {t.modal.openLiveApp} <i className="ph ph-arrow-up-right"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Technical Docs */}
            <div className="p-6 rounded-xl" style={styles.panel}>
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2 pb-3" style={styles.panelHeading}>
                <i className="ph ph-code" style={styles.sectionIcon}></i> {t.modal.technicalDocs}
              </h4>
              <ul className="list-disc pl-4 space-y-2 text-sm" style={{ color: styles.cardDescription.color }}>
                {project.techDocs.map((item, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            </div>

            {/* Soft Docs */}
            <div className="p-6 rounded-xl" style={styles.panel}>
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2 pb-3" style={styles.panelHeading}>
                <i className="ph ph-book-open-text" style={styles.sectionIcon}></i> {t.modal.userGuide}
              </h4>
              <div className="text-sm space-y-3" style={{ color: styles.cardDescription.color }}>
                {project.softDocs.map((paragraph, index) => (
                  <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectModal
