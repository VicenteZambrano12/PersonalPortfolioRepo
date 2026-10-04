export const pauhelperConfig = {
  slug: '1-pauhelper',
  icon: 'ph-brain',
  liveUrl: import.meta.env.VITE_PAUHELPER_LIVE_URL,
  // On-demand Qdrant VM starter (see infra/modules/qdrant_vm_starter in the
  // BasicRAGapp repo). Called best-effort when this project's "Open Live
  // App" link is clicked, since the VM auto-shuts down after 30 idle
  // minutes and only this public Cloud Function can wake it back up.
  vmStarterUrl: import.meta.env.VITE_QDRANT_VM_STARTER_URL,
  thumbUrl:
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop',
  tags: ['Python', 'React', 'GCP'],
  modalTags: ['Python', 'FastAPI', 'React', 'GCP', 'OpenAI API', 'Docker'],
}
