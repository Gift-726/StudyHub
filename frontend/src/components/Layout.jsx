import { useState, useEffect } from 'react'
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
import FeedbackModal from './FeedbackModal'
import AskStudyBuddy from './AskStudyBuddy'

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isAiOpen, setIsAiOpen] = useState(false)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const features = [
    { name: 'Dashboard', keywords: ['home', 'dashboard', 'overview', 'stats', 'metrics', 'recent', 'watched', 'countdown'], action: () => navigate('/dashboard') },
    { name: 'Courses', keywords: ['study', 'courses', 'lectures', 'subjects', 'mth 101', 'mth 102', 'phy 101', 'phy 102', 'chm 101', 'chm 102', 'courses list'], action: () => navigate('/courses') },
    { name: 'Quizzes & CBT Simulator', keywords: ['quiz', 'test', 'exam', 'cbt', 'practice', 'simulator', 'mock exam', 'questions'], action: () => navigate('/quizzes') },
    { name: 'Library & Materials', keywords: ['library', 'books', 'past papers', 'materials', 'study materials', 'pdf', 'slides', 'read'], action: () => navigate('/library') },
    { name: 'CGPA Calculator', keywords: ['cgpa', 'gp', 'grades', 'calculator', 'results', 'units', 'calculate'], action: () => navigate('/cgpa-calculator') },
    { name: 'Motivation & Quotes', keywords: ['motivation', 'inspiration', 'morale', 'quotes', 'spark', 'encourage'], action: () => navigate('/motivation') },
    { name: 'Discussion Forum', keywords: ['forum', 'chat', 'discussion', 'groups', 'whatsapp', 'telegram', 'community', 'join'], action: () => navigate('/forum') },
    { name: 'Ask StudyBuddy AI Chatbot', keywords: ['ai', 'chatbot', 'studybuddy', 'buddy', 'helper', 'tutor', 'ask', 'question', 'bot', 'gemini'], action: () => setIsAiOpen(true) },
    { name: 'Logout session', keywords: ['signout', 'logout', 'exit', 'leave'], action: handleLogout }
  ]

  const filteredFeatures = searchQuery.trim() === ''
    ? []
    : features.filter(feat => 
        feat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feat.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
      )

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!document.getElementById('search-feature-container')?.contains(e.target) &&
          !document.getElementById('search-feature-container-mobile')?.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [])

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

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: dashboardIcon, isImage: true },
    { name: 'Courses', path: '/courses', icon: coursesIcon, isImage: true },
    { name: 'Quizzes', path: '/quizzes', icon: quizzesIcon, isImage: true },
    { name: 'Library', path: '/library', icon: coursesIcon, isImage: true },
    { name: 'CGPA Calculator', path: '/cgpa-calculator', icon: calculatorIcon, isImage: true },
    { name: 'Motivation', path: '/motivation', icon: chatIcon, isImage: true },
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
          ${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200
          transform transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo with Collapse Toggle */}
          <div className={`flex ${sidebarCollapsed ? 'flex-col py-6 px-2 gap-4' : 'flex-row p-6 justify-between gap-3'} items-center border-b border-gray-200`}>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Studyhub" className="w-10 h-10 object-contain" />
              {!sidebarCollapsed && (
                <span className="text-xl font-bold text-purple-brand">StudyHub</span>
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
                className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
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
          <div className="p-4 mt-auto">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors`}
              title={sidebarCollapsed ? 'Logout' : ''}
            >
              <img src={logoutIcon} alt="Logout" className="w-5 h-5 object-contain" />
              {!sidebarCollapsed && <span className="font-semibold text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-transparent px-4 md:px-8 pt-8 pb-4">
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
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{getPageTitle()}</h1>

            {/* Right side controls: Search, Notifications, Profile */}
            <div className="flex items-center gap-4 md:gap-6 ml-auto">
              {/* Search Bar */}
              <div className="hidden md:block w-64 relative" id="search-feature-container">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setDropdownOpen(true)
                  }}
                  onFocus={() => setDropdownOpen(true)}
                  placeholder="Search features (e.g. CGPA, AI)..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm shadow-sm transition-all"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                {/* Search Feature Dropdown */}
                {dropdownOpen && searchQuery.trim() !== '' && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-155 rounded-2xl shadow-xl z-[90] overflow-hidden py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      Features & Tools
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredFeatures.length > 0 ? (
                        filteredFeatures.map((feat, idx) => (
                          <button
                            key={idx}
                            onMouseDown={() => {
                              feat.action()
                              setSearchQuery('')
                              setDropdownOpen(false)
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-purple-50 hover:text-purple-brand font-semibold transition-colors flex items-center justify-between"
                          >
                            <span>{feat.name}</span>
                            <svg className="w-3 h-3 text-purple-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-xs text-gray-400 italic text-center">
                          No matching features found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Search Toggle Button */}
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="md:hidden p-2 text-gray-500 hover:bg-white hover:shadow-sm rounded-full transition-all border border-transparent hover:border-gray-150"
                aria-label="Search features"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:bg-white hover:shadow-sm rounded-full transition-all border border-transparent hover:border-gray-150">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <span className="hidden md:block text-sm font-bold text-gray-800 uppercase tracking-wide">
                  {getFirstName()}
                </span>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200">
                  <span className="text-purple-brand font-black">
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

      {/* Floating Chatbot Toggle Button */}
      <button
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-6 right-6 z-[70] w-14 h-14 bg-purple-brand text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 hover:scale-105 active:scale-95 transition-all duration-200"
        title="Ask StudyBuddy"
        aria-label="Ask StudyBuddy"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      <AskStudyBuddy
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-x-0 top-0 bg-[#faf9f6] z-[100] px-4 py-4 shadow-md border-b border-gray-200 flex items-center gap-3 animate-in slide-in-from-top duration-150">
          <div className="flex-1 relative" id="search-feature-container-mobile">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setDropdownOpen(true)
              }}
              onFocus={() => setDropdownOpen(true)}
              placeholder="Search features (e.g. CGPA, AI)..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm shadow-sm"
              autoFocus
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            {/* Mobile Suggestions Dropdown */}
            {dropdownOpen && searchQuery.trim() !== '' && (
              <div className="absolute left-0 mt-2 w-full bg-white border border-gray-155 rounded-2xl shadow-xl z-[110] overflow-hidden py-1">
                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  Features & Tools
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredFeatures.length > 0 ? (
                    filteredFeatures.map((feat, idx) => (
                      <button
                        key={idx}
                        onMouseDown={() => {
                          feat.action()
                          setSearchQuery('')
                          setDropdownOpen(false)
                          setMobileSearchOpen(false)
                        }}
                        className="w-full text-left px-4 py-3 text-xs text-gray-700 hover:bg-purple-50 hover:text-purple-brand font-semibold transition-colors flex items-center justify-between"
                      >
                        <span>{feat.name}</span>
                        <svg className="w-3 h-3 text-purple-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-xs text-gray-400 italic text-center">
                      No matching features found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => {
              setMobileSearchOpen(false)
              setSearchQuery('')
            }}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      <FeedbackModal />
    </div>
  )
}

export default Layout

