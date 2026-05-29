import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import logo from '../assets/logo.png'
import authBg from '../assets/authBg.png'
import api from '../services/api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/auth/forgot-password', { email })
      if (response.data.success) {
        toast.success('OTP code sent to your email!')
        navigate('/enter-otp', { state: { email } })
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full h-screen bg-[#faf9f6] overflow-hidden">
      {/* Left side with background image */}
      <div className="hidden lg:flex flex-1 relative h-screen overflow-hidden">
        <img 
          src={authBg} 
          alt="Students studying" 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Right side with form */}
      <div className="flex-1 flex flex-col bg-[#faf9f6] px-4 sm:px-6 md:px-12 lg:px-16 h-screen overflow-y-auto">
        {/* Content - start from top on mobile, center on desktop */}
        <div className="flex-1 flex items-start lg:items-center justify-center pt-4 sm:pt-6 lg:pt-0 pb-4 sm:pb-6">
          <div className="max-w-md w-full">
            {/* Header - aligned with form content */}
            <div className="flex justify-between items-center mb-6 sm:mb-7">
              <div className="flex items-center gap-2 sm:gap-3">
                <img 
                  src={logo} 
                  alt="Studyhub logo" 
                  className="h-8 sm:h-10 w-auto" 
                />
                <span className="text-lg sm:text-xl font-bold text-purple-brand">StudyHub</span>
              </div>
              <Link 
                to="/login" 
                className="text-sm sm:text-base text-black font-normal hover:opacity-70 transition-opacity"
              >
                Log in
              </Link>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4 sm:mb-6 leading-tight">
              Reset Password
            </h1>

            <p className="text-sm sm:text-base text-gray-700 mb-6 sm:mb-8 leading-relaxed">
              Please enter your email address. You will receive an OTP code to reset your password.
            </p>

            <form className="flex flex-col gap-4 sm:gap-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-black leading-normal">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 border border-black rounded bg-white text-base text-black placeholder:text-gray-500 focus:outline-none focus:border-gray-700 transition-colors leading-normal"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-3.5 btn-purple text-white rounded border-none text-base font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2 leading-normal"
              >
                {loading ? 'Sending...' : 'Request code'}
              </button>

              {/* Back to sign in */}
              <div className="text-center mt-4">
                <Link 
                  to="/login" 
                  className="text-sm text-black hover:opacity-70 transition-opacity leading-normal"
                >
                  Back to sign in
                </Link>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-600 text-center mt-4 leading-relaxed">
                Terms of Service and Privacy Policy
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

