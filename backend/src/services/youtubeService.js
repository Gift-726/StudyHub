import { google } from 'googleapis'

const youtube = google.youtube('v3')

// Extract playlist ID from URL
export const extractPlaylistId = (url) => {
  // Handle different YouTube playlist URL formats
  const patterns = [
    /[?&]list=([a-zA-Z0-9_-]+)/, // Standard format
    /\/playlist\?list=([a-zA-Z0-9_-]+)/, // Alternative format
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return null
}

// Fetch playlist videos
export const fetchPlaylistVideos = async (playlistId, apiKey) => {
  try {
    let allVideos = []
    let nextPageToken = null

    // Fetch all pages of playlist (max 50 per page)
    do {
      const response = await youtube.playlistItems.list({
        key: apiKey,
        part: ['snippet', 'contentDetails'],
        playlistId: playlistId,
        maxResults: 50,
        pageToken: nextPageToken
      })

      const videos = response.data.items.map((item, index) => ({
        youtubeId: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description || '',
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
        order: allVideos.length + index
      }))

      allVideos = [...allVideos, ...videos]
      nextPageToken = response.data.nextPageToken || null
    } while (nextPageToken)

    // Get video durations in batches (50 at a time)
    for (let i = 0; i < allVideos.length; i += 50) {
      const batch = allVideos.slice(i, i + 50)
      const videoIds = batch.map(v => v.youtubeId).join(',')

      try {
        const videoDetails = await youtube.videos.list({
          key: apiKey,
          part: ['contentDetails'],
          id: videoIds
        })

        // Add durations to videos
        videoDetails.data.items.forEach((video) => {
          const duration = parseDuration(video.contentDetails.duration)
          const videoIndex = allVideos.findIndex(v => v.youtubeId === video.id)
          if (videoIndex !== -1) {
            allVideos[videoIndex].duration = duration
          }
        })
      } catch (error) {
        console.error('Error fetching video details:', error)
        // Continue even if duration fetch fails
      }
    }

    return allVideos
  } catch (error) {
    console.error('YouTube API Error:', error)
    throw new Error(`Failed to fetch playlist videos: ${error.message}`)
  }
}

// Parse ISO 8601 duration to seconds
const parseDuration = (duration) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  const hours = parseInt(match[1] || 0)
  const minutes = parseInt(match[2] || 0)
  const seconds = parseInt(match[3] || 0)
  return hours * 3600 + minutes * 60 + seconds
}

