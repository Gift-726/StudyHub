import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

const NotFound = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleGoHome = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }

  const content = (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* 404 Number */}
      <div className="mb-6">
        <h1 className="text-9xl md:text-[12rem] font-bold text-purple-brand opacity-20">
          404
        </h1>
      </div>

      {/* Error Message */}
      <div className="mb-8 max-w-md">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-2">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="text-gray-500">
          It might have been moved, deleted, or you entered the wrong URL.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleGoHome}
          className="px-6 py-3 btn-purple text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          {user ? 'Go to Dashboard' : 'Go to Login'}
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Go Back
        </button>
      </div>

      {/* Quick Links */}
      {user && (
        <div className="mt-12 pt-8 border-t border-gray-200 w-full max-w-md">
          <p className="text-sm text-gray-500 mb-4">Quick Links:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm text-purple-brand hover:bg-purple-50 rounded-lg transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="px-4 py-2 text-sm text-purple-brand hover:bg-purple-50 rounded-lg transition-colors"
            >
              Courses
            </button>
            <button
              onClick={() => navigate('/quizzes')}
              className="px-4 py-2 text-sm text-purple-brand hover:bg-purple-50 rounded-lg transition-colors"
            >
              Quizzes
            </button>
            <button
              onClick={() => navigate('/forum')}
              className="px-4 py-2 text-sm text-purple-brand hover:bg-purple-50 rounded-lg transition-colors"
            >
              Forum
            </button>
          </div>
        </div>
      )}
    </div>
  )

  // If user is logged in, use Layout, otherwise show standalone page
  if (user) {
    return <Layout>{content}</Layout>
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
      {content}
    </div>
  )
}

export default NotFound
