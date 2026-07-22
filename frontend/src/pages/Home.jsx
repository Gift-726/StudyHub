import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'
import authBg from '../assets/authBg.png'

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#faf9f6] text-gray-900 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-150 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-purple-brand/10 rounded-xl flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform">
              <img src={logo} alt="StudyHub" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-extrabold text-purple-brand tracking-tight font-heading">
              StudyHub
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#features" className="hover:text-purple-brand transition-colors">Features</a>
            <a href="#library" className="hover:text-purple-brand transition-colors">Resource Library</a>
            <a href="#cbt" className="hover:text-purple-brand transition-colors">CBT Simulator</a>
            <a href="#ai" className="hover:text-purple-brand transition-colors">AI Tutor</a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 bg-[#4B2E83] text-white rounded-xl font-bold text-xs shadow-md shadow-[#4B2E83]/20 hover:bg-[#3b2368] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
              >
                <span>Go to Dashboard</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-xs font-bold text-[#4B2E83] hover:bg-purple-50 rounded-xl transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#4B2E83] to-[#5e3da1] text-white rounded-xl font-bold text-xs shadow-md shadow-[#4B2E83]/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-purple-50/60 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-purple-brand text-xs font-extrabold uppercase tracking-wider">
              <span>✨ Built for Excellence at FUTA</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-gray-900 leading-[1.15]">
              Master Your Courses with <span className="bg-gradient-to-r from-[#4B2E83] via-purple-600 to-[#5e3da1] bg-clip-text text-transparent">StudyHub</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
              Access 100L–500L past questions, practice interactive CBT mock exams, calculate your CGPA, and learn with StudyBuddy AI—all in one place.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate(user ? '/dashboard' : '/signup')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#4B2E83] to-[#5e3da1] text-white rounded-2xl font-bold text-sm shadow-xl shadow-[#4B2E83]/25 hover:shadow-2xl hover:shadow-[#4B2E83]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3"
              >
                <span>{user ? 'Open Workspace' : 'Start Learning Free'}</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              <button
                onClick={() => navigate(user ? '/library' : '/login')}
                className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-250 text-gray-800 rounded-2xl font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-purple-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Browse Resource Library</span>
              </button>
            </div>
          </div>

          {/* Feature Showcase Banner */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl overflow-hidden border border-gray-200 shadow-2xl bg-white p-3 sm:p-4">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-gradient-to-tr from-[#2c1854] via-[#4B2E83] to-[#5e3da1] flex items-center justify-center p-6 text-white text-center">
              <img src={authBg} alt="Students studying" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" />
              <div className="relative z-10 max-w-2xl space-y-3">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-bold uppercase tracking-wider text-purple-100">
                  Interactive Academic Platform
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-heading">
                  Designed Specifically for University Success
                </h3>
                <p className="text-xs sm:text-sm text-purple-100/90 font-medium">
                  Organized by Faculty, Department, and Level with direct PDF downloads and instant CBT exam feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-gray-900 tracking-tight">
              Everything You Need to Ace Your Exams
            </h2>
            <p className="text-sm sm:text-base text-gray-500 font-medium">
              StudyHub equips you with targeted academic tools built around your course curriculum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div id="library" className="p-8 rounded-3xl bg-[#faf9f6] border border-gray-200/80 hover:border-purple-300 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-brand flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Resource Library</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                Download verified lecture notes, departmental summaries, and past questions directly to your device.
              </p>
            </div>

            {/* Feature 2 */}
            <div id="cbt" className="p-8 rounded-3xl bg-[#faf9f6] border border-gray-200/80 hover:border-purple-300 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-brand flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">CBT Exam Simulator</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                Practice timed computer-based tests with real question patterns and receive instant score breakdowns.
              </p>
            </div>

            {/* Feature 3 */}
            <div id="ai" className="p-8 rounded-3xl bg-[#faf9f6] border border-gray-200/80 hover:border-purple-300 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-brand flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">StudyBuddy AI Tutor</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                Gemini-powered AI coach to explain complex math derivations, physics formulas, and chemistry concepts step-by-step.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-3xl bg-[#faf9f6] border border-gray-200/80 hover:border-purple-300 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-brand flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">CGPA &amp; GP Calculator</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                Calculate semester grade points and plan target cumulative CGPA accurately based on course credit units.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-3xl bg-[#faf9f6] border border-gray-200/80 hover:border-purple-300 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-brand flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Student Community Forum</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                Connect with departmental WhatsApp groups, course representatives, and peer discussion spaces.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-3xl bg-[#faf9f6] border border-gray-200/80 hover:border-purple-300 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-brand flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Motivation &amp; Productivity</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                Daily academic quotes, exam countdown timers, and active recall study tips to maintain high performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-12 bg-gradient-to-r from-[#2c1854] to-[#4B2E83] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black font-heading text-purple-200">100+</p>
              <p className="text-xs sm:text-sm text-purple-100/80 font-medium">Library PDFs</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black font-heading text-purple-200">50+</p>
              <p className="text-xs sm:text-sm text-purple-100/80 font-medium">CBT Quizzes</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black font-heading text-purple-200">5,000+</p>
              <p className="text-xs sm:text-sm text-purple-100/80 font-medium">Practice Questions</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black font-heading text-purple-200">24/7</p>
              <p className="text-xs sm:text-sm text-purple-100/80 font-medium">AI Coach Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-gray-900 text-gray-400 py-10 border-t border-gray-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="StudyHub" className="w-8 h-8 object-contain" />
            <span className="text-base font-extrabold text-white font-heading">StudyHub</span>
          </div>

          <p className="text-gray-400 font-medium text-center">
            © 2026 StudyHub Academic Workspace. All rights reserved.
          </p>

          <div className="flex items-center gap-6 font-semibold">
            <Link to="/login" className="hover:text-white transition-colors">Log In</Link>
            <Link to="/signup" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
