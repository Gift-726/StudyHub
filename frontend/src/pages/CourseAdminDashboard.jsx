import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { courseAdminAPI } from '../services/api'
import toast from 'react-hot-toast'
import AdminLayout from '../components/AdminLayout'
import LoadingSpinner from '../components/LoadingSpinner'

const CourseAdminDashboard = () => {
  const { user } = useAuth()
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
    playlistUrl: '',
    topicTitle: '',
    topicDescription: ''
  })
  const [videoForm, setVideoForm] = useState({
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

  const [forumLinkForm, setForumLinkForm] = useState({
    title: '',
    url: '',
    platform: 'WhatsApp',
    description: ''
  })
  const [editingLinkId, setEditingLinkId] = useState(null)
  const [showForumLinkForm, setShowForumLinkForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState(false)
  const [courseEditForm, setCourseEditForm] = useState({
    title: '',
    description: '',
    instructor: '',
    units: 3,
    image: ''
  })
  const [showCourseEditForm, setShowCourseEditForm] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/course-admin/login')
      return
    }

    // Get course ID from localStorage (set during login)
    const courseIdFromStorage = localStorage.getItem('courseAdminCourseId')
    
    if (courseIdFromStorage) {
      // Auto-load the course they logged in with
      setSelectedCourse(courseIdFromStorage)
      fetchCourseDetails(courseIdFromStorage)
    } else {
      // Fallback: fetch all courses (shouldn't happen normally)
      fetchCourses()
    }
  }, [user, navigate])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await courseAdminAPI.getMyCourses()
      if (response.data && Array.isArray(response.data)) {
        setCourses(response.data)
        if (response.data.length === 0) {
          toast.error('No courses assigned to you. Contact the administrator.')
        }
      } else {
        setCourses([])
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      if (error.response?.status === 401) {
        navigate('/course-admin/login')
      } else {
        toast.error(error.response?.data?.message || 'Failed to load courses')
      }
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCourseDetails = async (courseId) => {
    try {
      setLoading(true)
      const response = await courseAdminAPI.getCourseDetails(courseId)
      setCourseDetails(response.data)
      setSelectedCourse(courseId)
      // Populate edit form with current course data
      setCourseEditForm({
        title: response.data.course.title || '',
        description: response.data.course.description || '',
        instructor: response.data.course.instructor || '',
        units: response.data.course.units || 3,
        image: response.data.course.image || ''
      })
    } catch (error) {
      console.error('Error fetching course details:', error)
      toast.error('Failed to load course details')
      if (error.response?.status === 401) {
        navigate('/course-admin/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCourse = async (e) => {
    e.preventDefault()
    if (!selectedCourse) {
      toast.error('Please select a course first')
      return
    }

    try {
      setEditingCourse(true)
      await courseAdminAPI.updateCourse(selectedCourse, courseEditForm)
      toast.success('Course updated successfully!')
      setShowCourseEditForm(false)
      // Refresh course details
      fetchCourseDetails(selectedCourse)
    } catch (error) {
      console.error('Error updating course:', error)
      toast.error(error.response?.data?.message || 'Failed to update course')
    } finally {
      setEditingCourse(false)
    }
  }

  const handleImportPlaylist = async (e) => {
    e.preventDefault()
    if (!selectedCourse || !playlistForm.playlistUrl || !playlistForm.topicTitle) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setImporting(true)
      const response = await courseAdminAPI.importPlaylist({
        ...playlistForm,
        courseId: selectedCourse
      })
      toast.success(`Successfully imported ${response.data.videosCount} videos!`)
      setPlaylistForm({
        playlistUrl: '',
        topicTitle: '',
        topicDescription: ''
      })
      // Refresh course details
      fetchCourseDetails(selectedCourse)
    } catch (error) {
      console.error('Error importing playlist:', error)
      toast.error(error.response?.data?.message || 'Failed to import playlist')
    } finally {
      setImporting(false)
    }
  }

  const handleImportVideo = async (e) => {
    e.preventDefault()
    if (!selectedCourse || !videoForm.videoUrl || !videoForm.topicTitle) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setImporting(true)
      const response = await courseAdminAPI.importSingleVideo({
        ...videoForm,
        courseId: selectedCourse
      })
      toast.success('Successfully imported video!')
      setVideoForm({
        videoUrl: '',
        topicTitle: '',
        topicDescription: ''
      })
      // Refresh course details
      fetchCourseDetails(selectedCourse)
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

      await courseAdminAPI.uploadMaterial(formData)
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

  const handleAddForumLink = async (e) => {
    e.preventDefault()
    if (!selectedCourse || !forumLinkForm.title || !forumLinkForm.url) {
      toast.error('Please select a course and fill all required fields')
      return
    }

    try {
      if (editingLinkId) {
        await courseAdminAPI.updateForumLink(selectedCourse, editingLinkId, forumLinkForm)
        toast.success('Forum link updated successfully!')
      } else {
        await courseAdminAPI.addForumLink(selectedCourse, forumLinkForm)
        toast.success('Forum link added successfully!')
      }
      
      setForumLinkForm({
        title: '',
        url: '',
        platform: 'WhatsApp',
        description: ''
      })
      setEditingLinkId(null)
      setShowForumLinkForm(false)
      
      // Refresh course details
      fetchCourseDetails(selectedCourse)
    } catch (error) {
      console.error('Error managing forum link:', error)
      toast.error(error.response?.data?.message || 'Failed to save forum link')
    }
  }

  const handleEditForumLink = (link) => {
    setForumLinkForm({
      title: link.title,
      url: link.url,
      platform: link.platform || 'WhatsApp',
      description: link.description || ''
    })
    setEditingLinkId(link._id)
    setShowForumLinkForm(true)
  }

  const handleDeleteForumLink = async (linkId) => {
    if (!window.confirm('Are you sure you want to delete this forum link?')) {
      return
    }

    try {
      await courseAdminAPI.deleteForumLink(selectedCourse, linkId)
      toast.success('Forum link deleted successfully!')
      fetchCourseDetails(selectedCourse)
    } catch (error) {
      console.error('Error deleting forum link:', error)
      toast.error(error.response?.data?.message || 'Failed to delete forum link')
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
        {/* Manage Course Section */}
        {courseDetails ? (
          <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Managing: {courseDetails.course.title}</h2>

          {/* Course Information Edit Section */}
          <div className="mt-6 mb-6 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Course Information</h3>
                <button
                  onClick={() => {
                    setShowCourseEditForm(!showCourseEditForm)
                    if (!showCourseEditForm) {
                      // Populate form with current values
                      setCourseEditForm({
                        title: courseDetails.course.title || '',
                        description: courseDetails.course.description || '',
                        instructor: courseDetails.course.instructor || '',
                        units: courseDetails.course.units || 3,
                        image: courseDetails.course.image || ''
                      })
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  {showCourseEditForm ? 'Cancel' : 'Edit Course Info'}
                </button>
              </div>

              {showCourseEditForm ? (
                <form onSubmit={handleUpdateCourse} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Course Title *
                      </label>
                      <input
                        type="text"
                        value={courseEditForm.title}
                        onChange={(e) => setCourseEditForm({ ...courseEditForm, title: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Credit Units *
                      </label>
                      <input
                        type="number"
                        value={courseEditForm.units}
                        onChange={(e) => setCourseEditForm({ ...courseEditForm, units: parseInt(e.target.value) || 3 })}
                        min="1"
                        max="6"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructor Name
                    </label>
                    <input
                      type="text"
                      value={courseEditForm.instructor}
                      onChange={(e) => setCourseEditForm({ ...courseEditForm, instructor: e.target.value })}
                      placeholder="e.g., Dr. John Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={courseEditForm.description}
                      onChange={(e) => setCourseEditForm({ ...courseEditForm, description: e.target.value })}
                      placeholder="Course description..."
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Image URL
                    </label>
                    <input
                      type="url"
                      value={courseEditForm.image}
                      onChange={(e) => setCourseEditForm({ ...courseEditForm, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={editingCourse}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                      {editingCourse ? 'Updating...' : 'Update Course'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCourseEditForm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Title:</span>
                    <span className="ml-2 text-gray-900">{courseDetails.course.title}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Units:</span>
                    <span className="ml-2 text-gray-900">{courseDetails.course.units || 3}</span>
                  </div>
                  {courseDetails.course.instructor && (
                    <div>
                      <span className="font-medium text-gray-700">Instructor:</span>
                      <span className="ml-2 text-gray-900">{courseDetails.course.instructor}</span>
                    </div>
                  )}
                  {courseDetails.course.description && (
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-700">Description:</span>
                      <p className="mt-1 text-gray-900">{courseDetails.course.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">Topics in {courseDetails.course.title}</h3>
              <div className="space-y-4">
                {courseDetails.topics.length > 0 ? (
                  courseDetails.topics.map((topic) => (
                    <div key={topic._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="mb-2">
                        <h4 className="font-semibold">{topic.title}</h4>
                        {topic.description && (
                          <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Videos: {topic.videos.length}</p>
                        <p>Materials: {topic.materials?.length || 0}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No topics added yet. Import videos or playlists to create topics.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-8">
              <LoadingSpinner size="md" />
              <p className="text-gray-500 mt-4">Loading course information...</p>
            </div>
          </div>
        )}

        {/* Forum Links Management Section */}
        {courseDetails && (
          <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Forum Links for {courseDetails.course.title}</h2>
              <button
                onClick={() => {
                  setShowForumLinkForm(!showForumLinkForm)
                  if (showForumLinkForm) {
                    setForumLinkForm({ title: '', url: '', platform: 'WhatsApp', description: '' })
                    setEditingLinkId(null)
                  }
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
              >
                {showForumLinkForm ? 'Cancel' : '+ Add Forum Link'}
              </button>
            </div>

            {showForumLinkForm && (
              <form onSubmit={handleAddForumLink} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link Title *
                    </label>
                    <input
                      type="text"
                      value={forumLinkForm.title}
                      onChange={(e) => setForumLinkForm({ ...forumLinkForm, title: e.target.value })}
                      required
                      placeholder="e.g., MTH 101 WhatsApp Group"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform *
                    </label>
                    <select
                      value={forumLinkForm.platform}
                      onChange={(e) => setForumLinkForm({ ...forumLinkForm, platform: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Telegram">Telegram</option>
                      <option value="Discord">Discord</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link URL *
                  </label>
                  <input
                    type="url"
                    value={forumLinkForm.url}
                    onChange={(e) => setForumLinkForm({ ...forumLinkForm, url: e.target.value })}
                    required
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={forumLinkForm.description}
                    onChange={(e) => setForumLinkForm({ ...forumLinkForm, description: e.target.value })}
                    placeholder="Brief description of the forum/group..."
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    {editingLinkId ? 'Update Link' : 'Add Link'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForumLinkForm(false)
                      setForumLinkForm({ title: '', url: '', platform: 'WhatsApp', description: '' })
                      setEditingLinkId(null)
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {courseDetails.course.forumLinks && courseDetails.course.forumLinks.length > 0 ? (
                courseDetails.course.forumLinks.map((link) => (
                  <div key={link._id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{link.title}</h4>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                          {link.platform}
                        </span>
                      </div>
                      {link.description && (
                        <p className="text-sm text-gray-600 mb-2">{link.description}</p>
                      )}
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {link.url}
                      </a>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditForumLink(link)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteForumLink(link._id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No forum links added yet. Click "Add Forum Link" to add community links for this course.
                </p>
              )}
            </div>
          </div>
        )}

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
                      ? 'bg-purple-600 text-white'
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
                      ? 'bg-purple-600 text-white'
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
                  className="w-full py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {importing ? 'Importing...' : 'Import Playlist'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleImportVideo} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube Video URL *
                  </label>
                  <input
                    type="url"
                    value={videoForm.videoUrl}
                    onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
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
                  className="w-full py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={uploading || !courseDetails}
                className="w-full py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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

export default CourseAdminDashboard
