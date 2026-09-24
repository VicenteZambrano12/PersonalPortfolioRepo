import { useState } from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import ExternalLinkCard from '../components/ExternalLinkCard.jsx'
import ProjectModal from '../components/ProjectModal.jsx'
import MainLayout from '../layouts/MainLayout.jsx'
import { projectsData } from '../lib/projectsData.js'
import { getStyles } from '../utils/styles.jsx'
import robotIcon from '../assets/robot-icon.svg'

function Portfolio({ theme, onToggleTheme }) {
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const selectedProject = selectedProjectId ? projectsData[selectedProjectId] : null
  const styles = getStyles(theme)

  return (
    <MainLayout
      theme={theme}
      header={<Header theme={theme} onToggleTheme={onToggleTheme} />}
      footer={<Footer theme={theme} />}
    >
      <div style={styles.header}>
        <h2 className="text-2xl font-semibold" style={styles.sectionHeading}>My Projects</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {Object.entries(projectsData).map(([id, project]) => (
          <ProjectCard key={id} project={project} theme={theme} onSelect={() => setSelectedProjectId(id)} />
        ))}

        <ExternalLinkCard
          href="https://youtube.com/"
          icon="ph-youtube-logo"
          iconImage={robotIcon}
          title="YouTube Channel"
          subtitle="Content Creator"
          tagline="&ldquo;La IA explicada para escépticos&rdquo;"
          cta="Visit Channel"
          theme={theme}
        />
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} theme={theme} onClose={() => setSelectedProjectId(null)} />
      )}
    </MainLayout>
  )
}

export default Portfolio
