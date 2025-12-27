import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { dashboardAPI } from '../services/api'
import MetricsCard from '../components/MetricsCard'
import Layout from '../components/Layout'

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
        setDashboardData({
          coursesEnrolled: 0,
          overallProgress: 0,
          studyHours: 0,
          upcomingExam: {
            daysRemaining: 15,
            examName: 'First Semester Exams'
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
        <div className="text-lg text-gray-600">Loading...</div>
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

      {/* Upcoming Exam Alert */}
      {dashboardData.upcomingExam && (
        <div className="bg-purple-brand rounded-lg p-6 mb-6 text-white">
          <h2 className="text-xl font-bold mb-2">Upcoming Semester Exam</h2>
          <p className="text-purple-100">
            First semester exams begins in {dashboardData.upcomingExam.daysRemaining} days
          </p>
        </div>
      )}

      {/* Recently Watched */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recently Watched</h2>
        {dashboardData.recentlyWatched && dashboardData.recentlyWatched.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.recentlyWatched.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.course}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No recently watched content</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Dashboard
