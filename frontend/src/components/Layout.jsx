import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import dashboardIcon from '../assets/dashboard-square-02.png'
import coursesIcon from '../assets/notebook-02.png'
import quizzesIcon from '../assets/quiz-02.png'
import calculatorIcon from '../assets/calculator-01.png'
import chatIcon from '../assets/chat.png'
import logoutIcon from '../assets/logout-square-01.png'
import sidebarIcon from '../assets/sidebar-left-01.png'

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Get the first name from fullName
  const getFirstName = () => {
    if (user?.fullName) {
      return user.fullName.split(' ')[0].toUpperCase()
    }
    if (user?.firstName) {
      return user.firstName.toUpperCase()
    }
    return 'USER'
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: dashboardIcon, isImage: true },
    { name: 'Courses', path: '/courses', icon: coursesIcon, isImage: true },
    { name: 'Quizzes', path: '/quizzes', icon: quizzesIcon, isImage: true },
    { name: 'CGPA Calculator', path: '/cgpa-calculator', icon: calculatorIcon, isImage: true },
    { name: 'Forum', path: '/forum', icon: chatIcon, isImage: true },
  ]

  const isActive = (path) => location.pathname === path

  const getPageTitle = () => {
    const currentItem = navigationItems.find(item => item.path === location.pathname)
    return currentItem ? currentItem.name : 'Studyhub'
  }

  return (
    <div className="flex min-h-screen bg-[#faf9f6]">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          ${sidebarCollapsed ? 'w-20' : 'w-64'} bg-[#faf9f6] border-r border-gray-200
          transform transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo with Collapse Toggle */}
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} gap-3 p-6 border-b border-gray-200`}>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Studyhub" className="w-10 h-10" />
              {!sidebarCollapsed && (
                <span className="text-xl font-bold text-purple-brand">Studyhub</span>
              )}
            </div>
            {!sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <img src={sidebarIcon} alt="Collapse sidebar" className="w-5 h-5 object-contain" />
              </button>
            )}
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <img src={sidebarIcon} alt="Expand sidebar" className="w-5 h-5 object-contain rotate-180" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  setSidebarOpen(false)
                }}
                className={`
                  w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg
                  transition-colors text-left
                  ${isActive(item.path)
                    ? 'bg-purple-100 text-purple-brand font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
                title={sidebarCollapsed ? item.name : ''}
              >
                {item.isImage ? (
                  <img src={item.icon} alt={item.name} className="w-5 h-5 object-contain" />
                ) : (
                  <span className="text-xl">{item.icon}</span>
                )}
                {!sidebarCollapsed && <span>{item.name}</span>}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors`}
              title={sidebarCollapsed ? 'Logout' : ''}
            >
              <img src={logoutIcon} alt="Logout" className="w-5 h-5 object-contain" />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Page Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{getPageTitle()}</h1>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search Courses..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Notifications & Profile */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {getFirstName()}
                </span>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-brand font-semibold">
                    {getFirstName().charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout

