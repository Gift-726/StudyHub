const CourseCard = ({ course }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No activity yet'
    const date = new Date(dateString)
    return `Last activity on ${date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })}`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
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

          {/* Topics Count */}
          <p className="text-sm text-gray-600 mb-2">{course.topics || 12} Topics</p>

          {/* Course Title */}
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 pr-16 md:pr-20">
            {course.title}
          </h3>

          {/* Progress Section */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-semibold text-purple-brand">{course.progress || 0}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-brand h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress || 0}%` }}
              />
            </div>
          </div>

          {/* Last Activity */}
          <p className="text-sm text-gray-500 mt-3">
            {formatDate(course.lastActivity)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CourseCard

