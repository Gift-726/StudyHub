import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import YouTubePlayer from '../components/YouTubePlayer'
import CourseProgress from '../components/CourseProgress'
import { coursesAPI, progressAPI } from '../services/api'
import toast from 'react-hot-toast'

const CourseDetail = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [topics, setTopics] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourseDetails()
  }, [courseId])

  const fetchCourseDetails = async () => {
    try {
      setLoading(true)
      const response = await coursesAPI.getCourseDetails(courseId)
      setCourse(response.data.course)
      setTopics(response.data.topics)
      // Select first video by default
      if (response.data.topics.length > 0 && response.data.topics[0].videos.length > 0) {
        setSelectedTopic(response.data.topics[0])
        setSelectedVideo(response.data.topics[0].videos[0])
      }
    } catch (error) {
      console.error('Error fetching course:', error)
      toast.error('Failed to load course details')
    } finally {
      setLoading(false)
    }
  }

  const handleVideoSelect = async (video, topic) => {
    setSelectedVideo(video)
    setSelectedTopic(topic)
    // Track video watch start
    try {
      await progressAPI.trackVideoWatch(courseId, topic._id, video.youtubeId)
    } catch (error) {
      console.error('Error tracking video:', error)
    }
  }

  const handleVideoEnd = async () => {
    if (!selectedVideo || !selectedTopic) return
    // Mark video as completed
    try {
      await progressAPI.markVideoComplete(
        courseId, 
        selectedTopic._id, 
        selectedVideo.youtubeId,
        selectedVideo.duration || 0
      )
      toast.success('Video marked as completed!')
    } catch (error) {
      console.error('Error marking video complete:', error)
    }
  }

  const handleVideoProgress = async (progressData) => {
    if (!selectedVideo || !selectedTopic) return
    // Update watch time every 10 seconds
    try {
      await progressAPI.updateWatchTime(
        courseId, 
        selectedTopic._id, 
        selectedVideo.youtubeId, 
        progressData.currentTime
      )
    } catch (error) {
      console.error('Error updating watch time:', error)
    }
  }

  const getNextVideo = () => {
    if (!selectedTopic || !selectedVideo) return null
    
    const currentIndex = selectedTopic.videos.findIndex(v => v.youtubeId === selectedVideo.youtubeId)
    if (currentIndex < selectedTopic.videos.length - 1) {
      return { video: selectedTopic.videos[currentIndex + 1], topic: selectedTopic }
    }
    // Check next topic
    const topicIndex = topics.findIndex(t => t._id === selectedTopic._id)
    if (topicIndex < topics.length - 1 && topics[topicIndex + 1].videos.length > 0) {
      return { video: topics[topicIndex + 1].videos[0], topic: topics[topicIndex + 1] }
    }
    return null
  }

  const getPreviousVideo = () => {
    if (!selectedTopic || !selectedVideo) return null
    
    const currentIndex = selectedTopic.videos.findIndex(v => v.youtubeId === selectedVideo.youtubeId)
    if (currentIndex > 0) {
      return { video: selectedTopic.videos[currentIndex - 1], topic: selectedTopic }
    }
    // Check previous topic
    const topicIndex = topics.findIndex(t => t._id === selectedTopic._id)
    if (topicIndex > 0 && topics[topicIndex - 1].videos.length > 0) {
      const prevTopic = topics[topicIndex - 1]
      return { video: prevTopic.videos[prevTopic.videos.length - 1], topic: prevTopic }
    }
    return null
  }

  const formatDuration = (seconds) => {
    if (!seconds) return ''
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-gray-600">Loading course...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div>
        <button 
          onClick={() => navigate('/courses')} 
          className="mb-4 text-purple-brand hover:underline flex items-center gap-2"
        >
          <span>←</span> Back to Courses
        </button>
        
        <h1 className="text-3xl font-bold mb-6">{course?.title}</h1>

        <CourseProgress courseId={courseId} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Video Player Section */}
          <div className="lg:col-span-2 space-y-4">
            {selectedVideo ? (
              <>
                <YouTubePlayer 
                  videoId={selectedVideo.youtubeId}
                  onVideoEnd={handleVideoEnd}
                  onProgress={handleVideoProgress}
                />
                
                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      const prev = getPreviousVideo()
                      if (prev) {
                        handleVideoSelect(prev.video, prev.topic)
                      }
                    }}
                    disabled={!getPreviousVideo()}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => {
                      const next = getNextVideo()
                      if (next) {
                        handleVideoSelect(next.video, next.topic)
                      }
                    }}
                    disabled={!getNextVideo()}
                    className="px-4 py-2 btn-purple text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>

                {/* Video Info */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h2 className="text-xl font-bold mb-2">{selectedVideo.title}</h2>
                  {selectedVideo.description && (
                    <p className="text-gray-600 text-sm">{selectedVideo.description}</p>
                  )}
                  {selectedVideo.duration && (
                    <p className="text-sm text-gray-500 mt-2">Duration: {formatDuration(selectedVideo.duration)}</p>
                  )}
                </div>

                {/* Materials Section (PDFs, Past Questions) */}
                {selectedTopic && selectedTopic.materials && selectedTopic.materials.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <h3 className="text-lg font-bold mb-4">Study Materials</h3>
                    <div className="space-y-2">
                      {selectedTopic.materials.map((material, index) => (
                        <a
                          key={index}
                          href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${material.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
                        >
                          <span className="text-2xl">
                            {material.type === 'pdf' ? '📄' : material.type === 'past-question' ? '📝' : '📋'}
                          </span>
                          <div>
                            <p className="font-medium">{material.title}</p>
                            <p className="text-xs text-gray-500 capitalize">{material.type.replace('-', ' ')}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Select a video to start learning</p>
              </div>
            )}
          </div>

          {/* Topics and Videos Sidebar */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-xl font-bold mb-4">Course Content</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {topics.length > 0 ? (
                topics.map((topic) => (
                  <div key={topic._id}>
                    <h3 className="font-semibold text-gray-900 mb-2">{topic.title}</h3>
                    {topic.description && (
                      <p className="text-xs text-gray-500 mb-2">{topic.description}</p>
                    )}
                    <div className="space-y-2">
                      {topic.videos.map((video) => (
                        <button
                          key={video.youtubeId}
                          onClick={() => handleVideoSelect(video, topic)}
                          className={`
                            w-full text-left p-3 rounded-lg border transition-colors
                            ${selectedVideo?.youtubeId === video.youtubeId
                              ? 'border-purple-brand bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium line-clamp-2">{video.title}</span>
                          </div>
                          {video.duration && (
                            <span className="text-xs text-gray-500">
                              {formatDuration(video.duration)}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No content available yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CourseDetail

