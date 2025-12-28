import { useState, useRef, useEffect } from 'react'
import Layout from '../components/Layout'

const CGPACalculator = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: '', credit: '', grade: '' }
  ])
  const [cgpa, setCgpa] = useState(null)
  const courseRefs = useRef({})
  const cgpaResultRef = useRef(null)
  const lastAddedCourseId = useRef(null)

  const gradePoints = {
    'A': 5.0,
    'B': 4.0,
    'C': 3.0,
    'D': 2.0,
    'E': 1.0,
    'F': 0.0
  }

  const handleAddCourse = () => {
    const newId = Date.now()
    lastAddedCourseId.current = newId
    setCourses([...courses, { id: newId, name: '', credit: '', grade: '' }])
  }

  // Scroll to newly added course
  useEffect(() => {
    if (lastAddedCourseId.current && courseRefs.current[lastAddedCourseId.current]) {
      setTimeout(() => {
        courseRefs.current[lastAddedCourseId.current]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
        // Focus on the first input of the new course
        const firstInput = courseRefs.current[lastAddedCourseId.current]?.querySelector('input')
        if (firstInput) {
          firstInput.focus()
        }
      }, 100)
      lastAddedCourseId.current = null
    }
  }, [courses])

  const handleRemoveCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter(course => course.id !== id))
    }
  }

  const handleCourseChange = (id, field, value) => {
    setCourses(courses.map(course =>
      course.id === id ? { ...course, [field]: value } : course
    ))
  }

  const calculateCGPA = () => {
    let totalPoints = 0
    let totalCredits = 0

    courses.forEach(course => {
      const credit = parseFloat(course.credit) || 0
      const points = gradePoints[course.grade.toUpperCase()] || 0
      
      if (credit > 0 && points > 0) {
        totalPoints += credit * points
        totalCredits += credit
      }
    })

    if (totalCredits > 0) {
      setCgpa((totalPoints / totalCredits).toFixed(2))
      // Scroll to result after a short delay to ensure it's rendered
      setTimeout(() => {
        cgpaResultRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }, 100)
    } else {
      setCgpa(null)
    }
  }

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">CGPA Calculator</h2>
        
        <div className="space-y-4">
          {courses.map((course, index) => (
            <div 
              key={course.id} 
              ref={(el) => (courseRefs.current[course.id] = el)}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => handleCourseChange(course.id, 'name', e.target.value)}
                  placeholder="e.g., Mathematics"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credit Units
                </label>
                <input
                  type="number"
                  value={course.credit}
                  onChange={(e) => handleCourseChange(course.id, 'credit', e.target.value)}
                  placeholder="e.g., 3"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade
                </label>
                <select
                  value={course.grade}
                  onChange={(e) => handleCourseChange(course.id, 'grade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Grade</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                </select>
              </div>
              <div className="flex gap-2">
                {courses.length > 1 && (
                  <button
                    onClick={() => handleRemoveCourse(course.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleAddCourse}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Add Course
          </button>
          <button
            onClick={calculateCGPA}
            className="px-6 py-2 btn-purple text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Calculate CGPA
          </button>
        </div>

        {cgpa !== null && (
          <div 
            ref={cgpaResultRef}
            className="mt-6 p-6 bg-purple-50 rounded-lg border-2 border-purple-brand"
          >
            <h3 className="text-xl font-bold text-purple-brand mb-2">Your CGPA</h3>
            <p className="text-4xl font-bold text-purple-brand">{cgpa}</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default CGPACalculator

