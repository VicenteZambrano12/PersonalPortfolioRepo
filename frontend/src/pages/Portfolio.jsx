import { useCallback, useState } from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import YoutubeCard from '../components/YoutubeCard.jsx'
import YoutubeModal from '../components/YoutubeModal.jsx'
import ProjectModal from '../components/ProjectModal.jsx'
import MainLayout from '../layouts/MainLayout.jsx'
import { projectsData } from '../lib/projectsData.js'
import { getDocUrl } from '../lib/docs.js'
import { getStyles } from '../utils/styles.jsx'
import { createLogger } from '../utils/logger.js'

const log = createLogger('portfolio')

function Portfolio({ theme, onToggleTheme, language, onChangeLanguage, t }) {
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const styles = getStyles(theme)
  const translatedProjects = Object.fromEntries(
    Object.entries(projectsData).map(([id, project]) => [
      id,
      {
        ...project,
        ...t.projects[id],
        techDocUrl: getDocUrl(project.slug, language, 'techdoc'),
        nonTechDocUrl: getDocUrl(project.slug, language, 'nontechdoc'),
      },
    ])
  )
  const selectedProject = selectedProjectId ? translatedProjects[selectedProjectId] : null

  const handleSelectProject = (id) => {
    log.info('Project opened', { projectId: id })
    setSelectedProjectId(id)
  }

  const handleCloseProject = useCallback(() => {
    log.info('Project closed', { projectId: selectedProjectId })
    setSelectedProjectId(null)
  }, [selectedProjectId])

  return (
    <MainLayout
      theme={theme}
      header={<Header theme={theme} onToggleTheme={onToggleTheme} language={language} onChangeLanguage={onChangeLanguage} t={t} />}
      footer={<Footer theme={theme} t={t} />}
    >
      <div className="flex flex-wrap items-center justify-between gap-4" style={styles.header}>
        <h2 className="text-2xl font-semibold" style={styles.sectionHeading}>{t.portfolio.heading}</h2>
        <a
          href={getDocUrl('0-portfolio', language, 'systemdoc')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 transition-colors w-auto"
          style={{ ...styles.buttonSecondary, width: 'auto' }}
        >
          <i className="ph ph-file-pdf"></i> {t.portfolio.systemDocCta}
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {Object.entries(translatedProjects).map(([id, project]) => (
          <ProjectCard key={id} project={project} theme={theme} onSelect={() => handleSelectProject(id)} />
        ))}

        <YoutubeCard theme={theme} t={t.externalLink} onSelect={() => handleSelectProject('youtube')} />
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} theme={theme} t={t} onClose={handleCloseProject} />
      )}
      {selectedProjectId === 'youtube' && (
        <YoutubeModal theme={theme} t={t.externalLink} onClose={handleCloseProject} />
      )}
    </MainLayout>
  )
}

export default Portfolio
