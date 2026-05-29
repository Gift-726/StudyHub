import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import GuestRestrictionModal from '../components/GuestRestrictionModal'
import AskStudyBuddy from '../components/AskStudyBuddy'
import { academicQuestions, techQuestions } from '../utils/quizQuestions'
import toast from 'react-hot-toast'

const Quizzes = () => {
  const { user } = useAuth()
  const [viewState, setViewState] = useState('setup') // 'setup', 'exam', 'result'
  const [isRestrictModalOpen, setIsRestrictModalOpen] = useState(false)
  const [restrictAction, setRestrictAction] = useState('')

  // 1. CBT Setup Configs
  const [matricNo, setMatricNo] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [cbtHistory, setCbtHistory] = useState([])

  // 2. Exam States
  const [questions, setQuestions] = useState([])
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState({}) // { questionId: selectedOptionIndex }
  const [timeLeft, setTimeLeft] = useState(0)
  const [examActive, setExamActive] = useState(false)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTimeStr, setElapsedTimeStr] = useState('')

  // 3. Result States
  const [score, setScore] = useState(0)
  const [percentage, setPercentage] = useState(0)

  // 4. AI Ask Panel State
  const [isAiOpen, setIsAiOpen] = useState(false)
  const [aiInitialQuery, setAiInitialQuery] = useState('')

  // Load history from localStorage
  useEffect(() => {
    const key = user?.email ? `studyhub_cbt_history_${user.email}` : 'studyhub_cbt_history_guest'
    const saved = localStorage.getItem(key)
    if (saved) {
      setCbtHistory(JSON.parse(saved))
    } else {
      setCbtHistory([])
    }
  }, [user])

  const saveCbtAttempt = (attempt) => {
    const key = user?.email ? `studyhub_cbt_history_${user.email}` : 'studyhub_cbt_history_guest'
    const updated = [attempt, ...cbtHistory]
    localStorage.setItem(key, JSON.stringify(updated))
    setCbtHistory(updated)

    // Increment guest test counter if guest
    if (user?.isGuest) {
      const guestCounter = parseInt(localStorage.getItem('studyhub_guest_cbt_count') || '0')
      localStorage.setItem('studyhub_guest_cbt_count', (guestCounter + 1).toString())
    }
  }

  // Timer Effect
  useEffect(() => {
    if (!examActive || timeLeft <= 0) {
      if (examActive && timeLeft === 0) {
        handleExamSubmit(true) // Auto-submit when timer hits 0
      }
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [examActive, timeLeft])

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // -------------------------------------------------------------
  // SETUP ACTION
  // -------------------------------------------------------------
  const handleStartCbt = (e) => {
    e.preventDefault()

    if (!matricNo.trim()) {
      toast.error('Please enter your Matriculation or UTME Reg Number')
      return
    }
    if (!selectedCourse) {
      toast.error('Please select a course to start')
      return
    }

    // Check guest restriction: Guest is allowed to take exactly 1 test
    if (user?.isGuest) {
      const guestCounter = parseInt(localStorage.getItem('studyhub_guest_cbt_count') || '0')
      if (guestCounter >= 1) {
        setRestrictAction('take another CBT practice exam')
        setIsRestrictModalOpen(true)
        return
      }
    }

    // Load appropriate questions
    let selectedQs = []
    if (selectedCourse === 'tech-news') {
      const dept = user?.department || 'Computer Science'
      if (techQuestions[dept]) {
        selectedQs = [...techQuestions[dept]]
      } else {
        selectedQs = [...techQuestions['Computer Science']]
      }
    } else {
      selectedQs = [...academicQuestions[selectedCourse]]
    }

    if (selectedQs.length === 0) {
      toast.error('Questions are currently unavailable for this category')
      return
    }

    setQuestions(selectedQs)
    setAnswers({})
    setCurrentQuestionIdx(0)
    setTimeLeft(selectedQs.length * 60) // 1 minute per question
    setStartTime(Date.now())
    setExamActive(true)
    setViewState('exam')
    toast.success('Exam session started. Good luck!')
  }

  // -------------------------------------------------------------
  // EXAM NAV & ACTIONS
  // -------------------------------------------------------------
  const handleOptionSelect = (optionIdx) => {
    const activeQ = questions[currentQuestionIdx]
    setAnswers({
      ...answers,
      [activeQ.id]: optionIdx
    })
  }

  const handleExamSubmit = (isAuto = false) => {
    setExamActive(false)
    setShowSubmitConfirm(false)

    // Calculate elapsed time
    const end = Date.now()
    const elapsedSeconds = Math.floor((end - startTime) / 1000)
    const elapsedMins = Math.floor(elapsedSeconds / 60)
    const remainingSecs = elapsedSeconds % 60
    const timeSpent = `${elapsedMins}m ${remainingSecs}s`
    setElapsedTimeStr(timeSpent)

    // Grade exam
    let correctCount = 0
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++
      }
    })

    const pct = Math.round((correctCount / questions.length) * 100)
    setScore(correctCount)
    setPercentage(pct)

    // Save to history
    saveCbtAttempt({
      id: Date.now(),
      course: selectedCourse === 'tech-news' ? `Tech Insights (${user?.department || 'Tech'})` : selectedCourse,
      score: `${correctCount}/${questions.length}`,
      percentage: pct,
      date: new Date().toLocaleDateString(),
      timeSpent
    })

    setViewState('result')
    if (isAuto) {
      toast.error('Time is up! Your exam has been automatically submitted.')
    } else {
      toast.success('Exam submitted successfully!')
    }
  }

  // Ask AI about correction question
  const handleAskBuddyAboutQuestion = (q, selectedOptIdx) => {
    let contextStr = `Question: "${q.question}"\n`
    q.options.forEach((opt, idx) => {
      contextStr += `${String.fromCharCode(65 + idx)}. ${opt}\n`
    })
    contextStr += `Correct Answer: ${String.fromCharCode(66 + q.correctAnswer)} (${q.options[q.correctAnswer]})\n`
    if (selectedOptIdx !== undefined) {
      contextStr += `My Selected Answer: ${String.fromCharCode(66 + selectedOptIdx)} (${q.options[selectedOptIdx]})\n`
    }
    contextStr += `Please explain why this answer is correct and break down the solution step-by-step.`

    setAiInitialQuery(contextStr)
    setIsAiOpen(true)
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        
        {/* VIEW 1: CBT LOGIN / SETUP SCREEN */}
        {viewState === 'setup' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Simulation Login Card */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-205 border-t-8 border-purple-brand overflow-hidden">
              <div className="bg-purple-brand p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-wider text-sm sm:text-base">PRE-CBT PRACTICE SIMULATOR</span>
                </div>
                <span className="text-xs bg-purple-100 text-purple-brand px-2 py-0.5 rounded font-bold">SIMULATION ENGINE</span>
              </div>

              <form onSubmit={handleStartCbt} className="p-6 space-y-5 bg-white">
                <div className="bg-purple-50 border-l-4 border-purple-brand p-4 text-sm text-purple-900">
                  <p className="font-semibold">Important Instruction:</p>
                  <p className="mt-1">Please enter your matriculation details and select a course below to simulate FUTA's CBT environment. Guest users are limited to 1 trial exam.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Registration/Matric Number</label>
                    <input
                      type="text"
                      value={matricNo}
                      onChange={(e) => setMatricNo(e.target.value.toUpperCase())}
                      placeholder="e.g. CSC/21/1054"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-semibold uppercase bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Course Code / Subject</label>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-semibold bg-white"
                    >
                      <option value="">-- Choose Subject --</option>
                      <option value="MTH 101">MTH 101 - General Mathematics I</option>
                      <option value="PHY 101">PHY 101 - General Physics I</option>
                      <option value="CHM 101">CHM 101 - General Chemistry I</option>
                      <option value="CSC 201">CSC 201 - Intro to Programming</option>
                      <option value="GST 111">GST 111 - Communication in English</option>
                      <option value="tech-news">Extracurricular Tech Insights ({user?.department || 'Tech'})</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-purple-brand text-white font-extrabold text-sm tracking-wider hover:bg-purple-700 transition-colors border border-purple-800 rounded uppercase shadow-sm"
                >
                  Enter Exam Hall (Login)
                </button>
              </form>
            </div>

            {/* Guidelines Panel */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-2 mb-4">CBT Guidelines</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-brand font-bold">✓</span>
                    <span>Questions are multiple choice with four options (A, B, C, D).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-brand font-bold">✓</span>
                    <span>The countdown timer starts immediately. Exams auto-submit upon expiry.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-brand font-bold">✓</span>
                    <span>Use the question grid numbers on the side to navigate non-sequentially.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
                <span className="font-semibold block text-gray-500">STUDYHUB CBT CENTER</span>
                <span>Standardized Simulation Engine</span>
              </div>
            </div>

            {/* CBT Attempt History */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">CBT Exam Attendance & Score Log</h3>
              {cbtHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                        <th className="py-2.5 px-4">Exam/Course</th>
                        <th className="py-2.5 px-4">Score</th>
                        <th className="py-2.5 px-4">Percentage</th>
                        <th className="py-2.5 px-4">Time Spent</th>
                        <th className="py-2.5 px-4">Date Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cbtHistory.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-2.5 px-4 font-semibold text-gray-800">{item.course}</td>
                          <td className="py-2.5 px-4 font-bold text-purple-brand">{item.score}</td>
                          <td className="py-2.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${item.percentage >= 50 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {item.percentage}%
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-gray-600">{item.timeSpent}</td>
                          <td className="py-2.5 px-4 text-gray-500">{item.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400 text-sm">
                  No CBT attempts logged. Jump in to get your first practice score!
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: CBT EXAM INTERFACE SCREEN */}
        {viewState === 'exam' && (
          <div className="flex flex-col gap-4">
            
            {/* Purple Header Panel */}
            <div className="bg-purple-brand text-white p-4 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4 border-b-4 border-purple-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center font-bold text-lg border border-white">
                  {user?.fullName?.charAt(0) || 'S'}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black tracking-wide leading-tight">{user?.fullName?.toUpperCase() || 'STUDENT USER'}</h2>
                  <span className="text-xs text-purple-200 font-bold font-mono">Reg No: {matricNo}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center bg-black bg-opacity-35 px-4 py-1.5 rounded border border-gray-600">
                  <span className="block text-[10px] text-gray-400 font-bold uppercase">Course Code</span>
                  <span className="text-sm font-extrabold text-purple-100">{selectedCourse === 'tech-news' ? 'TECH 101' : selectedCourse}</span>
                </div>

                <div className="text-center bg-black bg-opacity-25 border border-white/20 px-5 py-1.5 rounded">
                  <span className="block text-[10px] text-purple-200 font-bold uppercase">Time Remaining</span>
                  <span className="text-xl font-mono font-black text-white tracking-wider">
                    {formatTimer(timeLeft)}
                  </span>
                </div>
              </div>
            </div>

            {/* Split layout: Question Panel + Question Number Selector */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Question numbers grid (FUTA style) */}
              <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
                <h3 className="text-sm font-black text-gray-800 border-b pb-2 mb-4 uppercase tracking-wider">Question Grid</h3>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, idx) => {
                    const isAnswered = answers[q.id] !== undefined
                    const isActive = idx === currentQuestionIdx
                    
                    let btnStyle = 'bg-white border-gray-300 text-gray-800'
                    if (isAnswered) {
                      btnStyle = 'bg-green-600 border-green-600 text-white hover:bg-green-700'
                    }
                    if (isActive) {
                      btnStyle = 'bg-purple-brand border-purple-800 text-white font-extrabold ring-2 ring-purple-400 ring-offset-1'
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIdx(idx)}
                        className={`py-2 text-xs font-semibold rounded border text-center transition-all ${btnStyle}`}
                      >
                        {idx + 1}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Central question layout */}
              <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between min-h-[400px]">
                
                {/* Question Area */}
                <div>
                  <div className="flex justify-between border-b pb-3 mb-6 items-center">
                    <span className="text-sm font-extrabold text-purple-brand uppercase tracking-wider">
                      Question {currentQuestionIdx + 1} of {questions.length}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">Single Selection (1 Mark)</span>
                  </div>

                  <p className="text-lg font-bold text-gray-900 leading-relaxed mb-6 font-sans">
                    {questions[currentQuestionIdx]?.question}
                  </p>

                  {/* Options List */}
                  <div className="space-y-3">
                    {questions[currentQuestionIdx]?.options.map((opt, optIdx) => {
                      const isSelected = answers[questions[currentQuestionIdx].id] === optIdx
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleOptionSelect(optIdx)}
                          className={`w-full flex items-center gap-3 p-4 border rounded-xl text-left text-sm transition-all ${isSelected ? 'border-purple-brand bg-purple-50/50 font-semibold shadow-sm text-purple-950' : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-purple-brand bg-purple-brand' : 'border-gray-300'}`}>
                            {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <span className="text-gray-800">
                            <span className="font-bold mr-1">{String.fromCharCode(65 + optIdx)}.</span> {opt}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between gap-4">
                  <button
                    onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIdx === 0}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Previous
                  </button>

                  <button
                    onClick={() => setShowSubmitConfirm(true)}
                    className="px-5 py-2 bg-red-600 text-white font-extrabold text-sm tracking-wider rounded-lg hover:bg-red-700 transition-colors uppercase shadow-sm"
                  >
                    Submit Exam
                  </button>

                  <button
                    onClick={() => setCurrentQuestionIdx(prev => Math.min(questions.length - 1, prev + 1))}
                    disabled={currentQuestionIdx === questions.length - 1}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Confirmation Dialog */}
            {showSubmitConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowSubmitConfirm(false)} />
                <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-6 z-10 text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Submit Examination?</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    You have answered {Object.keys(answers).length} of {questions.length} questions. Are you sure you want to finish the exam?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowSubmitConfirm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Keep Writing
                    </button>
                    <button
                      onClick={() => handleExamSubmit(false)}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      Yes, Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: CBT RESULTS & CORRECTIONS PAGE */}
        {viewState === 'result' && (
          <div className="space-y-6">
            
            {/* Scorecard Widget */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900 font-sans">Exam Performance Summary</h2>
                <p className="text-sm text-gray-500 mt-1">Simulated test records synced to log. See corrections and tutoring explanation keys below.</p>
                <div className="flex flex-wrap gap-4 mt-4 text-xs font-semibold text-gray-600">
                  <div className="bg-gray-100 px-3 py-1.5 rounded">TIME SPENT: {elapsedTimeStr}</div>
                  <div className="bg-gray-100 px-3 py-1.5 rounded">QUESTIONS: {questions.length}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center bg-purple-50 border border-purple-100 rounded-xl px-6 py-4 shadow-sm">
                  <span className="block text-[10px] font-bold text-purple-brand uppercase">Final Score</span>
                  <span className="text-3xl font-black text-purple-brand">{score} / {questions.length}</span>
                </div>
                <div className="text-center bg-green-50 border border-green-100 rounded-xl px-6 py-4 shadow-sm">
                  <span className="block text-[10px] font-bold text-green-500 uppercase">Percentage</span>
                  <span className="text-3xl font-black text-green-950">{percentage}%</span>
                </div>
              </div>
            </div>

            {/* Corrections Dashboard */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-6">Review & Corrections</h2>
              
              <div className="space-y-6">
                {questions.map((q, idx) => {
                  const selectedOpt = answers[q.id]
                  const isCorrect = selectedOpt === q.correctAnswer
                  
                  return (
                    <div key={q.id} className="p-5 border border-gray-200 rounded-2xl bg-white space-y-4">
                      {/* Correction Question Header */}
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-xs font-extrabold text-gray-500 uppercase">Question {idx + 1}</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded text-xs font-bold ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                          <button
                            onClick={() => handleAskBuddyAboutQuestion(q, selectedOpt)}
                            className="flex items-center gap-1.5 px-3 py-1 border border-purple-200 text-purple-brand text-xs font-bold rounded-lg bg-purple-50/50 hover:bg-purple-100 transition-colors"
                          >
                            Ask StudyBuddy
                          </button>
                        </div>
                      </div>

                      {/* Question Text */}
                      <p className="font-bold text-gray-800 leading-relaxed font-sans">{q.question}</p>

                      {/* Options with correctness styles */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {q.options.map((opt, optIdx) => {
                          const isCurSelected = selectedOpt === optIdx
                          const isCorrectOpt = q.correctAnswer === optIdx
                          
                          let cardBorder = 'border-gray-200'
                          let cardBg = 'bg-white'
                          let textStyle = 'text-gray-700'

                          if (isCorrectOpt) {
                            cardBorder = 'border-green-500'
                            cardBg = 'bg-green-50/50'
                            textStyle = 'text-green-900 font-semibold'
                          } else if (isCurSelected && !isCorrectOpt) {
                            cardBorder = 'border-red-500'
                            cardBg = 'bg-red-50/50'
                            textStyle = 'text-red-900 font-semibold'
                          }

                          return (
                            <div key={optIdx} className={`p-3 border rounded-xl text-xs flex items-center gap-2.5 ${cardBorder} ${cardBg}`}>
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center font-extrabold text-[10px] ${isCorrectOpt ? 'bg-green-500 text-white' : (isCurSelected ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500')}`}>
                                {String.fromCharCode(65 + optIdx)}
                              </div>
                              <span className={textStyle}>{opt}</span>
                            </div>
                          )
                        })}
                      </div>

                      {/* Explanation box */}
                      {q.explanation && (
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed">
                          <div>
                            <span className="font-bold text-gray-700 block mb-0.5">Solution / Derivation Key:</span>
                            {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Bottom control */}
              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <button
                  onClick={() => setViewState('setup')}
                  className="px-6 py-2.5 btn-purple text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-sm"
                >
                  Return to CBT Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <GuestRestrictionModal
        isOpen={isRestrictModalOpen}
        onClose={() => setIsRestrictModalOpen(false)}
        actionName={restrictAction}
      />

      <AskStudyBuddy
        isOpen={isAiOpen}
        onClose={() => {
          setIsAiOpen(false)
          setAiInitialQuery('')
        }}
        initialQuery={aiInitialQuery}
      />
    </Layout>
  )
}

export default Quizzes
