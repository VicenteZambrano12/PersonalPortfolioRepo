// English language dictionary.
export const en = {
  code: 'en',
  header: {
    subtitle: 'Cloud Solutions & AI App Developer',
    signOut: 'Sign out',
    toggleTheme: 'Toggle color theme',
    lightTheme: 'Switch to light mode',
    darkTheme: 'Switch to dark mode',
  },
  portfolio: {
    heading: 'My Projects',
    skipToContent: 'Skip to content',
    eyebrow: 'Cloud engineering · Applied AI',
    intro: 'Ideas into intelligent experiences.',
    description: 'Explore the apps I build, the systems behind them, and the ideas I share. Practical cloud solutions and AI, made approachable.',
    explore: 'Explore my work',
    projectHint: 'Explore a project, try the app, or dive into its design.',
    viewProject: 'Explore project',
    businessPresentation: 'Portfolio: Business Overview',
    technicalPresentation: 'Portfolio: How it works?',
    video: 'Portfolio: Video — coming soon',
  },
  footer: {
    rights: 'All rights reserved.',
  },
  presentation: {
    close: 'Close presentation',
    loading: 'Loading slides…',
    error: 'The presentation could not load. Close it and try again.',
    hint: 'Use arrows or swipe to navigate. Esc closes the presentation.',
  },
  externalLink: {
    title: 'YouTube Channel',
    subtitle: 'Content Creator',
    tagline: '“AI explained for skeptics”',
    cta: 'Visit Channel',
    latestVideos: 'Latest videos',
    openVideos: 'View latest videos',
    close: 'Close',
    videosLoading: 'Loading latest videos…',
    videosError: 'Videos could not be loaded. Visit the channel to watch the latest videos.',
  },
  modal: {
    close: 'Close',
    videoWalkthrough: 'Video Walkthrough',
    description: 'Description',
    techStack: 'Tech Stack',
    openLiveApp: 'Open Live App',
    demoUnavailable: 'The demo link is not configured for this project yet.',
    technicalPresentation: 'How it works?',
    businessPresentation: 'Business Overview',
    viewTechnicalPresentation: 'How it works?',
    viewBusinessPresentation: 'Business Overview',
  },
  languageSwitcher: {
    label: 'Language',
    en: 'English',
    es: 'Spanish',
  },
  projects: {
    pauhelper: {
      title: 'PAUHelper',
      subtitle: 'EBAU Study Assistant',
      description:
        'Prepare for the EBAU with answers grounded in study documents, tailored to your subject and autonomous community, with source references you can check.',
      fullDescription:
        'PAUHelper helps Spanish students prepare for the EBAU university entrance exams. Select a subject and autonomous community, ask a question, and receive an answer grounded in relevant study materials with exam-specific instructions and source references. References help you verify the original documents, but do not guarantee correctness. BasicRAGapp is the code used to power the original Android app; this version provides a React web interface.',
    },
    orchestratordata: {
      title: 'Orchestrator Data App',
      subtitle: 'Intent-Based AI Fitness Assistant',
      description:
        'Form routes fitness questions to specialized AI agents to explain exercises with reference images, create workout routines, and review logged training progress using controlled SQL queries.',
      fullDescription:
        'Form is a gym application that demonstrates intent-based AI orchestration. A Gemini-powered orchestrator selects a specialized agent to explain exercises, create routines, or analyze logged workouts; a Python pipeline executes the selected task using predefined, parameterized SQL queries. The React interface presents exercise images, routine previews that require explicit save confirmation, and data-backed progress reports. Users can also follow saved routines and record completed sets outside chat. FastAPI supports SQLite locally and Neon PostgreSQL in the cloud, with frontend and backend deployed together on GCP Cloud Run using Docker, Terraform, and GitHub Actions. Conversation memory and routine drafts use process-local fakeredis and are not durable.',
    },
    voicesimulator: {
      title: 'Plinius',
      subtitle: 'AI Voice Tourist Guide',
      description:
        'Explore Rome with a real-time AI voice guide. Plinius grounds answers about historic sites and local restaurants in curated sources you can verify.',
      fullDescription:
        'Plinius is an AI tourist guide for Rome. Select a stop on the route and ask questions about its history or nearby restaurants using voice or text in English or Spanish. Its retrieval-augmented generation (RAG) pipeline grounds answers in curated documents and shows the source pages, while configurable speech-to-text and text-to-speech layers provide a natural voice conversation.',
    },
  },
}
