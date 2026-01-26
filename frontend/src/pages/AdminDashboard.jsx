import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { adminAPI } from '../services/api'
import toast from 'react-hot-toast'
import AdminLayout from '../components/AdminLayout'
import LoadingSpinner from '../components/LoadingSpinner'
import { faculties } from '../utils/faculties'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [courseDetails, setCourseDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form states
  const [importType, setImportType] = useState('playlist') // 'playlist' or 'video'
  const [playlistForm, setPlaylistForm] = useState({
    courseId: '',
    playlistUrl: '',
    topicTitle: '',
    topicDescription: ''
  })
  const [videoForm, setVideoForm] = useState({
    courseId: '',
    videoUrl: '',
    topicTitle: '',
    topicDescription: ''
  })

  const [materialForm, setMaterialForm] = useState({
    topicId: '',
    materialType: 'pdf',
    title: '',
    file: null
  })

  const [newCourseForm, setNewCourseForm] = useState({
    title: '',
    description: '',
    faculty: '',
    department: '',
    level: '100',
    units: 3
  })
  const [creatingCourse, setCreatingCourse] = useState(false)
  const [showCreateCourse, setShowCreateCourse] = useState(false)

  useEffect(() => {
    // Check if user is admin
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || ''
    if (!user || user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
      toast.error('Admin access required')
      navigate('/admin/login')
      return
    }

    fetchCourses()
  }, [user, navigate])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllCourses()
      if (response.data && Array.isArray(response.data)) {
        setCourses(response.data)
        if (response.data.length === 0) {
          toast.error('No courses found. Please create courses first.')
        }
      } else {
        setCourses([])
        toast.error('Invalid response from server')
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error(error.response?.data?.message || 'Failed to load courses')
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCourseDetails = async (courseId) => {
    try {
      const response = await adminAPI.getCourseDetails(courseId)
      setCourseDetails(response.data)
      setSelectedCourse(courseId)
    } catch (error) {
      console.error('Error fetching course details:', error)
      toast.error('Failed to load course details')
    }
  }

  const handleImportPlaylist = async (e) => {
    e.preventDefault()
    if (!playlistForm.courseId || !playlistForm.playlistUrl || !playlistForm.topicTitle) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setImporting(true)
      const response = await adminAPI.importPlaylist(playlistForm)
      toast.success(`Successfully imported ${response.data.videosCount} videos!`)
      setPlaylistForm({
        courseId: '',
        playlistUrl: '',
        topicTitle: '',
        topicDescription: ''
      })
      // Refresh course details if viewing that course
      if (selectedCourse === playlistForm.courseId) {
        fetchCourseDetails(playlistForm.courseId)
      }
    } catch (error) {
      console.error('Error importing playlist:', error)
      toast.error(error.response?.data?.message || 'Failed to import playlist')
    } finally {
      setImporting(false)
    }
  }

  const handleImportVideo = async (e) => {
    e.preventDefault()
    if (!videoForm.courseId || !videoForm.videoUrl || !videoForm.topicTitle) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setImporting(true)
      const response = await adminAPI.importSingleVideo(videoForm)
      toast.success('Successfully imported video!')
      setVideoForm({
        courseId: '',
        videoUrl: '',
        topicTitle: '',
        topicDescription: ''
      })
      // Refresh course details if viewing that course
      if (selectedCourse === videoForm.courseId) {
        fetchCourseDetails(videoForm.courseId)
      }
    } catch (error) {
      console.error('Error importing video:', error)
      toast.error(error.response?.data?.message || 'Failed to import video')
    } finally {
      setImporting(false)
    }
  }

  const handleUploadMaterial = async (e) => {
    e.preventDefault()
    if (!materialForm.topicId || !materialForm.title || !materialForm.file) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('topicId', materialForm.topicId)
      formData.append('materialType', materialForm.materialType)
      formData.append('title', materialForm.title)
      formData.append('file', materialForm.file)

      await adminAPI.uploadMaterial(formData)
      toast.success('Material uploaded successfully!')
      setMaterialForm({
        topicId: '',
        materialType: 'pdf',
        title: '',
        file: null
      })
      // Refresh course details
      if (selectedCourse) {
        fetchCourseDetails(selectedCourse)
      }
    } catch (error) {
      console.error('Error uploading material:', error)
      toast.error(error.response?.data?.message || 'Failed to upload material')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm('Are you sure you want to delete this topic? All videos and materials will be removed.')) {
      return
    }

    try {
      await adminAPI.deleteTopic(topicId)
      toast.success('Topic deleted successfully!')
      if (selectedCourse) {
        fetchCourseDetails(selectedCourse)
      }
    } catch (error) {
      console.error('Error deleting topic:', error)
      toast.error('Failed to delete topic')
    }
  }

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    try {
      setCreatingCourse(true)
      // Use the regular courses API to create a course
      const response = await adminAPI.createCourse(newCourseForm)
      toast.success('Course created successfully!')
      setNewCourseForm({
        title: '',
        description: '',
        faculty: '',
        department: '',
        level: '100',
        units: 3
      })
      // Refresh courses list
      fetchCourses()
    } catch (error) {
      console.error('Error creating course:', error)
      toast.error(error.response?.data?.message || 'Failed to create course')
    } finally {
      setCreatingCourse(false)
    }
  }


  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div>
        {/* Manage Courses Section - Moved to Top */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Manage Courses</h2>
          
          {courses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No courses available. Create a course below.</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Course to View/Manage
                </label>
                <select
                  value={selectedCourse || ''}
                  onChange={(e) => {
                    const courseId = e.target.value
                    if (courseId) {
                      fetchCourseDetails(courseId)
                    } else {
                      setSelectedCourse(null)
                      setCourseDetails(null)
                    }
                  }}
                  className="w-full md:w-auto min-w-[300px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title} ({course.level} Level)
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {courseDetails && (
            <div className="mt-6">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Course Admin Access</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Course:</strong> {courseDetails.course.title}
                </p>
                <div className="mb-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Course ID (for course admin login):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={selectedCourse}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm font-mono"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedCourse)
                        toast.success('Course ID copied to clipboard!')
                      }}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  Share this Course ID with the course administrator. They can use it to login at{' '}
                  <span className="font-mono">/course-admin/login</span> (no token needed!)
                </p>
              </div>
              
              <h3 className="text-lg font-bold mb-4">Topics in {courseDetails.course.title}</h3>
              
              <div className="space-y-4">
                {courseDetails.topics.length > 0 ? (
                  courseDetails.topics.map((topic) => (
                    <div key={topic._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{topic.title}</h4>
                          {topic.description && (
                            <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteTopic(topic._id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Videos: {topic.videos.length}</p>
                        <p>Materials: {topic.materials?.length || 0}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No topics added yet</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Create Course Section - Collapsible */}
        <div className="mb-6 bg-white rounded-lg shadow-sm">
          <button
            type="button"
            onClick={() => setShowCreateCourse(!showCreateCourse)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-xl font-bold">Create New Course</h2>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${showCreateCourse ? 'transform rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showCreateCourse && (
            <div className="px-6 pb-6">
              <form onSubmit={handleCreateCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Title *
              </label>
              <input
                type="text"
                value={newCourseForm.title}
                onChange={(e) => setNewCourseForm({ ...newCourseForm, title: e.target.value })}
                required
                placeholder="e.g., Introduction to Mathematics (MTH 101)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level *
              </label>
              <select
                value={newCourseForm.level}
                onChange={(e) => setNewCourseForm({ ...newCourseForm, level: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
                <option value="500">500 Level</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Faculty *
              </label>
              <select
                value={newCourseForm.faculty}
                onChange={(e) => setNewCourseForm({ ...newCourseForm, faculty: e.target.value, department: '' })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="">Select Faculty</option>
                {Object.keys(faculties).map((faculty) => (
                  <option key={faculty} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                value={newCourseForm.department}
                onChange={(e) => setNewCourseForm({ ...newCourseForm, department: e.target.value })}
                required
                disabled={!newCourseForm.faculty}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white disabled:bg-gray-100"
              >
                <option value="">Select Department</option>
                {newCourseForm.faculty && faculties[newCourseForm.faculty]?.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credit Units
              </label>
              <input
                type="number"
                value={newCourseForm.units}
                onChange={(e) => setNewCourseForm({ ...newCourseForm, units: parseInt(e.target.value) || 3 })}
                min="1"
                max="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newCourseForm.description}
                onChange={(e) => setNewCourseForm({ ...newCourseForm, description: e.target.value })}
                placeholder="Optional course description..."
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={creatingCourse}
                className="px-6 py-2 btn-purple text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingCourse ? 'Creating...' : 'Create Course'}
              </button>
            </div>
              </form>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Import YouTube Content Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Import YouTube Content</h2>
              <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setImportType('playlist')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    importType === 'playlist'
                      ? 'bg-purple-brand text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Playlist
                </button>
                <button
                  type="button"
                  onClick={() => setImportType('video')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    importType === 'video'
                      ? 'bg-purple-brand text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Single Video
                </button>
              </div>
            </div>

            {importType === 'playlist' ? (
              <form onSubmit={handleImportPlaylist} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Course *
                </label>
                <select
                  value={playlistForm.courseId}
                  onChange={(e) => setPlaylistForm({ ...playlistForm, courseId: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  disabled={courses.length === 0}
                >
                  <option value="">{courses.length === 0 ? 'No courses available' : 'Select a course'}</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title} ({course.level} Level)
                    </option>
                  ))}
                </select>
                {courses.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">Please create courses first before importing playlists</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube Playlist URL *
                </label>
                <input
                  type="url"
                  value={playlistForm.playlistUrl}
                  onChange={(e) => setPlaylistForm({ ...playlistForm, playlistUrl: e.target.value })}
                  required
                  placeholder="https://www.youtube.com/playlist?list=..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">Paste a YouTube playlist URL</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic Title *
                </label>
                <input
                  type="text"
                  value={playlistForm.topicTitle}
                  onChange={(e) => setPlaylistForm({ ...playlistForm, topicTitle: e.target.value })}
                  required
                  placeholder="e.g., Introduction to Algebra"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic Description
                </label>
                <textarea
                  value={playlistForm.topicDescription}
                  onChange={(e) => setPlaylistForm({ ...playlistForm, topicDescription: e.target.value })}
                  placeholder="Optional description..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={importing}
                className="w-full py-2 btn-purple text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importing ? 'Importing...' : 'Import Playlist'}
              </button>
            </form>
            ) : (
              <form onSubmit={handleImportVideo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Course *
                </label>
                <select
                  value={videoForm.courseId}
                  onChange={(e) => setVideoForm({ ...videoForm, courseId: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  disabled={courses.length === 0}
                >
                  <option value="">{courses.length === 0 ? 'No courses available' : 'Select a course'}</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title} ({course.level} Level)
                    </option>
                  ))}
                </select>
                {courses.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">Please create courses first before importing videos</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube Video URL *
                </label>
                <input
                  type="url"
                  value={videoForm.videoUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                  required
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">Paste a YouTube video URL</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic Title *
                </label>
                <input
                  type="text"
                  value={videoForm.topicTitle}
                  onChange={(e) => setVideoForm({ ...videoForm, topicTitle: e.target.value })}
                  required
                  placeholder="e.g., Introduction to Algebra"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic Description
                </label>
                <textarea
                  value={videoForm.topicDescription}
                  onChange={(e) => setVideoForm({ ...videoForm, topicDescription: e.target.value })}
                  placeholder="Optional description..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={importing}
                className="w-full py-2 btn-purple text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importing ? 'Importing...' : 'Import Video'}
              </button>
            </form>
            )}
          </div>

          {/* Upload Material Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Upload Study Material</h2>
            <form onSubmit={handleUploadMaterial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Topic *
                </label>
                <select
                  value={materialForm.topicId}
                  onChange={(e) => setMaterialForm({ ...materialForm, topicId: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a topic</option>
                  {courseDetails?.topics?.map((topic) => (
                    <option key={topic._id} value={topic._id}>
                      {topic.title}
                    </option>
                  ))}
                </select>
                {!selectedCourse && (
                  <p className="text-xs text-gray-500 mt-1">Select a course first to see topics</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material Type *
                </label>
                <select
                  value={materialForm.materialType}
                  onChange={(e) => setMaterialForm({ ...materialForm, materialType: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="pdf">PDF</option>
                  <option value="past-question">Past Question</option>
                  <option value="note">Note</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                  required
                  placeholder="e.g., MTH 101 Past Questions 2020"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PDF File * (Max 10MB)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setMaterialForm({ ...materialForm, file: e.target.files[0] })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={uploading || !selectedCourse}
                className="w-full py-2 btn-purple text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload Material'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard

