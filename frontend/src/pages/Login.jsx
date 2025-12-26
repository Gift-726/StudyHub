import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import logoWithText from '../assets/logoWithText.png'
import authBg from '../assets/authBg.png'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        toast.success('Logged in successfully!')
        navigate('/dashboard')
      } else {
        toast.error(result.message || 'Login failed')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
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
            <div className="flex justify-between items-center mb-6 sm:mb-10">
              <img 
                src={logoWithText} 
                alt="Studyhub" 
                className="h-8 sm:h-10 w-auto" 
              />
              <Link 
                to="/signup" 
                className="text-sm sm:text-base text-black font-normal hover:opacity-70 transition-opacity"
              >
                Create Account
              </Link>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6 sm:mb-10 leading-tight">
              Sign in
            </h1>

            <form className="flex flex-col gap-4 sm:gap-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-black leading-normal">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 border border-black rounded bg-white text-base text-black placeholder:text-gray-500 focus:outline-none focus:border-gray-700 transition-colors leading-normal"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium text-black leading-normal">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 sm:py-3 pr-12 border border-black rounded bg-white text-base text-black placeholder:text-gray-500 focus:outline-none focus:border-gray-700 transition-colors leading-normal"
                    placeholder="Enter your password"
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

              {/* Remember Me and Forgot Password */}
              <div className="flex justify-between items-center -mt-2">
                <label className="flex items-center gap-2 text-sm text-black cursor-pointer leading-normal">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 sm:w-4.5 sm:h-4.5 cursor-pointer"
                  />
                  <span>Remember Me</span>
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs sm:text-sm text-black hover:opacity-70 transition-opacity leading-normal"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-3.5 bg-black text-white rounded border-none text-base font-medium cursor-pointer hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2 leading-normal"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>

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

export default Login
