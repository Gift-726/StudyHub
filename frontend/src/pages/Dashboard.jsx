import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { dashboardAPI } from '../services/api'
import MetricsCard from '../components/MetricsCard'
import CountdownTimer from '../components/CountdownTimer'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'

// Fixed exam date: March 2, 2026 - works independently of server
const EXAM_DATE = new Date('2026-03-02T00:00:00.000Z')

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth()
  const [dashboardData, setDashboardData] = useState({
    coursesEnrolled: 0,
    overallProgress: 0,
    studyHours: 0,
    upcomingExam: null,
    recentlyWatched: []
  })
  const [loading, setLoading] = useState(true)

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await dashboardAPI.getDashboard()
        setDashboardData(response.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Set default values if API fails
        // Use fixed exam date: March 2, 2026
        const now = new Date()
        const daysRemaining = Math.ceil((EXAM_DATE - now) / (1000 * 60 * 60 * 24))
        setDashboardData({
          coursesEnrolled: 0,
          overallProgress: 0,
          studyHours: 0,
          upcomingExam: {
            daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
            examName: 'First Semester Exams',
            startDate: EXAM_DATE.toISOString()
          },
          recentlyWatched: []
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#faf9f6]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Layout>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <MetricsCard
          title="Courses Enrolled"
          value={dashboardData.coursesEnrolled}
        />
        <MetricsCard
          title="Overall Progress"
          value={`${dashboardData.overallProgress}%`}
        />
        <MetricsCard
          title="Study Hours"
          value={dashboardData.studyHours}
        />
      </div>

      {/* Upcoming Exam Alert with Countdown */}
      {/* Always use fixed exam date: March 2, 2026 - works independently of server */}
      <div className="bg-purple-brand rounded-lg p-6 mb-6 text-white">
        <h2 className="text-xl font-bold mb-2">Upcoming Semester Exam</h2>
        <p className="text-purple-100 mb-4">
          {dashboardData.upcomingExam?.examName || 'First Semester Exams'} starts on March 2, 2026
        </p>
        <CountdownTimer targetDate={EXAM_DATE.toISOString()} />
      </div>

      {/* Recently Watched */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recently Watched</h2>
        {dashboardData.recentlyWatched && dashboardData.recentlyWatched.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.recentlyWatched.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.course}</p>
                {item.topic && (
                  <p className="text-xs text-gray-500 mt-1">Topic: {item.topic}</p>
                )}
                {item.watchedAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(item.watchedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No recently watched content</p>
            <p className="text-sm text-gray-400 mt-2">Start watching videos to see them here</p>
          </div>
        )}
    </div>
    </Layout>
  )
}

export default Dashboard
