import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { dashboardAPI } from '../services/api'
import MetricsCard from '../components/MetricsCard'
import CountdownTimer from '../components/CountdownTimer'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'

// Fixed exam dates
const FIRST_SEM_DATE = new Date('2026-03-02T00:00:00.000Z')
const SECOND_SEM_DATE = new Date('2026-08-17T00:00:00.000Z')

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth()
  const [academicSeason, setAcademicSeason] = useState('second-semester')
  const [dashboardData, setDashboardData] = useState({
    coursesEnrolled: 0,
    overallProgress: 0,
    studyHours: 0,
    upcomingExam: null,
    recentlyWatched: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let saved = localStorage.getItem('studyhub_academic_season')
    // Auto-transition to second semester since March 2, 2026 has passed
    if (saved === 'first-semester' && new Date() > FIRST_SEM_DATE) {
      saved = 'second-semester'
      localStorage.setItem('studyhub_academic_season', 'second-semester')
    }
    setAcademicSeason(saved || 'second-semester')
  }, [])

  const getExamDate = () => {
    return academicSeason === 'second-semester' ? SECOND_SEM_DATE : FIRST_SEM_DATE
  }

  const getDailySpark = () => {
    if (academicSeason === 'academic-break') {
      return {
        title: "Break Phase: Skill & Career Building",
        text: "Leverage this holiday to acquire practical software, engineering, or design skills. Build personal projects, participate in coding clubs, or study advanced math models. A few hours of consistent learning compounds over time!",
        quote: "Live as if you were to die tomorrow. Learn as if you were to live forever. — Mahatma Gandhi"
      }
    } else {
      return {
        title: "Semester Phase: Diligence & Focus",
        text: "With exams around the corner, practice active recall. Don't just re-read notes—test yourself. Review FUTA CBT simulators, outline essay answers, and maintain a spiritual balance to keep your mind centered.",
        quote: "Excellence is an art won by training and habituation. — Aristotle"
      }
    }
  }

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
        const target = getExamDate()
        const now = new Date()
        const daysRemaining = Math.ceil((target - now) / (1000 * 60 * 60 * 24))
        setDashboardData({
          coursesEnrolled: 0,
          overallProgress: 0,
          studyHours: 0,
          upcomingExam: {
            daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
            examName: academicSeason === 'second-semester' ? 'Second Semester Exams' : 'First Semester Exams',
            startDate: target.toISOString()
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
  }, [user, academicSeason])

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
      {academicSeason === 'academic-break' ? (
        <div className="bg-purple-brand rounded-lg p-6 mb-6 text-white shadow-sm">
          <h2 className="text-xl font-bold mb-1">Academic Recess & Skills Break</h2>
          <p className="text-purple-100 text-sm">
            Classes are currently on hold. Use this period to recharge, learn software tools, and read ahead. Academic excellence begins in the off-season!
          </p>
        </div>
      ) : (
        <div className="bg-purple-brand rounded-2xl p-6 md:p-8 mb-6 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              Upcoming Semester Exam
            </h2>
            <p className="text-purple-200 mt-1 font-semibold text-xs md:text-sm uppercase tracking-wider">
              {academicSeason === 'second-semester' ? 'Second Semester Exams' : 'First Semester Exams'} begins in...
            </p>
          </div>
          <div className="w-full md:w-auto">
            <CountdownTimer targetDate={getExamDate().toISOString()} />
          </div>
        </div>
      )}

      {/* Daily Academic Spark Widget */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <span className="text-[10px] font-extrabold px-2.5 py-1 bg-purple-100 text-purple-brand rounded-full uppercase tracking-wider">
            Daily Academic Spark
          </span>
          <h3 className="font-extrabold text-gray-900 mt-2 text-base">{getDailySpark().title}</h3>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">{getDailySpark().text}</p>
        </div>
        <div className="md:w-64 bg-gray-50 p-4 rounded-xl border border-gray-100 border-l-4 border-purple-brand text-xs italic text-gray-700">
          "{getDailySpark().quote}"
        </div>
      </div>

      {/* Recently Watched */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-xl font-extrabold text-gray-900 mb-4 tracking-tight">Recently Watched</h2>
        {dashboardData.recentlyWatched && dashboardData.recentlyWatched.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.recentlyWatched.map((item, index) => (
              <div key={index} className="border border-gray-150 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 bg-gray-50/30">
                <h3 className="font-extrabold text-sm text-gray-900">{item.title}</h3>
                <p className="text-xs font-semibold text-purple-brand mt-1 uppercase tracking-wider">{item.course}</p>
                {item.topic && (
                  <p className="text-xs text-gray-500 mt-1 leading-normal">Topic: {item.topic}</p>
                )}
                {item.watchedAt && (
                  <p className="text-[10px] text-gray-400 font-medium mt-2">
                    Watched: {new Date(item.watchedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p className="font-semibold text-sm">No recently watched content</p>
            <p className="text-xs mt-1">Start watching course videos to see your progress here</p>
          </div>
        )}
    </div>
    </Layout>
  )
}

export default Dashboard
