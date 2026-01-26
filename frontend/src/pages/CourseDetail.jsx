import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import YouTubePlayer from '../components/YouTubePlayer'
import { coursesAPI, progressAPI } from '../services/api'
import toast from 'react-hot-toast'

const CourseDetail = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [topics, setTopics] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('overview') // 'overview' or 'learning'
  const [showOutline, setShowOutline] = useState(false)
  const [courseProgress, setCourseProgress] = useState(null)
  const [completedVideoIds, setCompletedVideoIds] = useState(new Set())

  useEffect(() => {
    fetchCourseDetails()
    fetchCourseProgress()
  }, [courseId])

  const fetchCourseDetails = async () => {
    try {
      setLoading(true)
      const response = await coursesAPI.getCourseDetails(courseId)
      setCourse(response.data.course)
      setTopics(response.data.topics)
      setStatistics(response.data.statistics)
    } catch (error) {
      console.error('Error fetching course:', error)
      toast.error('Failed to load course details')
    } finally {
      setLoading(false)
    }
  }

  const fetchCourseProgress = async () => {
    try {
      const response = await progressAPI.getCourseProgress(courseId)
      setCourseProgress(response.data)
      if (response.data.completedVideoIds) {
        setCompletedVideoIds(new Set(response.data.completedVideoIds))
      }
    } catch (error) {
      console.error('Error fetching progress:', error)
    }
  }

  const handleStartLearning = () => {
    setViewMode('learning')
    // Select first video by default
    if (topics.length > 0 && topics[0].videos.length > 0) {
      setSelectedTopic(topics[0])
      setSelectedVideo(topics[0].videos[0])
    }
  }

  const handleVideoSelect = async (video, topic) => {
    setSelectedVideo(video)
    setSelectedTopic(topic)
    // Track video watch start
    try {
      await progressAPI.trackVideoWatch(courseId, topic._id, video.youtubeId)
      // Refresh progress after selecting video
      fetchCourseProgress()
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
      // Refresh progress
      fetchCourseProgress()
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

  const isVideoCompleted = (videoId) => {
    return completedVideoIds.has(videoId)
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

  // Overview Mode - Course Overview Page
  if (viewMode === 'overview') {
    return (
      <Layout>
        <div>
          <button 
            onClick={() => navigate('/courses')} 
            className="mb-4 text-purple-brand hover:underline flex items-center gap-2"
          >
            <span>←</span> Back to Courses
          </button>
          
          <h1 className="text-3xl font-bold mb-4">{course?.title}</h1>
          
          {course?.description && (
            <p className="text-gray-600 mb-6">{course.description}</p>
          )}

          {/* Progress Section */}
          {courseProgress && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Progress</h3>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">
                    {courseProgress.completedVideos} of {courseProgress.totalVideos} videos completed
                  </span>
                  <span className="font-semibold text-purple-brand">
                    {courseProgress.completionPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-purple-brand h-3 rounded-full transition-all duration-300"
                    style={{ width: `${courseProgress.completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Course Outline Toggle */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <button
              onClick={() => setShowOutline(!showOutline)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold">View Course outline</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${showOutline ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showOutline && (
              <div className="px-4 pb-4 border-t border-gray-200">
                <div className="space-y-2 mt-4">
                  {topics.map((topic, index) => (
                    <div key={topic._id} className="text-sm text-gray-600">
                      {index + 1}. {topic.title}
                      {topic.videos && topic.videos.length > 0 && (
                        <span className="text-gray-400 ml-2">
                          ({topic.videos.length} {topic.videos.length === 1 ? 'video' : 'videos'})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Course Content Statistics */}
          {statistics && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-brand mb-1">
                    {statistics.totalVideos}
                  </div>
                  <div className="text-sm text-gray-600">Videos</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-brand mb-1">
                    {statistics.totalMaterials}
                  </div>
                  <div className="text-sm text-gray-600">Materials</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-brand mb-1">
                    {statistics.totalPastQuestions}
                  </div>
                  <div className="text-sm text-gray-600">Past Questions</div>
                </div>
              </div>
            </div>
          )}

          {/* Start Learning Button */}
          <button
            onClick={handleStartLearning}
            className="w-full md:w-auto px-8 py-3 btn-purple text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            Start Learning
          </button>
        </div>
      </Layout>
    )
  }

  // Learning Mode - Course Learning Page
  return (
    <Layout>
      <div>
        <button 
          onClick={() => setViewMode('overview')} 
          className="mb-4 text-purple-brand hover:underline flex items-center gap-2"
        >
          <span>←</span> Back to Course
        </button>
        
        <h1 className="text-3xl font-bold mb-6">{course?.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lessons List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-xl font-bold mb-4">Lessons</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {topics.length > 0 ? (
                topics.map((topic) => (
                  <div key={topic._id} className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">{topic.title}</h3>
                    <div className="space-y-1">
                      {topic.videos && topic.videos.map((video, videoIndex) => {
                        const isSelected = selectedVideo?.youtubeId === video.youtubeId
                        const isCompleted = isVideoCompleted(video.youtubeId)
                        
                        return (
                          <button
                            key={video.youtubeId}
                            onClick={() => handleVideoSelect(video, topic)}
                            className={`
                              w-full text-left p-3 rounded-lg border transition-colors flex items-center gap-3
                              ${isSelected
                                ? 'border-purple-brand bg-purple-50'
                                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                              }
                            `}
                          >
                            <div className={`
                              w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                              ${isCompleted
                                ? 'bg-purple-brand border-purple-brand'
                                : isSelected
                                  ? 'border-purple-brand'
                                  : 'border-gray-300'
                              }
                            `}>
                              {isCompleted && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium line-clamp-2 text-gray-900">
                                {video.title}
                              </div>
                              {video.duration && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {formatDuration(video.duration)}
                                </div>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No content available yet</p>
              )}
            </div>
          </div>

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
                    ← Previous Lesson
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
                    Next Lesson →
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

                {/* Materials Section */}
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
                <p className="text-gray-500">Select a lesson to start learning</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CourseDetail
