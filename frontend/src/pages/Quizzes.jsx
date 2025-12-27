import Layout from '../components/Layout'

const Quizzes = () => {
  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quizzes</h2>
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No quizzes available yet.</p>
          <p className="text-sm mt-2">Check back later for quiz assignments!</p>
        </div>
      </div>
    </Layout>
  )
}

export default Quizzes

