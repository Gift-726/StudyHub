import { useState, useRef, useEffect } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import GuestRestrictionModal from '../components/GuestRestrictionModal'
import toast from 'react-hot-toast'

const CGPACalculator = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('calculator') // 'calculator', 'tracker', 'what-if'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalAction, setModalAction] = useState('')

  // 1. Calculator States
  const [calcCourses, setCalcCourses] = useState([
    { id: 1, name: '', credit: '', grade: '' }
  ])
  const [calculatedGPA, setCalculatedGPA] = useState(null)
  const courseRefs = useRef({})
  const calcResultRef = useRef(null)
  const lastAddedCourseId = useRef(null)

  // 2. Tracker States
  const [trackerSemesters, setTrackerSemesters] = useState([])
  const [newSem, setNewSem] = useState({ name: '', gpa: '', credit: '' })

  // 3. What-If Simulator States
  const [whatIfInput, setWhatIfInput] = useState({
    currentCgpa: '',
    creditsCompleted: '',
    targetCgpa: '',
    remainingCredits: ''
  })
  const [whatIfResult, setWhatIfResult] = useState(null)

  const gradePoints = {
    'A': 5.0,
    'B': 4.0,
    'C': 3.0,
    'D': 2.0,
    'E': 1.0,
    'F': 0.0
  }

  // Load tracker semesters from localStorage based on user status
  useEffect(() => {
    const key = user?.email ? `studyhub_cgpa_tracker_${user.email}` : 'studyhub_cgpa_tracker_guest'
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setTrackerSemesters(parsed)
        } else {
          setTrackerSemesters([])
        }
      } catch (err) {
        console.error('Error parsing studyhub_cgpa_tracker data:', err)
        setTrackerSemesters([])
      }
    } else {
      setTrackerSemesters([])
    }
  }, [user])

  const saveSemestersToLocalStorage = (records) => {
    const key = user?.email ? `studyhub_cgpa_tracker_${user.email}` : 'studyhub_cgpa_tracker_guest'
    localStorage.setItem(key, JSON.stringify(records))
    setTrackerSemesters(records)
  }

  // -------------------------------------------------------------
  // CALCULATOR LOGIC
  // -------------------------------------------------------------
  const handleAddCourse = () => {
    const newId = Date.now()
    lastAddedCourseId.current = newId
    setCalcCourses([...calcCourses, { id: newId, name: '', credit: '', grade: '' }])
  }

  // Scroll to newly added course
  useEffect(() => {
    if (lastAddedCourseId.current && courseRefs.current[lastAddedCourseId.current]) {
      setTimeout(() => {
        courseRefs.current[lastAddedCourseId.current]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
        const firstInput = courseRefs.current[lastAddedCourseId.current]?.querySelector('input')
        if (firstInput) {
          firstInput.focus()
        }
      }, 100)
      lastAddedCourseId.current = null
    }
  }, [calcCourses])

  const handleRemoveCourse = (id) => {
    if (calcCourses.length > 1) {
      setCalcCourses(calcCourses.filter(course => course.id !== id))
    }
  }

  const handleCourseChange = (id, field, value) => {
    setCalcCourses(calcCourses.map(course =>
      course.id === id ? { ...course, [field]: value } : course
    ))
  }

  const handleCalculateGPA = () => {
    let totalPoints = 0
    let totalCredits = 0
    const invalidCourses = []

    calcCourses.forEach((course, idx) => {
      const name = (course.name || '').trim()
      const creditStr = (course.credit || '').toString().trim()
      const grade = (course.grade || '').trim()

      const hasName = name !== ''
      const hasCredit = creditStr !== '' && !isNaN(parseFloat(creditStr))
      const hasGrade = grade !== ''

      // A course is populated if at least one field is filled
      if (hasName || hasCredit || hasGrade) {
        const credit = parseFloat(creditStr) || 0
        const points = gradePoints[grade.toUpperCase()]

        if (credit <= 0 || isNaN(credit) || points === undefined) {
          const courseDisplayName = name || `Course #${idx + 1}`
          invalidCourses.push(courseDisplayName)
        } else {
          totalPoints += credit * points
          totalCredits += credit
        }
      }
    })

    if (invalidCourses.length > 0) {
      toast.error(`The following course rows are incomplete or invalid: ${invalidCourses.join(', ')}. Please select a valid grade and credit units > 0.`)
      return
    }

    if (totalCredits > 0) {
      const gpa = (totalPoints / totalCredits).toFixed(2)
      setCalculatedGPA(gpa)
      setTimeout(() => {
        calcResultRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }, 100)
    } else {
      setCalculatedGPA(null)
      toast.error('Please enter valid credit units and grades')
    }
  }

  // -------------------------------------------------------------
  // TRACKER LOGIC
  // -------------------------------------------------------------
  const handleAddSemesterRecord = (e) => {
    e.preventDefault()
    if (user?.isGuest) {
      setModalAction('save semester records to your tracker history')
      setIsModalOpen(true)
      return
    }

    const gpaVal = parseFloat(newSem.gpa)
    const creditVal = parseFloat(newSem.credit)

    if (!newSem.name) {
      toast.error('Please enter a semester name')
      return
    }
    if (isNaN(gpaVal) || gpaVal < 0 || gpaVal > 5) {
      toast.error('Please enter a valid GPA between 0.00 and 5.00')
      return
    }
    if (isNaN(creditVal) || creditVal <= 0) {
      toast.error('Please enter valid credit units')
      return
    }

    const record = {
      id: Date.now(),
      name: newSem.name,
      gpa: gpaVal.toFixed(2),
      credit: creditVal
    }

    const updated = [...trackerSemesters, record]
    saveSemestersToLocalStorage(updated)
    setNewSem({ name: '', gpa: '', credit: '' })
    toast.success('Semester record added!')
  }

  const handleRemoveSemesterRecord = (id) => {
    if (user?.isGuest) {
      setModalAction('manage semester records')
      setIsModalOpen(true)
      return
    }
    const updated = trackerSemesters.filter(sem => sem.id !== id)
    saveSemestersToLocalStorage(updated)
    toast.success('Record removed')
  }

  // Calculate Cumulative CGPA from history
  const getCumulativeCGPA = () => {
    let totalPoints = 0
    let totalCredits = 0
    trackerSemesters.forEach(sem => {
      totalPoints += parseFloat(sem.gpa) * sem.credit
      totalCredits += sem.credit
    })
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00'
  }

  const getDegreeClass = (cgpaStr) => {
    const cgpa = parseFloat(cgpaStr)
    if (cgpa >= 4.50) return { label: 'First Class Honours', color: 'text-green-600 border-green-200 bg-green-50' }
    if (cgpa >= 3.50) return { label: 'Second Class Upper (2:1)', color: 'text-blue-600 border-blue-200 bg-blue-50' }
    if (cgpa >= 2.40) return { label: 'Second Class Lower (2:2)', color: 'text-yellow-600 border-yellow-200 bg-yellow-50' }
    if (cgpa >= 1.50) return { label: 'Third Class', color: 'text-orange-600 border-orange-200 bg-orange-50' }
    return { label: 'Pass / Fail State', color: 'text-red-600 border-red-200 bg-red-50' }
  }

  // -------------------------------------------------------------
  // WHAT-IF SIMULATOR LOGIC
  // -------------------------------------------------------------
  const handleWhatIfSimulate = (e) => {
    e.preventDefault()
    const currentCgpa = parseFloat(whatIfInput.currentCgpa)
    const completedCredits = parseFloat(whatIfInput.creditsCompleted)
    const targetCgpa = parseFloat(whatIfInput.targetCgpa)
    const remainingCredits = parseFloat(whatIfInput.remainingCredits)

    if (isNaN(currentCgpa) || currentCgpa < 0 || currentCgpa > 5) {
      toast.error('Enter a valid current CGPA (0.00 - 5.00)')
      return
    }
    if (isNaN(completedCredits) || completedCredits < 0) {
      toast.error('Enter valid completed credit units')
      return
    }
    if (isNaN(targetCgpa) || targetCgpa < 0 || targetCgpa > 5) {
      toast.error('Enter a valid target graduation CGPA')
      return
    }
    if (isNaN(remainingCredits) || remainingCredits <= 0) {
      toast.error('Enter valid remaining credit units')
      return
    }

    const totalCredits = completedCredits + remainingCredits
    const currentPoints = currentCgpa * completedCredits
    const targetPoints = targetCgpa * totalCredits
    const requiredPoints = targetPoints - currentPoints
    const requiredGpa = requiredPoints / remainingCredits

    let possible = true
    let message = ''
    let detail = ''

    if (requiredGpa > 5.0) {
      possible = false
      message = 'Mathematically Unachievable'
      detail = `To graduate with a ${targetCgpa.toFixed(2)} CGPA, you would need an average GPA of ${requiredGpa.toFixed(2)} in your remaining ${remainingCredits} units. Since the maximum possible GPA is 5.00, this is mathematically impossible.`
    } else if (requiredGpa < 0) {
      possible = true
      message = 'Target Already Guaranteed!'
      detail = `Your target CGPA of ${targetCgpa.toFixed(2)} is already secured! Even if you score an average GPA of 0.00 in your remaining ${remainingCredits} units, your final CGPA will still be higher than your target.`
    } else {
      possible = true
      message = 'Achievable!'
      detail = `You need to average a GPA of ${requiredGpa.toFixed(2)} across your remaining ${remainingCredits} credit units to hit your target graduation CGPA of ${targetCgpa.toFixed(2)}.`
    }

    // Determine recommendations
    let recommendation = ''
    if (possible && requiredGpa > 0) {
      if (requiredGpa >= 4.5) {
        recommendation = 'This requires near-perfect performance. You will need mostly A grades in your remaining courses. Focus heavily on active recall and exam past questions.'
      } else if (requiredGpa >= 3.5) {
        recommendation = 'This requires very strong performance. You should aim for a mix of A and B grades. Ensure you keep your study hours consistent!'
      } else if (requiredGpa >= 2.4) {
        recommendation = 'This is highly achievable. Aiming for mostly C and B grades will secure your target.'
      } else {
        recommendation = 'This requires maintaining passing grades. Focus on staying balanced and completing your assignments.'
      }
    }

    setWhatIfResult({
      requiredGpa: requiredGpa.toFixed(2),
      possible,
      message,
      detail,
      recommendation,
      totalCredits
    })
  }

  const handleAutoFillCurrentCgpa = () => {
    if (trackerSemesters.length === 0) {
      toast.error('No tracked semester records to autofill from!')
      return
    }
    const computedCgpa = getCumulativeCGPA()
    let computedCredits = 0
    trackerSemesters.forEach(sem => computedCredits += sem.credit)

    setWhatIfInput({
      ...whatIfInput,
      currentCgpa: computedCgpa,
      creditsCompleted: computedCredits.toString()
    })
    toast.success('Autofilled from your Tracker History!')
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">CGPA Dashboard</h1>
          <p className="text-gray-500 mt-1">Calculate GPAs, log semester progress, and run what-if simulations to achieve your targets.</p>
        </div>

        {/* Tab Controls */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2 font-medium border-b-2 text-sm transition-all ${activeTab === 'calculator' ? 'border-purple-brand text-purple-brand font-semibold' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              GPA Calculator
            </button>
            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-4 py-2 font-medium border-b-2 text-sm transition-all ${activeTab === 'tracker' ? 'border-purple-brand text-purple-brand font-semibold' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              Semester Tracker
            </button>
            <button
              onClick={() => setActiveTab('what-if')}
              className={`px-4 py-2 font-medium border-b-2 text-sm transition-all ${activeTab === 'what-if' ? 'border-purple-brand text-purple-brand font-semibold' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              What-If Simulator
            </button>
          </div>
        </div>

        {/* TAB 1: GPA CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Calculate Semester GPA</h2>

            {/* Courses list */}
            <div className="space-y-4">
              {/* Desktop Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-2 border-b border-gray-100 text-sm font-semibold text-gray-600">
                <div className="col-span-6">Course Name / Code</div>
                <div className="col-span-3">Credit Units</div>
                <div className="col-span-2">Grade</div>
                <div className="col-span-1 text-center">Delete</div>
              </div>

              {calcCourses.map((course, index) => (
                <div
                  key={course.id}
                  ref={(el) => (courseRefs.current[course.id] = el)}
                  className="p-4 border border-gray-200 rounded-xl md:border-none md:p-0 md:rounded-none grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative"
                >
                  {/* Mobile Header indicator */}
                  <div className="md:hidden flex justify-between items-center mb-1 pb-2 border-b border-gray-100">
                    <span className="font-semibold text-purple-brand text-sm">Course #{index + 1}</span>
                    {calcCourses.length > 1 && (
                      <button
                        onClick={() => handleRemoveCourse(course.id)}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                        title="Remove Course"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Course Name */}
                  <div className="col-span-6">
                    <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Course Name</label>
                    <input
                      type="text"
                      value={course.name}
                      onChange={(e) => handleCourseChange(course.id, 'name', e.target.value)}
                      placeholder="e.g. MTH 101"
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                  </div>

                  {/* Credit Units */}
                  <div className="col-span-3 grid grid-cols-2 gap-4 md:block">
                    <div>
                      <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Credit Units</label>
                      <input
                        type="number"
                        value={course.credit}
                        onChange={(e) => handleCourseChange(course.id, 'credit', e.target.value)}
                        placeholder="e.g. 3"
                        min="1"
                        className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>

                    {/* Grade - visible for mobile inside the split row */}
                    <div className="md:hidden">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Grade</label>
                      <select
                        value={course.grade}
                        onChange={(e) => handleCourseChange(course.id, 'grade', e.target.value)}
                        className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
                      >
                        <option value="">Grade</option>
                        {Object.keys(gradePoints).map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Grade - visible for desktop */}
                  <div className="hidden md:block col-span-2">
                    <select
                      value={course.grade}
                      onChange={(e) => handleCourseChange(course.id, 'grade', e.target.value)}
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
                    >
                      <option value="">Select</option>
                      {Object.keys(gradePoints).map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  {/* Desktop Delete button */}
                  <div className="hidden md:flex justify-center col-span-1">
                    {calcCourses.length > 1 && (
                      <button
                        onClick={() => handleRemoveCourse(course.id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Course"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-4 border-t border-gray-100 pt-6">
              <button
                onClick={handleAddCourse}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
              >
                <span>+</span> Add Course
              </button>
              <button
                onClick={handleCalculateGPA}
                className="px-5 py-2 btn-purple text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold ml-auto"
              >
                Calculate GPA
              </button>
            </div>

            {/* GPA Result box */}
            {calculatedGPA !== null && (
              <div
                ref={calcResultRef}
                className="mt-6 p-6 bg-purple-50 rounded-xl border border-purple-200 flex flex-col md:flex-row items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-purple-brand">Semester GPA Result</h3>
                  <p className="text-sm text-gray-600 mt-1">Great job finishing up calculations! You can save this to your tracker history in the next tab.</p>
                </div>
                <div className="bg-white border border-purple-200 px-8 py-4 rounded-xl text-center shadow-sm">
                  <span className="text-4xl font-extrabold text-purple-brand">{calculatedGPA}</span>
                  <span className="block text-xs font-semibold text-gray-500 mt-1">OUT OF 5.00</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SEMESTER TRACKER */}
        {activeTab === 'tracker' && (
          <div className="space-y-6">
            {/* Split layout: Add Form + Summary widget */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Add form */}
              <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-100 h-fit">
                <h2 className="text-xl font-bold text-gray-900 mb-4 font-sans">Add Semester Record</h2>
                <form onSubmit={handleAddSemesterRecord} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester Name</label>
                    <input
                      type="text"
                      value={newSem.name}
                      onChange={(e) => setNewSem({ ...newSem, name: e.target.value })}
                      placeholder="e.g. 100L First Semester"
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GPA Earned</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="5"
                        value={newSem.gpa}
                        onChange={(e) => setNewSem({ ...newSem, gpa: e.target.value })}
                        placeholder="e.g. 4.25"
                        className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Credit Units</label>
                      <input
                        type="number"
                        value={newSem.credit}
                        onChange={(e) => setNewSem({ ...newSem, credit: e.target.value })}
                        placeholder="e.g. 21"
                        min="1"
                        className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 btn-purple text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
                  >
                    Save Semester to Tracker
                  </button>
                </form>
              </div>

              {/* CGPA Summary Dashboard */}
              <div className="md:col-span-1 bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Tracker Summary</h2>
                  <div className="text-center py-4 bg-purple-50 rounded-xl border border-purple-100 shadow-inner mb-4">
                    <span className="block text-xs font-bold text-purple-500 uppercase tracking-wider">Cumulative CGPA</span>
                    <span className="text-5xl font-extrabold text-purple-brand tracking-tight">{getCumulativeCGPA()}</span>
                    <span className="block text-xs font-semibold text-gray-500 mt-1">
                      {trackerSemesters.length} Semesters Logged
                    </span>
                  </div>
                </div>

                {trackerSemesters.length > 0 && (
                  <div className={`p-4 rounded-xl border border-dashed text-center ${getDegreeClass(getCumulativeCGPA()).color}`}>
                    <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Class of Degree</span>
                    <span className="font-extrabold text-base">{getDegreeClass(getCumulativeCGPA()).label}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Semesters History Table */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Logged Academic History</h2>
              {trackerSemesters.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                        <th className="py-3 px-4">Semester</th>
                        <th className="py-3 px-4">GPA</th>
                        <th className="py-3 px-4">Credit Units</th>
                        <th className="py-3 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trackerSemesters.map((sem) => (
                        <tr key={sem.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-gray-800">{sem.name}</td>
                          <td className="py-3 px-4 text-purple-brand font-bold">{sem.gpa}</td>
                          <td className="py-3 px-4 text-gray-600">{sem.credit} units</td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleRemoveSemesterRecord(sem.id)}
                              className="text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors font-medium text-xs"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-sm">No semesters tracked yet.</p>
                  <p className="text-xs mt-1">Add your GPAs above to see your CGPA progression and degree class.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: WHAT-IF SIMULATOR */}
        {activeTab === 'what-if' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Graduation Target Pathway</h2>
                {trackerSemesters.length > 0 && (
                  <button
                    onClick={handleAutoFillCurrentCgpa}
                    className="text-xs font-semibold text-purple-brand hover:underline flex items-center gap-1 border border-purple-200 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    Autofill from History
                  </button>
                )}
              </div>

              <form onSubmit={handleWhatIfSimulate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="5"
                    value={whatIfInput.currentCgpa}
                    onChange={(e) => setWhatIfInput({ ...whatIfInput, currentCgpa: e.target.value })}
                    placeholder="e.g. 3.42"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credit Units Completed</label>
                  <input
                    type="number"
                    value={whatIfInput.creditsCompleted}
                    onChange={(e) => setWhatIfInput({ ...whatIfInput, creditsCompleted: e.target.value })}
                    placeholder="e.g. 64"
                    min="0"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Graduation CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="5"
                    value={whatIfInput.targetCgpa}
                    onChange={(e) => setWhatIfInput({ ...whatIfInput, targetCgpa: e.target.value })}
                    placeholder="e.g. 4.50"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remaining Credit Units</label>
                  <input
                    type="number"
                    value={whatIfInput.remainingCredits}
                    onChange={(e) => setWhatIfInput({ ...whatIfInput, remainingCredits: e.target.value })}
                    placeholder="e.g. 80"
                    min="1"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 btn-purple text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
                  >
                    Simulate Pathway
                  </button>
                </div>
              </form>
            </div>

            {/* What-If Simulation Result Panel */}
            {whatIfResult !== null && (
              <div className={`p-6 rounded-xl border shadow-sm transition-all duration-300 animate-in fade-in ${whatIfResult.possible ? (parseFloat(whatIfResult.requiredGpa) <= 0 ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200') : 'bg-red-50 border-red-200'}`}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-200/50 pb-4 mb-4">
                  <div>
                    <h3 className={`text-xl font-extrabold ${whatIfResult.possible ? (parseFloat(whatIfResult.requiredGpa) <= 0 ? 'text-blue-700' : 'text-green-700') : 'text-red-700'}`}>
                      {whatIfResult.message}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{whatIfResult.detail}</p>
                  </div>
                  {whatIfResult.possible && parseFloat(whatIfResult.requiredGpa) > 0 && (
                    <div className="bg-white border border-green-200 px-6 py-3 rounded-xl text-center shadow-sm">
                      <span className="text-3xl font-black text-green-600">{whatIfResult.requiredGpa}</span>
                      <span className="block text-xs font-semibold text-gray-500 mt-0.5">REQ. GPA</span>
                    </div>
                  )}
                </div>

                {whatIfResult.possible && whatIfResult.recommendation && (
                  <div className="flex items-start gap-2.5">
                    <div>
                      <span className="font-bold text-gray-800 text-sm">Studyhub AI Strategy Advice:</span>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{whatIfResult.recommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <GuestRestrictionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        actionName={modalAction}
      />
    </Layout>
  )
}

export default CGPACalculator
