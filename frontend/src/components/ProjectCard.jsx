import { getStyles } from '../utils/styles.jsx'

function ProjectCard({ project, theme, onSelect, cta }) {
  const styles = getStyles(theme)

  return (
    <div
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-label={project.title}
      className="project-card group text-left hover:shadow-xl cursor-pointer flex flex-col h-full min-w-0"
      style={styles.card}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect()
        }
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div style={styles.iconBox}>
          <i className={`ph ${project.icon} text-2xl`} aria-hidden="true"></i>
        </div>
        <div>
          <h3 style={styles.cardTitle}>{project.title}</h3>
          <p style={styles.cardSubtitle}>{project.subtitle}</p>
        </div>
      </div>
      <p className="flex-grow" style={styles.cardDescription}>{project.description}</p>
      <div style={styles.tagContainer} className="mt-auto">
        {project.tags.map((tag) => (
          <span key={tag} style={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
      {cta && (
        <span className="card-action mt-6 pt-4 flex items-center justify-between gap-3 text-sm font-semibold" style={styles.sectionIcon}>
          {cta} <i className="ph ph-arrow-up-right text-lg" aria-hidden="true"></i>
        </span>
      )}
    </div>
  )
}

export default ProjectCard
