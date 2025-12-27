import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import logo from '../assets/logo.png'
import authBg from '../assets/authBg.png'
import { faculties, levels } from '../utils/faculties'

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    faculty: '',
    department: '',
    level: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [availableDepartments, setAvailableDepartments] = useState([])
  const { register } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'faculty') {
      // When faculty changes, update available departments and reset department
      setFormData({
        ...formData,
        faculty: value,
        department: '', // Reset department when faculty changes
      })
      setAvailableDepartments(faculties[value] || [])
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await register(formData)
      if (result.success) {
        toast.success('Account created successfully!')
        navigate('/dashboard')
      } else {
        toast.error(result.message || 'Registration failed')
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

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6 sm:mb-7 leading-tight">
              Create an Account
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
                    minLength={6}
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

              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label htmlFor="fullName" className="text-sm font-medium text-black leading-normal">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 border border-black rounded bg-white text-base text-black placeholder:text-gray-500 focus:outline-none focus:border-gray-700 transition-colors leading-normal"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Faculty */}
              <div className="flex flex-col gap-2">
                <label htmlFor="faculty" className="text-sm font-medium text-black leading-normal">
                  Select Faculty
                </label>
                <div className="relative">
                  <select
                    id="faculty"
                    name="faculty"
                    required
                    value={formData.faculty}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 sm:py-3 pr-10 border border-black rounded bg-white text-base text-black focus:outline-none focus:border-gray-700 transition-colors leading-normal appearance-none cursor-pointer"
                  >
                    <option value="">Select Faculty</option>
                    {Object.keys(faculties).map((faculty) => (
                      <option key={faculty} value={faculty}>
                        {faculty}
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Department */}
              <div className="flex flex-col gap-2">
                <label htmlFor="department" className="text-sm font-medium text-black leading-normal">
                  Select Department
                </label>
                <div className="relative">
                  <select
                    id="department"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    disabled={!formData.faculty || availableDepartments.length === 0}
                    className="w-full px-4 py-2.5 sm:py-3 pr-10 border border-black rounded bg-white text-base text-black focus:outline-none focus:border-gray-700 transition-colors leading-normal appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">
                      {formData.faculty ? 'Select Department' : 'Select Faculty first'}
                    </option>
                    {availableDepartments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Level */}
              <div className="flex flex-col gap-2">
                <label htmlFor="level" className="text-sm font-medium text-black leading-normal">
                  Select Level
                </label>
                <div className="relative">
                  <select
                    id="level"
                    name="level"
                    required
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 sm:py-3 pr-10 border border-black rounded bg-white text-base text-black focus:outline-none focus:border-gray-700 transition-colors leading-normal appearance-none cursor-pointer"
                  >
                    <option value="">Select Level</option>
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}L
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                By creating an account you are agreeing to the Terms of Service and Privacy Policy
              </p>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-3.5 btn-purple text-white rounded border-none text-base font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2 mb-6 sm:mb-10 leading-normal"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
