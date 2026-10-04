import { describe, expect, it } from 'vitest'
import { extractYoutubeVideos } from '../../../../scripts/youtube.mjs'
import { validateYoutubeVideos } from '../../../lib/youtube.js'
import { youtubeVideos } from '../../fixtures/youtube.js'

const lockup = (video, path = `/watch?v=${video.id}`) => ({
  richItemRenderer: {
    content: {
      lockupViewModel: {
        contentType: 'LOCKUP_CONTENT_TYPE_VIDEO',
        contentId: video.id,
        metadata: { lockupMetadataViewModel: { title: { content: video.title } } },
        rendererContext: {
          commandContext: {
            onTap: { innertubeCommand: { commandMetadata: { webCommandMetadata: { url: path } } } },
          },
        },
      },
    },
  },
})

const page = (items, path = '/@channel/videos') => {
  const data = {
    contents: {
      twoColumnBrowseResultsRenderer: {
        tabs: [
          { tabRenderer: { content: { richGridRenderer: { contents: [lockup(youtubeVideos[2])] } } } },
          { tabRenderer: {
            selected: true,
            endpoint: { commandMetadata: { webCommandMetadata: { url: path } } },
            content: { richGridRenderer: { contents: items } },
          } },
        ],
      },
    },
  }
  return `<script>var ytInitialData = ${JSON.stringify(data)};</script>`
}

describe('YouTube extraction', () => {
  it('keeps the latest three watch entries in tab order, ignoring Shorts, duplicates and older videos', () => {
    const html = page([
      { richItemRenderer: { content: { shortsLockupViewModel: { entityId: 'short' } } } },
      lockup({ id: 'SHORTS12345', title: 'Short' }, '/shorts/SHORTS12345'),
      lockup(youtubeVideos[0]),
      lockup(youtubeVideos[0]),
      lockup(youtubeVideos[1]),
      lockup(youtubeVideos[2]),
      lockup({ id: 'older123456', title: 'Older upload' }),
    ])
    expect(extractYoutubeVideos(html)).toEqual(youtubeVideos)
  })

  it('supports the classic video renderer and preserves full title text', () => {
    const items = youtubeVideos.map((video) => ({
      richItemRenderer: { content: { videoRenderer: {
        videoId: video.id,
        title: { runs: [{ text: video.title }, { text: ' & more' }] },
        navigationEndpoint: { commandMetadata: { webCommandMetadata: { url: `/watch?v=${video.id}` } } },
      } } },
    }))
    expect(extractYoutubeVideos(page(items))).toEqual(
      youtubeVideos.map((video) => ({ ...video, title: `${video.title} & more` })),
    )
  })

  it('fails explicitly for missing data, a wrong tab or insufficient videos', () => {
    expect(() => extractYoutubeVideos('<html>Consent required</html>')).toThrow('no initial video data')
    expect(() => extractYoutubeVideos(page(youtubeVideos.map((video) => lockup(video)), '/@channel/shorts'))).toThrow('Videos tab')
    expect(() => extractYoutubeVideos(page([lockup(youtubeVideos[0])]))).toThrow('three distinct')
  })
})

describe('YouTube data validation', () => {
  it('accepts exactly three distinct video titles and watch URLs', () => {
    expect(validateYoutubeVideos(youtubeVideos)).toEqual(youtubeVideos)
  })

  it.each([
    null,
    [],
    [...youtubeVideos, youtubeVideos[0]],
    [youtubeVideos[0], youtubeVideos[0], youtubeVideos[2]],
    [{ ...youtubeVideos[0], title: ' ' }, ...youtubeVideos.slice(1)],
    [{ ...youtubeVideos[0], url: 'https://www.youtube.com/shorts/abcdefghijk' }, ...youtubeVideos.slice(1)],
    [{ ...youtubeVideos[0], id: 'invalid' }, ...youtubeVideos.slice(1)],
  ])('rejects malformed or non-watch data: %j', (data) => {
    expect(() => validateYoutubeVideos(data)).toThrow('three distinct')
  })
})
