import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const HigherLevelPrep = ({ courseTitle = 'Advanced Course', courseLevel = '300' }) => {
  const [activeMode, setActiveMode] = useState('blueprints') // 'blueprints', 'flashcards', 'practice'
  
  // Flashcard States
  const [flashcards, setFlashcards] = useState([])
  const [currentCardIdx, setCurrentCardIdx] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [cardStats, setCardStats] = useState({ mastered: 0, reviewing: 0 })

  // Practice States
  const [timerSeconds, setTimerSeconds] = useState(600) // 10 minutes default
  const [timerActive, setTimerActive] = useState(false)
  const [showChecklist, setShowChecklist] = useState(false)
  const [checkedPoints, setCheckedPoints] = useState({})
  
  const mockBlueprints = [
    {
      id: 1,
      question: "Prove and derive the 1-Dimensional Wave Equation under boundary conditions y(0,t) = y(L,t) = 0. [10 Marks]",
      rubric: [
        { points: 2, label: "Draw displacement diagram showing string segment element, tension forces (T1, T2) and angles (θ1, θ2)." },
        { points: 3, label: "Apply Newton's Second Law (F = ma) in the vertical direction, stating T2sin(θ2) - T1sin(θ1) = ρ.dx.(d²y/dt²)." },
        { points: 3, label: "Use small-angle approximation tan(θ) ≈ sin(θ) = dy/dx to derive the wave relation: d²y/dt² = (T/ρ) * d²y/dx²." },
        { points: 2, label: "Specify tension wave velocity c = √(T/ρ) and write final partial differential form: d²y/dt² = c² * d²y/dx²." }
      ]
    },
    {
      id: 2,
      question: "Explain the four necessary conditions for a Deadlock occurrence in Operating Systems. [8 Marks]",
      rubric: [
        { points: 2, label: "Define Mutual Exclusion: at least one resource must be held in a non-shareable mode (only one process can use it at a time)." },
        { points: 2, label: "Define Hold and Wait: a process must be holding at least one resource and waiting to acquire additional resources held by others." },
        { points: 2, label: "Define No Preemption: resources cannot be preempted; they can only be released voluntarily by the holding process." },
        { points: 2, label: "Define Circular Wait: a closed chain of processes exists such that each process holds resources needed by the next process." }
      ]
    }
  ]

  const mockFlashcardsData = [
    {
      id: 1,
      front: "What is Cauchy's Integral Formula in Complex Analysis?",
      back: "If f(z) is analytic inside and on a simple closed contour C, and 'a' is any point inside C, then:\n\nf(a) = (1 / 2πi) * ∮_C [f(z) / (z - a)] dz"
    },
    {
      id: 2,
      front: "Explain the ACID properties of a Transaction in DBMS.",
      back: "• Atomicity: All operations succeed or all roll back.\n• Consistency: Database transitions from one valid state to another.\n• Isolation: Concurrent transactions do not interfere with each other.\n• Durability: Completed transactions persist even in system crashes."
    },
    {
      id: 3,
      front: "State Maxwell's Faraday's Law of Electromagnetic Induction in differential form.",
      back: "∇ × E = -∂B / ∂t\n\nThe curl of the electric field intensity equals the negative time rate of change of the magnetic flux density."
    },
    {
      id: 4,
      front: "What is the Nyquist Shannon Sampling Theorem?",
      back: "To avoid aliasing and reconstruct a continuous signal perfectly, the sampling frequency (f_s) must be greater than twice the maximum frequency component (f_max) of the signal:\n\nf_s > 2 * f_max"
    }
  ]

  useEffect(() => {
    setFlashcards(mockFlashcardsData)
  }, [])

  // Timer Effect
  useEffect(() => {
    let timer = null
    if (timerActive && timerSeconds > 0) {
      timer = setInterval(() => {
        setTimerSeconds(prev => prev - 1)
      }, 1000)
    } else if (timerActive && timerSeconds === 0) {
      setTimerActive(false)
      toast.error("Practice time has expired! Self-assess your answers now.")
      setShowChecklist(true)
    }
    return () => clearInterval(timer)
  }, [timerActive, timerSeconds])

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped)
  }

  const handleCardRate = (type) => {
    if (flashcards.length === 0) return

    if (type === 'mastered') {
      setCardStats(prev => ({ ...prev, mastered: prev.mastered + 1 }))
      toast.success("Card marked as mastered!")
    } else {
      setCardStats(prev => ({ ...prev, reviewing: prev.reviewing + 1 }))
      toast.error("Saved to review pile")
    }

    setIsFlipped(false)
    // Advance card using functional state updater
    setCurrentCardIdx(prev => (flashcards.length > 0 ? (prev + 1) % flashcards.length : 0))
  }

  const handleToggleChecklistPoint = (index) => {
    setCheckedPoints({
      ...checkedPoints,
      [index]: !checkedPoints[index]
    })
  }

  const getSelfGradeScore = (rubric) => {
    let earned = 0
    rubric.forEach((item, idx) => {
      if (checkedPoints[idx]) {
        earned += item.points
      }
    })
    return earned
  }

  const getTotalRubricPoints = (rubric) => {
    return rubric.reduce((sum, item) => sum + item.points, 0)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
      <div className="p-6">
        {/* Title & Description */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {courseLevel}L Theory Written Exam Prep Suite
          </h3>
          <p className="text-sm text-gray-500 mt-1">Written-response blueprints, formulas active recall, and mock theory simulations.</p>
        </div>

        {/* Tab Controls */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            {['blueprints', 'flashcards', 'practice'].map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setActiveMode(mode)
                  setIsFlipped(false)
                }}
                className={`
                  px-4 py-2 font-medium border-b-2 text-sm uppercase transition-colors
                  ${activeMode === mode
                    ? 'border-purple-brand text-purple-brand font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        {/* MODE 1: GRADING BLUEPRINTS */}
        {activeMode === 'blueprints' && (
          <div className="space-y-6">
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 text-xs text-purple-950 rounded-r-lg">
              <span className="font-bold">FUTA Written Exam Strategy:</span> Lecturers grade written theories by checking for specific diagrams, equations, and definitions. Study these blueprints to structure your answers for full marks.
            </div>

            <div className="space-y-4">
              {mockBlueprints.map((item) => (
                <div key={item.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                  <h4 className="font-bold text-gray-800 text-xs leading-normal">
                    Q: {item.question}
                  </h4>
                  <div className="mt-3 space-y-2 border-t border-gray-200/60 pt-3">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Lecturer Grading Scheme (Marks Allocation)</span>
                    {item.rubric.map((rubricItem, idx) => (
                      <div key={idx} className="flex gap-2 text-xs text-gray-600 items-start">
                        <span className="bg-green-100 border border-green-300 text-green-800 px-2 py-0.5 rounded font-black text-[10px] flex-shrink-0">
                          +{rubricItem.points} M
                        </span>
                        <p>{rubricItem.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODE 2: ACTIVE RECALL FLASHCARDS */}
        {activeMode === 'flashcards' && flashcards.length > 0 && (
          <div className="max-w-md mx-auto flex flex-col items-center gap-6">
            {/* Card Counter & Stats */}
            <div className="flex justify-between w-full text-xs text-gray-500 font-bold border-b pb-2">
              <span>Card {currentCardIdx + 1} of {flashcards.length}</span>
              <div className="flex gap-3">
                <span className="text-green-600">Mastered: {cardStats.mastered}</span>
                <span className="text-red-500">Reviewing: {cardStats.reviewing}</span>
              </div>
            </div>

            {/* Flashcard Body */}
            <div 
              onClick={handleFlipCard}
              className={`w-full aspect-[7/4] border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-center text-center cursor-pointer transition-all duration-300 bg-white relative overflow-hidden select-none hover:shadow-md ${isFlipped ? 'border-purple-300 ring-1 ring-purple-100' : ''}`}
            >
              <div className="absolute top-2 right-3 text-[10px] font-bold text-gray-400 uppercase">
                {isFlipped ? 'Answer (Click to flip back)' : 'Question (Click to flip)'}
              </div>

              {!isFlipped ? (
                <p className="font-extrabold text-gray-800 text-sm leading-relaxed">
                  {flashcards[currentCardIdx]?.front}
                </p>
              ) : (
                <div className="text-left w-full h-full overflow-y-auto pt-2">
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed font-mono">
                    {flashcards[currentCardIdx]?.back}
                  </p>
                </div>
              )}
            </div>

            {/* Flip hint */}
            <p className="text-[10px] text-gray-400 font-medium">Tip: Flip the card to check your active recall before self-rating.</p>

            {/* Controls */}
            {isFlipped && (
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => handleCardRate('review')}
                  className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold transition-colors"
                >
                  Still Reviewing (Hard)
                </button>
                <button
                  onClick={() => handleCardRate('mastered')}
                  className="flex-1 py-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs font-semibold transition-colors"
                >
                  Got It! (Mastered)
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODE 3: MOCK THEORY PRACTICE TIMER */}
        {activeMode === 'practice' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Theory Practice Simulator</h4>
                <p className="text-xs text-gray-500 mt-0.5">Attempt the question on paper, set the timer, and review the scoring criteria.</p>
              </div>

              {/* Timer UI */}
              <div className="flex items-center gap-3">
                <span className="text-2xl font-mono font-bold text-gray-700 bg-gray-100 border px-3 py-1 rounded-lg">
                  {formatTimer(timerSeconds)}
                </span>
                <button
                  onClick={() => setTimerActive(!timerActive)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-colors ${timerActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {timerActive ? 'Pause' : 'Start Timer'}
                </button>
                <button
                  onClick={() => {
                    setTimerActive(false)
                    setTimerSeconds(600)
                    setShowChecklist(false)
                    setCheckedPoints({})
                  }}
                  className="px-2 py-1.5 border rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Question to attempt */}
            <div className="p-5 border border-purple-100 rounded-xl bg-purple-50/20">
              <span className="text-[10px] font-extrabold text-purple-700 uppercase block tracking-wider mb-2">Practice Task</span>
              <p className="font-bold text-gray-800 text-sm leading-normal">
                {mockBlueprints[0].question}
              </p>
            </div>

            <div className="text-center py-2">
              <button
                onClick={() => {
                  setTimerActive(false)
                  setShowChecklist(true)
                }}
                className="px-5 py-2 border border-purple-200 text-purple-brand rounded-lg bg-purple-50 hover:bg-purple-100 text-xs font-bold transition-all"
              >
                Reveal Grading Checklist & Stop Timer
              </button>
            </div>

            {/* Self Grading checklist */}
            {showChecklist && (
              <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4 animate-in fade-in duration-300">
                <div className="flex justify-between border-b pb-3 mb-2 items-center flex-wrap gap-3">
                  <div>
                    <h5 className="font-extrabold text-gray-900 text-xs uppercase">Self-Assess Grading Checklist</h5>
                    <p className="text-[10px] text-gray-500">Check off each item you successfully drew or calculated on your paper.</p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 px-4 py-1.5 rounded-lg text-center">
                    <span className="block text-[9px] font-bold text-purple-500 uppercase">Self-Grade Score</span>
                    <span className="text-base font-extrabold text-purple-brand">
                      {getSelfGradeScore(mockBlueprints[0].rubric)} / {getTotalRubricPoints(mockBlueprints[0].rubric)} Marks
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {mockBlueprints[0].rubric.map((point, idx) => (
                    <label
                      key={idx}
                      className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors text-xs ${checkedPoints[idx] ? 'border-green-300 bg-green-50/20' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      <input
                        type="checkbox"
                        checked={checkedPoints[idx] || false}
                        onChange={() => handleToggleChecklistPoint(idx)}
                        className="mt-0.5 rounded text-green-600 focus:ring-green-500 h-4 w-4"
                      />
                      <div className="flex-1">
                        <span className="font-extrabold text-green-700 mr-2">+{point.points} Marks:</span>
                        <span className="text-gray-700 font-medium leading-relaxed">{point.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default HigherLevelPrep
