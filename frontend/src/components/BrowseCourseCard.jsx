import { useNavigate } from 'react-router-dom'

const BrowseCourseCard = ({ course, isEnrolled, onEnroll, enrolling }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (isEnrolled) {
      navigate(`/courses/${course._id || course.id}`)
    }
  }

  const handleEnrollClick = (e) => {
    e.stopPropagation()
    if (!isEnrolled && onEnroll) {
      onEnroll(course._id || course.id)
    }
  }

  return (
    <div 
      onClick={isEnrolled ? handleClick : undefined}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${isEnrolled ? 'cursor-pointer' : ''}`}
    >
      <div className="flex flex-col md:flex-row">
        {/* Course Image */}
        <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0">
          <img
            src={course.image || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop'}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Course Details */}
        <div className="flex-1 p-4 md:p-6 relative">
          {/* Units Badge */}
          <div className="absolute top-4 right-4 bg-purple-100 text-purple-brand px-3 py-1 rounded-full text-sm font-semibold">
            {course.units || 3} Units
          </div>

          {/* Level Badge */}
          {course.level && (
            <div className="absolute top-4 right-20 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              {course.level} Level
            </div>
          )}

          {/* Topics Count */}
          <p className="text-sm text-gray-600 mb-2">{course.topics || 0} Topics</p>

          {/* Course Title */}
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 pr-32">
            {course.title}
          </h3>

          {/* Description */}
          {course.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
          )}

          {/* Faculty/Department */}
          <div className="text-sm text-gray-500 mb-4">
            {course.faculty && <p>{course.faculty}</p>}
            {course.department && <p>{course.department}</p>}
          </div>

          {/* Enroll Button or View Button */}
          <div className="mt-4">
            {isEnrolled ? (
              <button
                onClick={handleClick}
                className="px-6 py-2 btn-purple text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                View Course
              </button>
            ) : (
              <button
                onClick={handleEnrollClick}
                disabled={enrolling}
                className="px-6 py-2 btn-purple text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrowseCourseCard

