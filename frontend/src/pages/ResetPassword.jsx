import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import logo from '../assets/logo.png'
import authBg from '../assets/authBg.png'
import api from '../services/api'

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const email = location.state?.email || ''
  const token = location.state?.token || ''
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!email || !token) {
      toast.error('Invalid reset link. Please start over.')
      navigate('/forgot-password')
    }
  }, [email, token, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/auth/reset-password', {
        email,
        token,
        password: formData.password,
      })

      if (response.data.success) {
        toast.success('Password reset successfully!')
        // Auto-login the user
        const loginResult = await login(email, formData.password)
        if (loginResult.success) {
          navigate('/dashboard')
        } else {
          navigate('/login')
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.')
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
                <span className="text-lg sm:text-xl font-bold text-black">StudyHub</span>
              </div>
              <Link 
                to="/login" 
                className="text-sm sm:text-base text-black font-normal hover:opacity-70 transition-opacity"
              >
                Log in
              </Link>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6 sm:mb-7 leading-tight">
              Reset Password
            </h1>

            <form className="flex flex-col gap-4 sm:gap-6" onSubmit={handleSubmit}>
              {/* New Password */}
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium text-black leading-normal">
                  Enter New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 sm:py-3 pr-12 border border-black rounded bg-white text-base text-black placeholder:text-gray-500 focus:outline-none focus:border-gray-700 transition-colors leading-normal"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-black leading-normal">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 sm:py-3 pr-12 border border-black rounded bg-white text-base text-black placeholder:text-gray-500 focus:outline-none focus:border-gray-700 transition-colors leading-normal"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition-colors focus:outline-none"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-3.5 bg-black text-white rounded border-none text-base font-medium cursor-pointer hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2 leading-normal"
              >
                {loading ? 'Resetting...' : 'Reset'}
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

export default ResetPassword

