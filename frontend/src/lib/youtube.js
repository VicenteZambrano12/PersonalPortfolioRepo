export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@laiaexplicadaparaescepticos'

export function validateYoutubeVideos(videos) {
  if (
    !Array.isArray(videos) ||
    videos.length !== 3 ||
    new Set(videos.map((video) => video?.id)).size !== 3 ||
    videos.some((video) =>
      !video ||
      !/^[A-Za-z0-9_-]{11}$/.test(video.id) ||
      typeof video.title !== 'string' ||
      !video.title.trim() ||
      video.url !== `https://www.youtube.com/watch?v=${video.id}`
    )
  ) {
    throw new Error('Expected three distinct YouTube videos with titles and watch links')
  }
  return videos
}
