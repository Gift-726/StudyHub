import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const FeedbackModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [reason, setReason] = useState('exam-prep')
  const [suggestions, setSuggestions] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const userId = user.isGuest ? 'guest' : (user._id || user.id || 'anonymous')
    // Check if already submitted or dismissed in this session
    const isSubmitted = localStorage.getItem(`studyhub_feedback_submitted_${userId}`) === 'true'
    const isDismissed = sessionStorage.getItem(`studyhub_feedback_dismissed_${userId}`) === 'true'
    
    if (isSubmitted || isDismissed) return

    // Retrieve login count
    const countStr = localStorage.getItem(`loginCount_${userId}`) || '0'
    const loginCount = parseInt(countStr, 10)

    if (loginCount >= 5) {
      // Trigger modal open after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [user])

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate saving feedback
    setTimeout(() => {
      const feedbackData = {
        rating,
        reason,
        suggestions,
        submittedAt: new Date().toISOString()
      }
      
      const userId = user?.isGuest ? 'guest' : (user?._id || user?.id || 'anonymous')
      localStorage.setItem(`studyhub_feedback_data_${userId}`, JSON.stringify(feedbackData))
      localStorage.setItem(`studyhub_feedback_submitted_${userId}`, 'true')
      
      setIsOpen(false)
      setIsSubmitting(false)
      toast.success('Thank you for helping us improve StudyHub!')
    }, 1000)
  }

  const handleDismiss = () => {
    // Dismiss for the current browser session only, will prompt again next session if they don't submit
    const userId = user?.isGuest ? 'guest' : (user?._id || user?.id || 'anonymous')
    sessionStorage.setItem(`studyhub_feedback_dismissed_${userId}`, 'true')
    setIsOpen(false)
    toast('We will ask you later. Happy studying!')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-65 backdrop-blur-sm" />

      {/* Modal box */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10 border border-gray-200 transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Help Us Upgrade StudyHub!</h3>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          We noticed you have logged in 5+ times. Tell us what features you think we should add next to make the app even better!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Why are you using the app */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Why do you use StudyHub?</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="exam-prep">FUTA Exam & CBT Preparation</option>
              <option value="courses">Watching Course Videos</option>
              <option value="cgpa">CGPA & Semester Tracking</option>
              <option value="library">Library & Past Questions</option>
              <option value="other">Other / Personal Reference</option>
            </select>
          </div>

          {/* Feature Suggestions */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">What features or upgrades should we add?</label>
            <textarea
              required
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              placeholder="e.g. Add real-time study groups, more PHY 101 question sets, dark mode..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Rate your experience</label>
            <div className="flex gap-2 items-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-2xl focus:outline-none"
                >
                  {star <= rating ? '★' : '☆'}
                </button>
              ))}
              <span className="ml-2 font-bold text-purple-brand">{rating}/5 Stars</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleDismiss}
              className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors text-center"
            >
              Ask Me Later
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 btn-purple text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FeedbackModal
