import { getStyles } from '../utils/styles.jsx'

function ProjectCard({ project, theme, onSelect }) {
  const styles = getStyles(theme)

  return (
    <div
      className="project-card group rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col h-full"
      style={styles.card}
      onClick={onSelect}
    >
      <div className="flex items-center gap-4 mb-4">
        <div style={styles.iconBox}>
          <i className={`ph ${project.icon} text-2xl`}></i>
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
    </div>
  )
}

export default ProjectCard
