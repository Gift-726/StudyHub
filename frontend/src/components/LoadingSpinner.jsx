import logo from '../assets/logo.png'

const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }

  const logoSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex items-center justify-center">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Purple spinning circle */}
        <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
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
