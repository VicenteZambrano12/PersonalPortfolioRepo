import { useCallback, useState } from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import YoutubeCard from '../components/YoutubeCard.jsx'
import YoutubeModal from '../components/YoutubeModal.jsx'
import ProjectModal from '../components/ProjectModal.jsx'
import PresentationModal from '../components/PresentationModal.jsx'
import MainLayout from '../layouts/MainLayout.jsx'
import { projectsData } from '../lib/projectsData.js'
import { getPresentationUrl } from '../lib/docs.js'
import { getStyles } from '../utils/styles.jsx'
import { createLogger } from '../utils/logger.js'

const log = createLogger('portfolio')

function Portfolio({ theme, onToggleTheme, language, onChangeLanguage, t }) {
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [selectedPresentation, setSelectedPresentation] = useState(null)
  const styles = getStyles(theme)
  const translatedProjects = Object.fromEntries(
    Object.entries(projectsData).map(([id, project]) => [
      id,
      {
        ...project,
        ...t.projects[id],
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

  const handleClosePresentation = useCallback(() => setSelectedPresentation(null), [])
  const handleOpenPresentation = (project, audience) => {
    setSelectedPresentation({
      url: getPresentationUrl(project.slug, language, audience),
      title: `${project.title} - ${t.modal[`${audience}Presentation`]}`,
    })
  }

  return (
    <>
    <div inert={Boolean(selectedPresentation)}>
    <a href="#main-content" className="skip-link">{t.portfolio.skipToContent}</a>
    <MainLayout
      theme={theme}
      header={<Header theme={theme} onToggleTheme={onToggleTheme} language={language} onChangeLanguage={onChangeLanguage} t={t} />}
      footer={<Footer theme={theme} t={t} />}
    >
      <section className="rounded-3xl p-6 sm:p-10 mb-10 flex items-center justify-between gap-8 overflow-hidden" style={styles.hero} aria-labelledby="intro-heading">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] mb-4" style={styles.siteHeaderSubtitle}>{t.portfolio.eyebrow}</p>
          <h2 id="intro-heading" className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-5">{t.portfolio.intro}</h2>
          <p className="text-base sm:text-lg leading-relaxed mb-6" style={styles.socialIcon}>{t.portfolio.description}</p>
          <a href="#projects" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold" style={styles.themeToggle}>
            {t.portfolio.explore} <i className="ph ph-arrow-down" aria-hidden="true"></i>
          </a>
        </div>
        <img src="/logo.png" alt="" width="224" height="224" className="hero-logo brand-logo hidden md:block w-40 lg:w-56 h-auto shrink-0" />
      </section>
      <section id="projects" className="scroll-mt-6" aria-labelledby="projects-heading">
      <div className="flex flex-wrap items-center justify-between gap-4" style={styles.header}>
        <div>
          <h2 id="projects-heading" className="text-2xl font-bold" style={styles.sectionHeading}>{t.portfolio.heading}</h2>
          <p className="mt-2 text-sm" style={styles.socialIcon}>{t.portfolio.projectHint}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {['business', 'technical'].map((audience) => (
            <button
              key={audience}
              type="button"
              onClick={() => handleOpenPresentation({ slug: '0-portfolio', title: 'Personal Portfolio' }, audience)}
              className="inline-flex items-center gap-2 transition-colors"
              style={{ ...styles.buttonSecondary, width: 'auto' }}
            >
              <i className={`ph ${audience === 'business' ? 'ph-chart-line' : 'ph-code'}`} aria-hidden="true"></i> {t.portfolio[`${audience}Presentation`]}
            </button>
          ))}
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2"
            style={{ ...styles.buttonSecondary, width: 'auto' }}
          >
            <i className="ph ph-video-camera" aria-hidden="true"></i> {t.portfolio.video}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {Object.entries(translatedProjects).map(([id, project]) => (
          <ProjectCard key={id} project={project} theme={theme} cta={t.portfolio.viewProject} onSelect={() => handleSelectProject(id)} />
        ))}

        <YoutubeCard theme={theme} t={t.externalLink} onSelect={() => handleSelectProject('youtube')} />
      </div>
      </section>

      {selectedProject && (
        <ProjectModal project={selectedProject} theme={theme} t={t} onClose={handleCloseProject} onOpenPresentation={handleOpenPresentation} />
      )}
      {selectedProjectId === 'youtube' && (
        <YoutubeModal theme={theme} t={t.externalLink} onClose={handleCloseProject} />
      )}
    </MainLayout>
    </div>
    {selectedPresentation && (
      <PresentationModal presentation={selectedPresentation} theme={theme} t={t.presentation} onClose={handleClosePresentation} />
    )}
    </>
  )
}

export default Portfolio
