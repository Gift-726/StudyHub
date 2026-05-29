import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import GuestRestrictionModal from '../components/GuestRestrictionModal'
import toast from 'react-hot-toast'

const Library = () => {
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')

  // Form State
  const [formData, setFormData] = useState({
    courseCode: '',
    title: '',
    yearRange: '',
    type: 'past-question',
    description: ''
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  // Seed data + User Uploads State
  const [materials, setMaterials] = useState([])

  const defaultMaterials = [
    {
      id: 'd1',
      courseCode: 'MTH 101',
      title: 'MTH 101 Calculus & Trigonometry Past Questions',
      yearRange: '2021/2022',
      type: 'past-question',
      description: 'Official first semester exam past questions for FUTA 100L students.',
      uploader: 'StudyHub Official',
      uploadedAt: '1/12/2025',
      fileSize: '1.2 MB'
    },
    {
      id: 'd2',
      courseCode: 'PHY 101',
      title: 'PHY 101 Mechanics Lecture Notes & Formulas',
      yearRange: '2022/2023',
      type: 'summary',
      description: 'Comprehensive review sheet of kinematics, vectors, and Newton laws.',
      uploader: 'Futa Alumnus',
      uploadedAt: '1/20/2025',
      fileSize: '840 KB'
    },
    {
      id: 'd3',
      courseCode: 'CHM 101',
      title: 'CHM 101 General Chemistry Practical Guide',
      yearRange: '2019-2023',
      type: 'summary',
      description: 'Detailed analysis of acid-base titrations and volumetric calculations.',
      uploader: 'Chemistry Rep',
      uploadedAt: '2/05/2025',
      fileSize: '2.1 MB'
    },
    {
      id: 'd4',
      courseCode: 'CSC 201',
      title: 'CSC 201 Programming Fundamentals Past Exam Papers',
      yearRange: '2022/2023',
      type: 'past-question',
      description: 'Set of programming theory questions and flowchart designs.',
      uploader: 'CSC President',
      uploadedAt: '2/10/2025',
      fileSize: '1.5 MB'
    },
    {
      id: 'd5',
      courseCode: 'GST 111',
      title: 'GST 111 Punctuation & Lexicon Exercises',
      yearRange: '2023/2024',
      type: 'past-question',
      description: 'English syntax practice worksheets compiled for FUTA tests.',
      uploader: 'StudyHub Official',
      uploadedAt: '2/15/2025',
      fileSize: '620 KB'
    }
  ]

  // Load from localStorage & merge with defaults
  useEffect(() => {
    const saved = localStorage.getItem('studyhub_user_library_records')
    if (saved) {
      setMaterials([...defaultMaterials, ...JSON.parse(saved)])
    } else {
      setMaterials(defaultMaterials)
    }
  }, [])

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUploadSubmit = (e) => {
    e.preventDefault()

    if (user?.isGuest) {
      setIsModalOpen(true)
      return
    }

    if (!formData.courseCode.trim() || !formData.title.trim() || !formData.yearRange.trim() || !selectedFile) {
      toast.error('Please fill in all required fields and select a PDF file')
      return
    }

    setIsUploading(true)

    // Simulate uploading delay
    setTimeout(() => {
      const newRecord = {
        id: 'u_' + Date.now(),
        courseCode: formData.courseCode.toUpperCase(),
        title: formData.title,
        yearRange: formData.yearRange,
        type: formData.type,
        description: formData.description || 'Contributed past questions/study materials.',
        uploader: user?.fullName || 'Anonymous Student',
        uploadedAt: new Date().toLocaleDateString(),
        fileSize: (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB'
      }

      const savedRecords = JSON.parse(localStorage.getItem('studyhub_user_library_records') || '[]')
      const updatedRecords = [...savedRecords, newRecord]
      localStorage.setItem('studyhub_user_library_records', JSON.stringify(updatedRecords))

      setMaterials([...defaultMaterials, ...updatedRecords])
      setFormData({
        courseCode: '',
        title: '',
        yearRange: '',
        type: 'past-question',
        description: ''
      })
      setSelectedFile(null)
      setShowUploadForm(false)
      setIsUploading(false)
      toast.success('Material contributed successfully!')
    }, 1500)
  }

  const handleDownload = (fileName) => {
    toast.loading(`Retrieving document ${fileName}...`, { duration: 1000 })
    setTimeout(() => {
      toast.success('Download complete!')
    }, 1200)
  }

  // Filter Logic
  const filteredMaterials = materials.filter(item => {
    const matchesSearch = item.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    
    // Simple course code level matching (e.g. MTH 101 contains "1")
    let matchesLevel = true
    if (levelFilter !== 'all') {
      const matchNum = levelFilter.charAt(0) // '1' for 100 Level, etc.
      const match = item.courseCode.match(/\d/)
      matchesLevel = match && match[0] === matchNum
    }

    return matchesSearch && matchesType && matchesLevel
  })

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resource Library</h1>
            <p className="text-gray-500 mt-1">Access or upload shared lecture notes, summary guides, and official past questions.</p>
          </div>
          <button
            onClick={() => {
              if (user?.isGuest) {
                setIsModalOpen(true)
              } else {
                setShowUploadForm(!showUploadForm)
              }
            }}
            className="px-5 py-2.5 btn-purple text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors text-sm self-start md:self-center"
          >
            {showUploadForm ? 'Cancel Contribution' : '＋ Contribute Material'}
          </button>
        </div>

        {/* Upload Form Box */}
        {showUploadForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contribute Study Material</h2>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    value={formData.courseCode}
                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                    placeholder="e.g. MTH 101"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Year / Range</label>
                  <input
                    type="text"
                    required
                    value={formData.yearRange}
                    onChange={(e) => setFormData({ ...formData, yearRange: e.target.value })}
                    placeholder="e.g. 2022/2023 or 2019-2023"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Material Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="past-question">Past Question Paper</option>
                    <option value="summary">Lecture Summary / Note</option>
                    <option value="formulas">Formula Sheet / Reference</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Material Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. FUTA General Chemistry Test 1 Questions"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Brief Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summarize what this document covers..."
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Upload File (PDF Only)</label>
                <input
                  type="file"
                  required
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-2 btn-purple text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold disabled:opacity-50"
              >
                {isUploading ? 'Uploading & Syncing...' : 'Submit Material'}
              </button>
            </form>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:max-w-xs">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <svg className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="past-question">Past Questions</option>
                <option value="summary">Summaries</option>
                <option value="formulas">Formulas</option>
              </select>

              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
                <option value="500">500 Level</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resources Cards Feed */}
        {filteredMaterials.length > 0 ? (
          <div className="space-y-4">
            {filteredMaterials.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-brand flex items-center justify-center flex-shrink-0 text-xs font-bold uppercase p-1">
                    {item.type === 'past-question' ? 'PQ' : item.type === 'summary' ? 'PDF' : 'DOC'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold px-2 py-0.5 bg-purple-100 text-purple-brand rounded">
                        {item.courseCode}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                        Session: {item.yearRange}
                      </span>
                      <span className="text-xs text-gray-400">
                        Uploaded by {item.uploader}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mt-2 text-base leading-snug">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 gap-3">
                  <span className="text-xs font-bold text-gray-400">{item.fileSize}</span>
                  <button
                    onClick={() => handleDownload(item.title)}
                    className="px-4 py-2 border border-purple-200 text-purple-brand font-semibold rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-xs"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <p className="text-gray-500 font-semibold">No materials found matching your filters.</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your keywords, levels, or resource types.</p>
          </div>
        )}
      </div>

      <GuestRestrictionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        actionName="contribute study materials"
      />
    </Layout>
  )
}

export default Library
