import logo from '../assets/logo.png'

const LoadingSpinner = ({ size = 'md' }) => {
  // Ring is only slightly bigger than the logo
  const ringClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  }

  const logoSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  return (
    <div className="flex items-center justify-center">
      <div className={`relative ${ringClasses[size]}`}>
        {/* Purple spinning circle — tightly wraps the logo */}
        <div className="absolute inset-0 border-[3px] border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        {/* Logo in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={logo}
            alt="Loading"
            className={`${logoSizeClasses[size]} object-contain`}
          />
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner
