import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import CourseCard from '../components/CourseCard'
import BrowseCourseCard from '../components/BrowseCourseCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { coursesAPI } from '../services/api'
import toast from 'react-hot-toast'

const Courses = () => {
  const [activeTab, setActiveTab] = useState('my-courses')
  const [courses, setCourses] = useState([])
  const [allAvailableCourses, setAllAvailableCourses] = useState([])
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set())
  const [filteredCourses, setFilteredCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [sortBy, setSortBy] = useState('alphabetical')

  useEffect(() => {
    fetchMyCourses()
    fetchAllCourses()
  }, [])

  useEffect(() => {
    if (activeTab === 'browse') {
      if (allAvailableCourses.length === 0) fetchAllCourses()
      else setFilteredCourses(allAvailableCourses)
    } else {
      setFilteredCourses(courses)
    }
  }, [activeTab, allAvailableCourses, courses])

  const fetchMyCourses = async () => {
    try {
      setLoading(true)
      const response = await coursesAPI.getMyCourses()
      setCourses(response.data)
      setFilteredCourses(response.data)
      setEnrolledCourseIds(new Set(response.data.map(c => c._id)))
    } catch (error) {
      console.error('Error fetching courses:', error)
      setCourses([])
      setFilteredCourses([])
    } finally {
      setLoading(false)
    }
  }

  const fetchAllCourses = async () => {
    try {
      const response = await coursesAPI.getAllCourses()
      setAllAvailableCourses(response.data)
    } catch (error) {
      console.error('Error fetching all courses:', error)
      setAllAvailableCourses([])
    }
  }

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling({ ...enrolling, [courseId]: true })
      await coursesAPI.enrollCourse(courseId)
      toast.success('Successfully enrolled in course!')
      setEnrolledCourseIds(new Set([...enrolledCourseIds, courseId]))
      if (activeTab === 'my-courses') fetchMyCourses()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll in course')
    } finally {
      setEnrolling({ ...enrolling, [courseId]: false })
    }
  }

  useEffect(() => {
    const sourceCourses = activeTab === 'my-courses' ? courses : allAvailableCourses
    let filtered = [...sourceCourses]

    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (activeTab === 'my-courses') {
      if (activeFilter === 'in-progress') {
        filtered = filtered.filter(c => c.progress > 0 && c.progress < 100)
      } else if (activeFilter === 'completed') {
        filtered = filtered.filter(c => c.progress === 100)
      }
    }

    if (activeTab === 'browse' && levelFilter !== 'all') {
      filtered = filtered.filter(c => String(c.level) === String(levelFilter))
    }

    if (sortBy === 'alphabetical') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'progress' && activeTab === 'my-courses') {
      filtered.sort((a, b) => (b.progress || 0) - (a.progress || 0))
    } else if (sortBy === 'recent' && activeTab === 'my-courses') {
      filtered.sort((a, b) => {
        const dA = a.lastActivity ? new Date(a.lastActivity) : new Date(0)
        const dB = b.lastActivity ? new Date(b.lastActivity) : new Date(0)
        return dB - dA
      })
    } else if (sortBy === 'level') {
      filtered.sort((a, b) => (a.level || '').localeCompare(b.level || ''))
    }

    setFilteredCourses(filtered)
  }, [courses, allAvailableCourses, activeTab, searchQuery, activeFilter, levelFilter, sortBy])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    )
  }

  const inProgressCount = courses.filter(c => c.progress > 0 && c.progress < 100).length
  const completedCount = courses.filter(c => c.progress === 100).length

  const switchTab = (tab) => {
    setActiveTab(tab)
    setActiveFilter('all')
    setLevelFilter('all')
    setSearchQuery('')
  }

  return (
    <Layout>
      <div className="space-y-6">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black font-heading text-gray-900">Courses</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your learning journey</p>
          </div>

          {/* Stats pills – only My Courses */}
          {activeTab === 'my-courses' && (
            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-[#4B2E83]" />
                <span className="text-xs font-semibold text-gray-700">{courses.length} Enrolled</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs font-semibold text-gray-700">{inProgressCount} In Progress</span>
              </div>
              {completedCount > 0 && (
                <div className="flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-gray-700">{completedCount} Completed</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Tabs ── */}
        <div className="flex bg-gray-100/80 p-1 rounded-xl w-fit gap-1">
          <button
            onClick={() => switchTab('my-courses')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'my-courses'
                ? 'bg-white text-[#4B2E83] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            My Courses
            <span className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded-md ${
              activeTab === 'my-courses' ? 'bg-[#4B2E83]/10 text-[#4B2E83]' : 'bg-gray-200 text-gray-500'
            }`}>
              {courses.length}
            </span>
          </button>
          <button
            onClick={() => switchTab('browse')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'browse'
                ? 'bg-white text-[#4B2E83] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Browse All
            <span className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded-md ${
              activeTab === 'browse' ? 'bg-[#4B2E83]/10 text-[#4B2E83]' : 'bg-gray-200 text-gray-500'
            }`}>
              {allAvailableCourses.length}
            </span>
          </button>
        </div>

        {/* ── Toolbar ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
          {/* Search + Sort row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#4B2E83] focus:ring-4 focus:ring-[#4B2E83]/10 transition-all"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="pl-4 pr-8 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 text-sm text-gray-700 focus:outline-none focus:border-[#4B2E83] focus:ring-4 focus:ring-[#4B2E83]/10 transition-all appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="alphabetical">A → Z</option>
              {activeTab === 'my-courses' && (
                <>
                  <option value="progress">By Progress</option>
                  <option value="recent">Recent Activity</option>
                </>
              )}
              {activeTab === 'browse' && (
                <option value="level">By Level</option>
              )}
            </select>
          </div>

          {/* Status filter pills – My Courses */}
          {activeTab === 'my-courses' && (
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'in-progress', label: 'In Progress' },
                { key: 'completed', label: 'Completed' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    activeFilter === key
                      ? 'bg-[#4B2E83] text-white shadow-sm shadow-[#4B2E83]/30'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Level filter pills – Browse tab */}
          {activeTab === 'browse' && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">Level:</span>
              {['all', '100', '200', '300', '400', '500'].map(lvl => {
                const count = lvl === 'all'
                  ? allAvailableCourses.length
                  : allAvailableCourses.filter(c => String(c.level) === lvl).length
                return (
                  <button
                    key={lvl}
                    onClick={() => setLevelFilter(lvl)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                      levelFilter === lvl
                        ? 'bg-[#4B2E83] text-white shadow-sm shadow-[#4B2E83]/30'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {lvl === 'all' ? `All (${count})` : `${lvl}L (${count})`}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Course Grid / List ── */}
        {filteredCourses.length > 0 ? (
          activeTab === 'browse' ? (
            /* Grid for Browse */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredCourses.map(course => (
                <BrowseCourseCard
                  key={course._id || course.id}
                  course={course}
                  isEnrolled={enrolledCourseIds.has(course._id || course.id)}
                  onEnroll={handleEnroll}
                  enrolling={enrolling[course._id || course.id] || false}
                />
              ))}
            </div>
          ) : (
            /* List for My Courses */
            <div className="space-y-4">
              {filteredCourses.map(course => (
                <CourseCard key={course._id || course.id} course={course} />
              ))}
            </div>
          )
        ) : (
          /* ── Empty State ── */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#4B2E83]/8 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#4B2E83]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-1">
              {searchQuery ? 'No courses found' : activeTab === 'my-courses' ? 'No courses yet' : 'No courses available'}
            </h3>
            <p className="text-sm text-gray-400 max-w-xs">
              {searchQuery
                ? 'Try adjusting your search or filters.'
                : activeTab === 'my-courses'
                ? 'Browse the course catalogue to get started on your learning journey.'
                : 'Check back later — new courses are added regularly.'}
            </p>
            {!searchQuery && activeTab === 'my-courses' && (
              <button
                onClick={() => switchTab('browse')}
                className="mt-5 px-5 py-2.5 bg-gradient-to-r from-[#4B2E83] to-[#5e3da1] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#4B2E83]/25 hover:-translate-y-0.5 transition-all duration-200"
              >
                Browse Courses →
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Courses
