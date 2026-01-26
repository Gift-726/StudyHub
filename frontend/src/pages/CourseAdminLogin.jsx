import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { courseAdminAPI } from '../services/api'
import toast from 'react-hot-toast'

const CourseAdminLogin = () => {
  const [formData, setFormData] = useState({
    courseId: '',
    email: '',
    name: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.courseId) {
      toast.error('Course ID is required')
      return
    }

    setLoading(true)

    try {
      const response = await courseAdminAPI.login(formData)
      
      // Store token and course ID
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('courseAdminCourseId', response.data.courseId)
      
      // Update auth context by calling getMe
      const authResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${response.data.token}`
        }
      })
      const userData = await authResponse.json()
      
      // Update auth context
      if (login) {
        // Store user data in context
        window.location.href = '/course-admin/dashboard'
      } else {
        // Fallback: just redirect
        window.location.href = '/course-admin/dashboard'
      }
      
      toast.success(`Welcome! Managing: ${response.data.courseTitle}`)
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Course Admin Access</h2>
          <p className="text-gray-600">Enter your course ID to manage course materials</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course ID *
            </label>
            <input
              type="text"
              value={formData.courseId}
              onChange={(e) => setFormData({...formData, courseId: e.target.value})}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter course ID"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the course ID you've been assigned to manage
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Email (Optional)
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="your@email.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional - account will be created automatically if not exists
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your name"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Logging in...' : 'Access Dashboard'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact the system administrator
          </p>
        </div>
      </div>
    </div>
  )
}

export default CourseAdminLogin
