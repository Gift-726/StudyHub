import User from '../models/User.js'
import Course from '../models/Course.js'
import Enrollment from '../models/Enrollment.js'
import StudySession from '../models/StudySession.js'
import VideoProgress from '../models/VideoProgress.js'
import Topic from '../models/Topic.js'

// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id

    // Get courses enrolled count
    const coursesEnrolled = await Enrollment.countDocuments({ userId })

    // Get overall progress (average of all enrolled courses)
    const enrollments = await Enrollment.find({ userId }).populate('courseId')
    const overallProgress = enrollments.length > 0
      ? Math.round(
          enrollments.reduce((sum, enrollment) => sum + (enrollment.progress || 0), 0) /
          enrollments.length
        )
      : 0

    // Get total study hours (sum of all study sessions in minutes, convert to hours)
    const studySessions = await StudySession.find({ userId })
    const totalMinutes = studySessions.reduce((sum, session) => sum + (session.duration || 0), 0)
    const studyHours = Math.round(totalMinutes / 60)

    // Get upcoming exam (March 2, 2026)
    const examDate = new Date('2026-03-02T00:00:00.000Z')
    const now = new Date()
    const daysRemaining = Math.ceil((examDate - now) / (1000 * 60 * 60 * 24))
    const upcomingExam = {
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
      examName: 'First Semester Exams',
      startDate: examDate.toISOString()
    }

    // Get recently watched content from VideoProgress (last 6 videos watched)
    const recentProgress = await VideoProgress.find({ userId })
      .sort({ lastWatchedAt: -1 })
      .limit(6)
      .populate('courseId', 'title')
      .populate('topicId', 'title videos')
      .lean()

    // Get video titles from topics (already populated)
    const recentlyWatched = recentProgress
      .filter(progress => progress.courseId && progress.topicId)
      .map(progress => {
        const video = progress.topicId?.videos?.find(v => v.youtubeId === progress.videoId)
        return {
          title: video?.title || 'Video',
          course: progress.courseId?.title || 'Unknown Course',
          topic: progress.topicId?.title || '',
          watchedAt: progress.lastWatchedAt
        }
      })

    res.json({
      coursesEnrolled,
      overallProgress,
      studyHours,
      upcomingExam,
      recentlyWatched
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    res.status(500).json({ message: 'Server error occurred' })
  }
}

