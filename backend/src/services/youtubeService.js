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
    
    // Handle network/DNS errors
    if (error.code === 'EAI_AGAIN' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error('Network error: Unable to connect to YouTube API. Please check your internet connection and try again.')
    }
    
    // Handle API errors
    if (error.response) {
      const status = error.response.status
      if (status === 403) {
        throw new Error('YouTube API access denied. Please check your API key and quota.')
      } else if (status === 404) {
        throw new Error('Playlist not found. Please check if the playlist URL is correct and the playlist is publicly available.')
      } else if (status === 400) {
        throw new Error('Invalid request. Please check the playlist URL format.')
      } else {
        throw new Error(`YouTube API error (${status}): ${error.response.data?.error?.message || error.message}`)
      }
    }
    
    // Handle other errors
    if (error.message) {
      throw new Error(`Failed to fetch playlist videos: ${error.message}`)
    }
    
    throw new Error('Failed to fetch playlist videos. Please try again later.')
  }
}

// Extract video ID from URL
export const extractVideoId = (url) => {
  // Handle different YouTube video URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/, // Standard formats
    /youtube\.com\/watch\?.*&v=([a-zA-Z0-9_-]+)/, // With other parameters
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return null
}

// Fetch single video details
export const fetchSingleVideo = async (videoId, apiKey) => {
  try {
    const response = await youtube.videos.list({
      key: apiKey,
      part: ['snippet', 'contentDetails'],
      id: [videoId]
    })

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('Video not found')
    }

    const video = response.data.items[0]
    const duration = parseDuration(video.contentDetails.duration)

    return {
      youtubeId: video.id,
      title: video.snippet.title,
      description: video.snippet.description || '',
      thumbnail: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.default?.url || '',
      duration: duration,
      order: 0
    }
  } catch (error) {
    console.error('YouTube API Error:', error)
    
    // Handle network/DNS errors
    if (error.code === 'EAI_AGAIN' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error('Network error: Unable to connect to YouTube API. Please check your internet connection and try again.')
    }
    
    // Handle API errors
    if (error.response) {
      const status = error.response.status
      if (status === 403) {
        throw new Error('YouTube API access denied. Please check your API key and quota.')
      } else if (status === 404) {
        throw new Error('Video not found. Please check if the video URL is correct and the video is publicly available.')
      } else if (status === 400) {
        throw new Error('Invalid request. Please check the video URL format.')
      } else {
        throw new Error(`YouTube API error (${status}): ${error.response.data?.error?.message || error.message}`)
      }
    }
    
    // Handle other errors
    if (error.message) {
      throw new Error(`Failed to fetch video: ${error.message}`)
    }
    
    throw new Error('Failed to fetch video. Please try again later.')
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

