import { useState } from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import ExternalLinkCard from '../components/ExternalLinkCard.jsx'
import ProjectModal from '../components/ProjectModal.jsx'
import MainLayout from '../layouts/MainLayout.jsx'
import { projectsData } from '../lib/projectsData.js'
import { getStyles } from '../utils/styles.jsx'
import robotIcon from '../assets/robot-icon.png'

function Portfolio({ theme, onToggleTheme, language, onChangeLanguage, t }) {
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const styles = getStyles(theme)
  const translatedProjects = Object.fromEntries(
    Object.entries(projectsData).map(([id, project]) => [id, { ...project, ...t.projects[id] }])
  )
  const selectedProject = selectedProjectId ? translatedProjects[selectedProjectId] : null

  return (
    <MainLayout
      theme={theme}
      header={<Header theme={theme} onToggleTheme={onToggleTheme} language={language} onChangeLanguage={onChangeLanguage} t={t} />}
      footer={<Footer theme={theme} t={t} />}
    >
      <div className="flex flex-wrap items-center justify-between gap-4" style={styles.header}>
        <h2 className="text-2xl font-semibold" style={styles.sectionHeading}>{t.portfolio.heading}</h2>
        <a
          href="/assets/projects/0-portfolio/systemdoc.pdf"
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
          <ProjectCard key={id} project={project} theme={theme} onSelect={() => setSelectedProjectId(id)} />
        ))}

        <ExternalLinkCard
          href="https://youtube.com/"
          icon="ph-youtube-logo"
          iconImage={robotIcon}
          title={t.externalLink.title}
          subtitle={t.externalLink.subtitle}
          tagline={t.externalLink.tagline}
          cta={t.externalLink.cta}
          theme={theme}
        />
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} theme={theme} t={t} onClose={() => setSelectedProjectId(null)} />
      )}
    </MainLayout>
  )
}

export default Portfolio
