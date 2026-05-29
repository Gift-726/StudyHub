import { useNavigate } from 'react-router-dom'

const GuestRestrictionModal = ({ isOpen, onClose, actionName = 'access this feature' }) => {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleRegister = () => {
    onClose()
    navigate('/signup')
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 z-10 border border-gray-100 transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95">
        {/* Header Icon */}
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
          <svg 
            className="h-6 w-6 text-purple-brand" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m0 0v2m0-2h2m-2h-2m2-12a8 8 0 11-16 0 8 8 0 0116 0z" 
            />
          </svg>
        </div>

        {/* Modal Title */}
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
          Create Account Required
        </h3>

        {/* Modal Message */}
        <p className="text-sm text-gray-600 text-center mb-6">
          You are currently in **Guest Mode**. You need to register an account or log in to {actionName} and track your academic progress!
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
          >
            Keep Previewing
          </button>
          <button
            onClick={handleRegister}
            className="flex-1 px-4 py-2.5 btn-purple text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default GuestRestrictionModal
