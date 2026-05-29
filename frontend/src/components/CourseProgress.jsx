import { useEffect, useState } from 'react'
import { progressAPI } from '../services/api'

const CourseProgress = ({ courseId }) => {
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (courseId) {
      fetchProgress()
    }
  }, [courseId])

  const fetchProgress = async () => {
    try {
      setLoading(true)
      const response = await progressAPI.getCourseProgress(courseId)
      setProgress(response.data)
    } catch (error) {
      console.error('Error fetching progress:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !progress) return null

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-bold mb-4">Your Progress</h3>
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span>{progress.completedVideos} of {progress.totalVideos} videos completed</span>
          <span className="font-semibold text-purple-brand">{progress.completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-purple-brand h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress.completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default CourseProgress

