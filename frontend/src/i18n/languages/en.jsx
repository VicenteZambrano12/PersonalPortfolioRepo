// English language dictionary.
export const en = {
  code: 'en',
  header: {
    subtitle: 'Cloud Solutions & AI App Developer',
  },
  portfolio: {
    heading: 'My Projects',
  },
  footer: {
    rights: 'All rights reserved.',
  },
  externalLink: {
    title: 'YouTube Channel',
    subtitle: 'Content Creator',
    tagline: '“AI explained for skeptics”',
    cta: 'Visit Channel',
  },
  modal: {
    videoWalkthrough: 'Video Walkthrough',
    description: 'Description',
    techStack: 'Tech Stack',
    openLiveApp: 'Open Live App',
    technicalDocs: 'Technical Docs',
    userGuide: 'User Guide & Logic',
  },
  languageSwitcher: {
    label: 'Language',
    en: 'English',
    es: 'Spanish',
  },
  projects: {
    pauhelper: {
      title: 'PAUHelper',
      subtitle: 'AI Study Assistant',
      description:
        'An intelligent assistant designed to help students prepare for exams using AI-driven tutoring, personalized study paths, and quick queries.',
      fullDescription:
        'PAUHelper is a comprehensive study assistant designed to optimize exam preparation. It leverages large language models to generate practice questions, summarize notes, and act as a conversational tutor for specific academic subjects.',
      techDocs: [
        '<strong>Frontend:</strong> React single-page application built with Vite and styled via Tailwind CSS.',
        '<strong>Backend:</strong> Stateless FastAPI microservice running in an isolated Docker container.',
        '<strong>Infrastructure:</strong> Deployed on Google Cloud Run for seamless autoscaling from zero to handle exam season spikes.',
        '<strong>Auth:</strong> JWT-based authentication flow.',
      ],
      softDocs: [
        'The core concept is to reduce the friction of studying by providing instant context. Instead of searching through textbooks, students can upload their syllabus and ask targeted questions.',
        '<strong>Use Case:</strong> A high school student preparing for final exams (PAU in Spain) needs to clarify a historical event. The app provides a summary tuned to the curriculum level.',
      ],
    },
    orchestratordata: {
      title: 'Orchestrator Data App',
      subtitle: 'Data Pipeline Manager',
      description:
        'A centralized platform built to orchestrate, monitor, and manage complex data pipelines and serverless AI workloads securely and efficiently on Google Cloud Platform.',
      fullDescription:
        'A robust data orchestration platform that serves as a central hub for monitoring, managing, and triggering various AI-driven data processing pipelines. It ensures data flows securely between isolated instances.',
      techDocs: [
        '<strong>Architecture:</strong> Acts as a central orchestrator. Triggers and monitors backend Cloud Run services using REST APIs and message queues.',
        '<strong>Deployment:</strong> Fully CI/CD automated via GitHub Actions to GCP Cloud Run.',
        '<strong>Security:</strong> Implements robust authentication and IAM policies to secure data pipeline execution.',
      ],
      softDocs: [
        'Designed for data engineering teams to easily monitor the health of their pipelines and trigger manual reruns without needing deep command-line access.',
        "<strong>Workflow:</strong> User logs into the portal, views active pipelines in a dashboard, and can click into specific jobs to view logs, performance metrics, and data lineage.",
      ],
    },
    voicesimulator: {
      title: 'Voice Simulator',
      subtitle: 'AI Audio Synthesis',
      description:
        'An advanced voice generation and simulation tool leveraging LLMs and neural TTS models to create realistic, conversational audio outputs for various use cases.',
      fullDescription:
        'An advanced audio platform utilizing cutting-edge neural Text-to-Speech (TTS) models and LLMs to generate highly realistic, nuanced voice simulations for automated customer service, content creation, and accessibility.',
      techDocs: [
        '<strong>Core Logic:</strong> Utilizes LangGraph to orchestrate conversation flow, sentiment analysis, and dynamic prompt generation before passing to the TTS engine.',
        '<strong>Audio Processing:</strong> Generates streaming audio chunks to minimize latency during live conversational simulations.',
        '<strong>Integration:</strong> Connects to external LLM providers and custom fine-tuned voice models.',
      ],
      softDocs: [
        "The Voice Simulator addresses the need for scalable, human-like voice interactions. It goes beyond robotic responses by injecting emotional cues based on the conversation's context.",
        '<strong>Business Value:</strong> Reduces support costs by handling complex, multi-turn phone inquiries while maintaining a high standard of customer experience through natural-sounding voices.',
      ],
    },
  },
}
