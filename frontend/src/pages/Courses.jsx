import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import CourseCard from '../components/CourseCard'
import BrowseCourseCard from '../components/BrowseCourseCard'
import { coursesAPI } from '../services/api'
import toast from 'react-hot-toast'

const Courses = () => {
  const [activeTab, setActiveTab] = useState('my-courses') // 'my-courses' or 'browse'
  const [courses, setCourses] = useState([])
  const [allAvailableCourses, setAllAvailableCourses] = useState([])
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set())
  const [filteredCourses, setFilteredCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState('alphabetical')

  // Fetch enrolled courses
  useEffect(() => {
    fetchMyCourses()
  }, [])

  // Fetch all available courses when browsing
  useEffect(() => {
    if (activeTab === 'browse') {
      fetchAllCourses()
    }
  }, [activeTab])

  const fetchMyCourses = async () => {
    try {
      setLoading(true)
      const response = await coursesAPI.getMyCourses()
      setCourses(response.data)
      setFilteredCourses(response.data)
      // Track enrolled course IDs
      const enrolledIds = new Set(response.data.map(c => c._id))
      setEnrolledCourseIds(enrolledIds)
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
      setLoading(true)
      const response = await coursesAPI.getAllCourses()
      setAllAvailableCourses(response.data)
      setFilteredCourses(response.data)
    } catch (error) {
      console.error('Error fetching all courses:', error)
      setAllAvailableCourses([])
      setFilteredCourses([])
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling({ ...enrolling, [courseId]: true })
      await coursesAPI.enrollCourse(courseId)
      toast.success('Successfully enrolled in course!')
      // Add to enrolled set
      setEnrolledCourseIds(new Set([...enrolledCourseIds, courseId]))
      // Refresh my courses if on that tab
      if (activeTab === 'my-courses') {
        fetchMyCourses()
      }
    } catch (error) {
      console.error('Error enrolling:', error)
      toast.error(error.response?.data?.message || 'Failed to enroll in course')
    } finally {
      setEnrolling({ ...enrolling, [courseId]: false })
    }
  }

  // Filter and search courses
  useEffect(() => {
    const sourceCourses = activeTab === 'my-courses' ? courses : allAvailableCourses
    let filtered = [...sourceCourses]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter (only for my courses)
    if (activeTab === 'my-courses') {
      if (activeFilter === 'in-progress') {
        filtered = filtered.filter(course => course.progress > 0 && course.progress < 100)
      } else if (activeFilter === 'completed') {
        filtered = filtered.filter(course => course.progress === 100)
      }
    }

    // Apply sorting
    if (sortBy === 'alphabetical') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'progress' && activeTab === 'my-courses') {
      filtered.sort((a, b) => (b.progress || 0) - (a.progress || 0))
    } else if (sortBy === 'recent' && activeTab === 'my-courses') {
      filtered.sort((a, b) => {
        const dateA = a.lastActivity ? new Date(a.lastActivity) : new Date(0)
        const dateB = b.lastActivity ? new Date(b.lastActivity) : new Date(0)
        return dateB - dateA
      })
    } else if (sortBy === 'level') {
      filtered.sort((a, b) => (a.level || '').localeCompare(b.level || ''))
    }

    setFilteredCourses(filtered)
  }, [courses, allAvailableCourses, activeTab, searchQuery, activeFilter, sortBy])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-gray-600">Loading courses...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div>
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Courses</h1>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setActiveTab('my-courses')
                setActiveFilter('all')
                setSearchQuery('')
              }}
              className={`
                px-4 py-2 font-medium border-b-2 transition-colors
                ${activeTab === 'my-courses'
                  ? 'border-purple-brand text-purple-brand'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                }
              `}
            >
              My Courses ({courses.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('browse')
                setActiveFilter('all')
                setSearchQuery('')
              }}
              className={`
                px-4 py-2 font-medium border-b-2 transition-colors
                ${activeTab === 'browse'
                  ? 'border-purple-brand text-purple-brand'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                }
              `}
            >
              Browse All Courses ({allAvailableCourses.length})
            </button>
          </div>
        </div>

        {/* Search, Filters, and Sort */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Filters - Only show for My Courses */}
            {activeTab === 'my-courses' && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${activeFilter === 'all'
                      ? 'bg-purple-brand text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  All Courses
                  <span className={`
                    ml-2 px-2 py-0.5 rounded-full text-xs
                    ${activeFilter === 'all' ? 'bg-white text-purple-brand' : 'bg-purple-brand text-white'}
                  `}>
                    {courses.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveFilter('in-progress')}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${activeFilter === 'in-progress'
                      ? 'bg-purple-brand text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  In Progress
                  <span className={`
                    ml-2 px-2 py-0.5 rounded-full text-xs
                    ${activeFilter === 'in-progress' ? 'bg-white text-purple-brand' : 'bg-purple-brand text-white'}
                  `}>
                    {courses.filter(c => c.progress > 0 && c.progress < 100).length}
                  </span>
                </button>
              </div>
            )}

            {/* Search Bar */}
            <div className="flex-1 md:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="w-full md:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="alphabetical">Alphabetical</option>
                {activeTab === 'my-courses' && (
                  <>
                    <option value="progress">Progress</option>
                    <option value="recent">Recent Activity</option>
                  </>
                )}
                {activeTab === 'browse' && (
                  <option value="level">Level</option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Course List */}
        {filteredCourses.length > 0 ? (
          <div className="space-y-4">
            {filteredCourses.map((course) => {
              if (activeTab === 'my-courses') {
                return <CourseCard key={course._id || course.id} course={course} />
              } else {
                return (
                  <BrowseCourseCard
                    key={course._id || course.id}
                    course={course}
                    isEnrolled={enrolledCourseIds.has(course._id || course.id)}
                    onEnroll={handleEnroll}
                    enrolling={enrolling[course._id || course.id] || false}
                  />
                )
              }
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-lg text-gray-500">
              {searchQuery 
                ? 'No courses found matching your search.' 
                : activeTab === 'my-courses'
                  ? 'No courses enrolled yet.'
                  : 'No courses available yet.'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {searchQuery 
                ? 'Try adjusting your search or filters.' 
                : activeTab === 'my-courses'
                  ? 'Browse available courses to get started!'
                  : 'Check back later for new courses.'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Courses

