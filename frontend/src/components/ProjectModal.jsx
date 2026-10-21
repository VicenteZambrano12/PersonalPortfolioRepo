import { useRef } from 'react'
import { getStyles } from '../utils/styles.jsx'
import { createLogger } from '../utils/logger.js'
import { useModalFocus } from '../utils/useModalFocus.js'

const log = createLogger('project-modal')

function ProjectModal({ project, theme, t, onClose, onOpenPresentation }) {
  const styles = getStyles(theme)
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  useModalFocus(dialogRef, closeRef, onClose)

  return (
    <div
      className="flex items-center justify-center p-4 sm:p-6"
      style={styles.modalOverlay}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90dvh] flex flex-col overflow-hidden animate-modal-enter"
        style={styles.modalContent}
      >
        <div className="flex items-center justify-between gap-4 p-5 sm:p-6" style={styles.modalHeader}>
          <div>
            <h3 id="project-modal-title" className="text-2xl font-bold" style={styles.cardTitle}>{project.title}</h3>
            <p className="font-medium" style={styles.cardSubtitle}>{project.subtitle}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-colors"
            style={styles.closeButton}
            aria-label={t.modal.close}
          >
            <i className="ph ph-x text-xl" aria-hidden="true"></i>
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-grow" style={styles.modalBody}>
          <div className="w-full aspect-[21/9] rounded-xl mb-8 relative overflow-hidden shadow-md" style={styles.videoFrame}>
            <img
              src={project.thumbUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
            <div className="lg:col-span-2">
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2" style={styles.panelHeading}>
                <i className="ph ph-info" style={styles.sectionIcon} aria-hidden="true"></i> {t.modal.description}
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
                {project.liveUrl ? <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    // Best-effort: wake the demo's on-demand Qdrant VM (it
                    // auto-shuts down after 30 idle minutes). Never blocks
                    // or delays opening the live app link.
                    if (project.vmStarterUrl) {
                      fetch(project.vmStarterUrl).catch((error) =>
                        log.warn('Qdrant VM starter call failed', { error: error.message })
                      )
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 transition-colors"
                  style={styles.buttonPrimary}
                >
                  {t.modal.openLiveApp} <i className="ph ph-arrow-up-right" aria-hidden="true"></i>
                </a> : (
                  <>
                    <button
                      type="button"
                      disabled
                      aria-describedby="demo-unavailable"
                      className="w-full flex items-center justify-center gap-2"
                      style={styles.buttonPrimary}
                    >
                      {t.modal.openLiveApp} <i className="ph ph-arrow-up-right" aria-hidden="true"></i>
                    </button>
                    <p id="demo-unavailable" className="mt-3 text-sm" style={styles.socialIcon}>
                      {t.modal.demoUnavailable}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl" style={styles.panel}>
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2 pb-3" style={styles.panelHeading}>
                <i className="ph ph-chart-line" style={styles.sectionIcon} aria-hidden="true"></i> {t.modal.businessPresentation}
              </h4>
              <button
                type="button"
                onClick={() => onOpenPresentation(project, 'business')}
                className="flex items-center justify-center gap-2 transition-colors"
                style={styles.buttonSecondary}
              >
                <i className="ph ph-presentation" aria-hidden="true"></i> {t.modal.viewBusinessPresentation}
              </button>
            </div>

            <div className="p-6 rounded-xl" style={styles.panel}>
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2 pb-3" style={styles.panelHeading}>
                <i className="ph ph-code" style={styles.sectionIcon} aria-hidden="true"></i> {t.modal.technicalPresentation}
              </h4>
              <button
                type="button"
                onClick={() => onOpenPresentation(project, 'technical')}
                className="flex items-center justify-center gap-2 transition-colors"
                style={styles.buttonSecondary}
              >
                <i className="ph ph-presentation" aria-hidden="true"></i> {t.modal.viewTechnicalPresentation}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectModal
