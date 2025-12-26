import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen p-10 bg-[#faf9f6]">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-black">
          Welcome to Studyhub, {user?.fullName?.split(' ')[0] || user?.fullName}!
        </h1>
        <button 
          onClick={handleLogout} 
          className="px-5 py-2.5 bg-black text-white rounded cursor-pointer text-sm hover:bg-gray-800 transition-colors"
        >
          Logout
        </button>
      </div>
      <div className="max-w-3xl mx-auto p-10 bg-white rounded-lg shadow-sm">
        <p className="text-lg text-gray-600 text-center">
          Your dashboard is ready. Video features will be added soon!
        </p>
      </div>
    </div>
  )
}

export default Dashboard
