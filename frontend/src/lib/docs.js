// Builds the static URL for a project's language-specific PDF doc under
// public/assets/projects/<slug>/docs/<language>/<fileName>.pdf.
export function getDocUrl(slug, language, fileName) {
  return `/assets/projects/${slug}/docs/${language}/${fileName}.pdf`
}
