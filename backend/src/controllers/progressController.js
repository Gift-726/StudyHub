import VideoProgress from '../models/VideoProgress.js'
import Enrollment from '../models/Enrollment.js'
import Topic from '../models/Topic.js'

// Mark video as completed
export const markVideoComplete = async (req, res) => {
  try {
    const { courseId, topicId, videoId, watchTime } = req.body
    const userId = req.user._id

    const progress = await VideoProgress.findOneAndUpdate(
      { userId, courseId, videoId },
      {
        completed: true,
        watchTime: watchTime || 0,
        completedAt: new Date(),
        lastWatchedAt: new Date()
      },
      { upsert: true, new: true }
    )

    // Update course enrollment progress
    await updateCourseProgress(userId, courseId)

    res.json({ success: true, progress })
  } catch (error) {
    console.error('Mark video complete error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Update video watch time
export const updateWatchTime = async (req, res) => {
  try {
    const { courseId, topicId, videoId, watchTime } = req.body
    const userId = req.user._id

    await VideoProgress.findOneAndUpdate(
      { userId, courseId, videoId },
      {
        watchTime,
        lastWatchedAt: new Date()
      },
      { upsert: true, new: true }
    )

    res.json({ success: true })
  } catch (error) {
    console.error('Update watch time error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Track video watch start
export const trackVideoWatch = async (req, res) => {
  try {
    const { courseId, topicId, videoId } = req.body
    const userId = req.user._id

    await VideoProgress.findOneAndUpdate(
      { userId, courseId, videoId },
      {
        lastWatchedAt: new Date()
      },
      { upsert: true, new: true }
    )

    res.json({ success: true })
  } catch (error) {
    console.error('Track video watch error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get course progress
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params
    const userId = req.user._id

    const progress = await VideoProgress.find({ userId, courseId })
    const completedCount = progress.filter(p => p.completed).length
    const totalVideos = await getTotalVideosInCourse(courseId)
    const completionPercentage = totalVideos > 0 
      ? Math.round((completedCount / totalVideos) * 100) 
      : 0

    res.json({
      completedVideos: completedCount,
      totalVideos,
      completionPercentage,
      progress
    })
  } catch (error) {
    console.error('Get course progress error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Helper: Update course enrollment progress
const updateCourseProgress = async (userId, courseId) => {
  try {
    const progress = await VideoProgress.find({ userId, courseId })
    const completedCount = progress.filter(p => p.completed).length
    const totalVideos = await getTotalVideosInCourse(courseId)
    const progressPercentage = totalVideos > 0 
      ? Math.round((completedCount / totalVideos) * 100) 
      : 0

    await Enrollment.findOneAndUpdate(
      { userId, courseId },
      { progress: progressPercentage },
      { upsert: true }
    )
  } catch (error) {
    console.error('Update course progress error:', error)
  }
}

// Helper: Get total videos in course
const getTotalVideosInCourse = async (courseId) => {
  try {
    const topics = await Topic.find({ courseId })
    return topics.reduce((total, topic) => total + topic.videos.length, 0)
  } catch (error) {
    console.error('Get total videos error:', error)
    return 0
  }
}

