import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Portfolio from '../../../pages/Portfolio.jsx'
import { en } from '../../../i18n/languages/en.jsx'
import { es } from '../../../i18n/languages/es.jsx'
import { projectsData } from '../../../lib/projectsData.js'
import { youtubeVideos } from '../../fixtures/youtube.js'

// Integration test: wires Portfolio together with real project data,
// translations and doc-url helpers, verifying the card -> modal -> close flow.
describe('Portfolio (integration)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => youtubeVideos }))
  })
  afterEach(() => vi.unstubAllGlobals())

  it('opens the latest YouTube videos in a popup from its card', async () => {
    const user = userEvent.setup()
    render(
      <Portfolio theme="dark" onToggleTheme={() => {}} language="en" onChangeLanguage={() => {}} t={en} />
    )

    expect(screen.getByText(en.projects.pauhelper.title)).toBeInTheDocument()
    expect(screen.getByText(en.projects.orchestratordata.title)).toBeInTheDocument()
    expect(screen.getByText(en.projects.voicesimulator.title)).toBeInTheDocument()
    expect(screen.getByText(en.externalLink.title)).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
    const card = screen.getByRole('button', { name: /YouTube Channel/ })
    await user.click(card)
    const dialog = screen.getByRole('dialog', { name: en.externalLink.title })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(await screen.findByRole('link', { name: youtubeVideos[0].title })).toHaveAttribute('href', youtubeVideos[0].url)
    expect(within(dialog).getAllByRole('listitem')).toHaveLength(3)
    expect(document.body.style.overflow).toBe('hidden')
    await user.click(within(dialog).getByRole('button', { name: en.externalLink.close }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe('')
    expect(card).toHaveFocus()
  })

  it('traps keyboard focus and closes on Escape or a backdrop click, but not content clicks', async () => {
    const user = userEvent.setup()
    render(
      <Portfolio theme="dark" onToggleTheme={() => {}} language="en" onChangeLanguage={() => {}} t={en} />
    )
    const card = screen.getByRole('button', { name: /YouTube Channel/ })
    await user.click(card)
    const dialog = screen.getByRole('dialog')
    const close = within(dialog).getByRole('button', { name: 'Close' })
    await screen.findByRole('list')
    expect(close).toHaveFocus()
    await user.tab({ shift: true })
    expect(within(dialog).getByRole('link', { name: en.externalLink.cta })).toHaveFocus()
    await user.tab()
    expect(close).toHaveFocus()
    await user.click(within(dialog).getByText(en.externalLink.latestVideos))
    expect(dialog).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(card).toHaveFocus()
    await user.keyboard('{Enter}')
    await user.click(screen.getByRole('dialog').parentElement)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(card).toHaveFocus()
  })

  it('opens the project modal with the right content when a card is clicked', async () => {
    const user = userEvent.setup()
    render(
      <Portfolio theme="dark" onToggleTheme={() => {}} language="en" onChangeLanguage={() => {}} t={en} />
    )

    await user.click(screen.getByText(en.projects.pauhelper.title))

    expect(screen.getByText(en.projects.pauhelper.fullDescription)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: en.modal.viewTechnicalPresentation }))
    expect(screen.getByTitle(`PAUHelper - ${en.modal.technicalPresentation}`)).toHaveAttribute(
      'src', '/src/features/docs/1-pauhelper/technical.html?lang=en&embed=1'
    )
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText(en.projects.pauhelper.fullDescription)).toBeInTheDocument()
  })

  it.each([en, es])('opens every project and portfolio deck in the same window ($code)', async (t) => {
    const user = userEvent.setup()
    render(
      <Portfolio theme="dark" onToggleTheme={() => {}} language={t.code} onChangeLanguage={() => {}} t={t} />
    )
    for (const audience of ['business', 'technical']) {
      const trigger = screen.getByRole('button', { name: t.portfolio[`${audience}Presentation`] })
      await user.click(trigger)
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
      expect(screen.getByTitle(`Personal Portfolio - ${t.modal[`${audience}Presentation`]}`))
        .toHaveAttribute('src', `/src/features/docs/0-portfolio/${audience}.html?lang=${t.code}&embed=1`)
      await user.click(screen.getAllByRole('button', { name: t.presentation.close })[0])
      expect(trigger).toHaveFocus()
    }
    for (const [id, project] of Object.entries(projectsData)) {
      await user.click(screen.getByText(t.projects[id].title))
      for (const audience of ['business', 'technical']) {
        const name = audience === 'business' ? t.modal.viewBusinessPresentation : t.modal.viewTechnicalPresentation
        await user.click(screen.getByRole('button', { name }))
        expect(screen.getByTitle(`${t.projects[id].title} - ${t.modal[`${audience}Presentation`]}`))
          .toHaveAttribute('src', `/src/features/docs/${project.slug}/${audience}.html?lang=${t.code}&embed=1`)
        await user.click(screen.getAllByRole('button', { name: t.presentation.close })[0])
      }
      await user.click(screen.getByRole('button', { name: 'Close' }))
    }
  })

  it.each([en, es])('shows the README-aligned PAUHelper card and details ($code)', async (t) => {
    const user = userEvent.setup()
    render(
      <Portfolio theme="dark" onToggleTheme={() => {}} language={t.code} onChangeLanguage={() => {}} t={t} />
    )
    const card = screen.getByText('PAUHelper').closest('.project-card')
    expect(within(card).getByText(t.projects.pauhelper.subtitle)).toHaveTextContent('EBAU')
    expect(within(card).getByText(t.projects.pauhelper.description)).toHaveTextContent('EBAU')
    for (const label of ['RAG', 'Gemini', 'React', 'GCP']) {
      expect(within(card).getByText(label)).toBeInTheDocument()
    }
    await user.click(within(card).getByText('PAUHelper'))
    const description = screen.getByText(t.projects.pauhelper.fullDescription)
    expect(description).toHaveTextContent('Android')
    const details = description.closest('.custom-scrollbar')
    for (const label of ['FastAPI', 'LangGraph', 'Vertex AI', 'Qdrant', 'Terraform']) {
      expect(within(details).getByText(label)).toBeInTheDocument()
    }
    expect(screen.queryByText('OpenAI API')).not.toBeInTheDocument()
  })

  it('closes the modal when the close button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <Portfolio theme="dark" onToggleTheme={() => {}} language="en" onChangeLanguage={() => {}} t={en} />
    )

    await user.click(screen.getByText(en.projects.pauhelper.title))
    expect(screen.getByText(en.projects.pauhelper.fullDescription)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByText(en.projects.pauhelper.fullDescription)).not.toBeInTheDocument()
  })

  it('propagates theme toggle and language change callbacks from the header', async () => {
    const user = userEvent.setup()
    const onToggleTheme = vi.fn()
    const onChangeLanguage = vi.fn()
    render(
      <Portfolio
        theme="dark"
        onToggleTheme={onToggleTheme}
        language="en"
        onChangeLanguage={onChangeLanguage}
        t={en}
      />
    )

    await user.click(screen.getByRole('button', { name: /toggle color theme/i }))
    expect(onToggleTheme).toHaveBeenCalledTimes(1)

    await user.selectOptions(screen.getByRole('combobox'), 'es')
    expect(onChangeLanguage).toHaveBeenCalledWith('es')
  })
})
