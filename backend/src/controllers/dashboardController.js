import User from '../models/User.js'
import Course from '../models/Course.js'
import Enrollment from '../models/Enrollment.js'
import StudySession from '../models/StudySession.js'

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

    // Get upcoming exam (example - you can customize this based on your exam schedule)
    const upcomingExam = {
      daysRemaining: 15, // Calculate based on your exam dates
      examName: 'First Semester Exams',
      startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    }

    // Get recently watched content (last 6 sessions)
    const recentSessions = await StudySession.find({ userId })
      .sort({ watchedAt: -1 })
      .limit(6)
      .populate('courseId', 'title')
      .lean()

    const recentlyWatched = recentSessions
      .filter(session => session.courseId)
      .map(session => ({
        title: session.courseId?.title || 'Unknown Course',
        course: session.courseId?.title || 'Unknown Course',
        watchedAt: session.watchedAt
      }))

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

