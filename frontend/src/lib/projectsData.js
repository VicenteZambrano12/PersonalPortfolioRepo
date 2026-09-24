// Static content for each project card shown on the portfolio and its detail modal.
export const projectsData = {
  pauhelper: {
    title: 'PAUHelper',
    subtitle: 'AI Study Assistant',
    icon: 'ph-brain',
    description:
      'An intelligent assistant designed to help students prepare for exams using AI-driven tutoring, personalized study paths, and quick queries.',
    thumbUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop',
    fullDescription:
      'PAUHelper is a comprehensive study assistant designed to optimize exam preparation. It leverages large language models to generate practice questions, summarize notes, and act as a conversational tutor for specific academic subjects.',
    tags: ['Python', 'React', 'GCP'],
    modalTags: ['Python', 'FastAPI', 'React', 'GCP', 'OpenAI API', 'Docker'],
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
    icon: 'ph-database',
    description:
      'A centralized platform built to orchestrate, monitor, and manage complex data pipelines and serverless AI workloads securely and efficiently on Google Cloud Platform.',
    thumbUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    fullDescription:
      'A robust data orchestration platform that serves as a central hub for monitoring, managing, and triggering various AI-driven data processing pipelines. It ensures data flows securely between isolated instances.',
    tags: ['Python', 'Cloud Run', 'FastAPI'],
    modalTags: ['GCP Cloud Run', 'Python', 'FastAPI', 'Docker', 'HTML/CSS'],
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
    icon: 'ph-waveform',
    description:
      'An advanced voice generation and simulation tool leveraging LLMs and neural TTS models to create realistic, conversational audio outputs for various use cases.',
    thumbUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    fullDescription:
      'An advanced audio platform utilizing cutting-edge neural Text-to-Speech (TTS) models and LLMs to generate highly realistic, nuanced voice simulations for automated customer service, content creation, and accessibility.',
    tags: ['LangGraph', 'LLMs', 'React'],
    modalTags: ['Python', 'LangGraph', 'LLMs', 'Neural TTS', 'React', 'GCP'],
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
}
