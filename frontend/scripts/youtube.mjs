import { validateYoutubeVideos } from '../src/lib/youtube.js'

export function extractYoutubeVideos(html) {
  const match = html.match(/(?:var\s+)?ytInitialData\s*=\s*(\{.*?\});\s*<\/script>/s)
  if (!match) throw new Error('YouTube page has no initial video data')

  const data = JSON.parse(match[1])
  const tab = data.contents?.twoColumnBrowseResultsRenderer?.tabs
    ?.find((item) => item.tabRenderer?.selected)?.tabRenderer
  const tabUrl = tab?.endpoint?.commandMetadata?.webCommandMetadata?.url
  if (!tabUrl?.endsWith('/videos')) throw new Error('YouTube did not return the Videos tab')

  const items = tab.content?.richGridRenderer?.contents
  if (!Array.isArray(items)) throw new Error('YouTube Videos tab has no video grid')

  const videos = []
  for (const item of items) {
    const content = item.richItemRenderer?.content
    const lockup = content?.lockupViewModel
    const renderer = content?.videoRenderer
    let id
    let title
    let path
    if (lockup?.contentType === 'LOCKUP_CONTENT_TYPE_VIDEO') {
      id = lockup.contentId
      title = lockup.metadata?.lockupMetadataViewModel?.title?.content
      path = lockup.rendererContext?.commandContext?.onTap?.innertubeCommand
        ?.commandMetadata?.webCommandMetadata?.url
    } else if (renderer) {
      id = renderer.videoId
      title = renderer.title?.simpleText ?? renderer.title?.runs?.map((run) => run.text).join('')
      path = renderer.navigationEndpoint?.commandMetadata?.webCommandMetadata?.url
    } else {
      continue
    }

    // Only watch entries from the Videos tab qualify; Shorts use separate renderers/routes.
    if (!path?.startsWith('/watch?')) continue
    if (!videos.some((video) => video.id === id)) {
      videos.push({ id, title, url: `https://www.youtube.com/watch?v=${id}` })
    }
    if (videos.length === 3) break
  }

  return validateYoutubeVideos(videos)
}
