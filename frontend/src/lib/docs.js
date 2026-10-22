export function getPresentationUrl(slug, language, audience) {
  return `/src/features/docs/${slug}/${audience}.html?lang=${language}`
}
