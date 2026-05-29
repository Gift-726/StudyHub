import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import logo from '../assets/logo.png'
import authBg from '../assets/authBg.png'
import api from '../services/api'

const EnterOTP = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ''
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    if (!email) {
      toast.error('Email not found. Please start over.')
      navigate('/forgot-password')
    }
  }, [email, navigate])

  const handleChange = (index, value) => {
    if (value.length > 1) return // Only allow single digit
    
    const newOtp = [...otp]
    newOtp[index] = value.replace(/[^0-9]/g, '') // Only numbers
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6)
    const newOtp = [...otp]
    pastedData.split('').forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit
      }
    })
    setOtp(newOtp)
    // Focus the last filled input or the last input
    const lastIndex = Math.min(pastedData.length - 1, 5)
    inputRefs.current[lastIndex]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP code')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/auth/verify-otp', { email, otp: otpString })
      if (response.data.success) {
        toast.success('OTP verified successfully!')
        navigate('/reset-password', { state: { email, token: response.data.token } })
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.')
      // Clear OTP on error
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
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
              Enter OTP
            </h1>

            <p className="text-sm sm:text-base text-gray-700 mb-6 sm:mb-8 leading-relaxed">
              Enter the 6-digit OTP code sent to your email
            </p>

            <form className="flex flex-col gap-4 sm:gap-6" onSubmit={handleSubmit}>
              {/* OTP Input Fields */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-full aspect-square text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 rounded bg-white text-black focus:outline-none focus:border-[#4B2E83] transition-colors"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-3.5 btn-purple text-white rounded border-none text-base font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2 leading-normal"
              >
                {loading ? 'Verifying...' : 'Confirm'}
              </button>

              {/* Back to sign in */}
              <div className="text-center mt-4">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-black hover:opacity-70 transition-opacity leading-normal"
                >
                  Back to forgot password
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

export default EnterOTP

