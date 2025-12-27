import Layout from '../components/Layout'

const Courses = () => {
  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No courses enrolled yet.</p>
          <p className="text-sm mt-2">Browse available courses to get started!</p>
        </div>
      </div>
    </Layout>
  )
}

export default Courses

