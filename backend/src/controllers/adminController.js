import Course from '../models/Course.js'
import Topic from '../models/Topic.js'
import { extractPlaylistId, fetchPlaylistVideos } from '../services/youtubeService.js'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/materials')
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed'))
    }
  }
})

// Import playlist from YouTube
export const importPlaylist = async (req, res) => {
  try {
    const { courseId, playlistUrl, topicTitle, topicDescription } = req.body
    const apiKey = process.env.YOUTUBE_API_KEY

    if (!apiKey) {
      return res.status(500).json({ message: 'YouTube API key not configured' })
    }

    if (!playlistUrl || !courseId || !topicTitle) {
      return res.status(400).json({ message: 'Missing required fields: courseId, playlistUrl, topicTitle' })
    }

    const playlistId = extractPlaylistId(playlistUrl)
    if (!playlistId) {
      return res.status(400).json({ message: 'Invalid playlist URL. Please provide a valid YouTube playlist URL.' })
    }

    // Check if course exists
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    // Fetch videos from YouTube
    const videos = await fetchPlaylistVideos(playlistId, apiKey)

    if (videos.length === 0) {
      return res.status(400).json({ message: 'No videos found in playlist' })
    }

    // Create or update topic
    let topic = await Topic.findOne({ courseId, title: topicTitle })
    
    if (topic) {
      // Update existing topic
      topic.videos = videos
      topic.description = topicDescription || topic.description
      await topic.save()
    } else {
      // Create new topic
      const topicCount = await Topic.countDocuments({ courseId })
      topic = await Topic.create({
        courseId,
        title: topicTitle,
        description: topicDescription || '',
        videos,
        order: topicCount
      })
    }

    // Update course topics count
    const topicCount = await Topic.countDocuments({ courseId })
    await Course.findByIdAndUpdate(courseId, {
      topics: topicCount
    })

    res.json({
      message: 'Playlist imported successfully',
      topic: {
        _id: topic._id,
        title: topic.title,
        description: topic.description,
        videosCount: topic.videos.length
      },
      videosCount: videos.length
    })
  } catch (error) {
    console.error('Import playlist error:', error)
    res.status(500).json({ 
      message: error.message || 'Failed to import playlist',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}

// Upload material (PDF, past questions)
export const uploadMaterial = async (req, res) => {
  try {
    const { topicId, materialType, title } = req.body
    const file = req.file

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    if (!topicId || !materialType || !title) {
      return res.status(400).json({ message: 'Missing required fields: topicId, materialType, title' })
    }

    const topic = await Topic.findById(topicId)
    if (!topic) {
      // Delete uploaded file if topic not found
      fs.unlinkSync(file.path)
      return res.status(404).json({ message: 'Topic not found' })
    }

    // In production, upload to cloud storage (AWS S3, Cloudinary, etc.)
    // For now, we'll use local storage
    const fileUrl = `/uploads/materials/${file.filename}`

    topic.materials.push({
      type: materialType,
      title,
      fileUrl
    })

    await topic.save()

    res.json({
      message: 'Material uploaded successfully',
      material: topic.materials[topic.materials.length - 1]
    })
  } catch (error) {
    console.error('Upload material error:', error)
    // Delete file if error occurred
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path)
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError)
      }
    }
    res.status(500).json({ message: 'Failed to upload material' })
  }
}

// Get all courses for admin
export const getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await Course.find().sort({ level: 1, title: 1 })
    res.json(courses)
  } catch (error) {
    console.error('Get courses admin error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get course details with topics
export const getCourseDetailsAdmin = async (req, res) => {
  try {
    const { courseId } = req.params
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    const topics = await Topic.find({ courseId }).sort({ order: 1 })
    
    res.json({ course, topics })
  } catch (error) {
    console.error('Get course details admin error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Delete topic
export const deleteTopic = async (req, res) => {
  try {
    const { topicId } = req.params
    const topic = await Topic.findByIdAndDelete(topicId)
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' })
    }

    // Update course topics count
    const topicCount = await Topic.countDocuments({ courseId: topic.courseId })
    await Course.findByIdAndUpdate(topic.courseId, {
      topics: topicCount
    })

    res.json({ message: 'Topic deleted successfully' })
  } catch (error) {
    console.error('Delete topic error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Create new course
export const createCourse = async (req, res) => {
  try {
    const { title, description, faculty, department, level, units, instructor, image } = req.body

    if (!title || !faculty || !department || !level) {
      return res.status(400).json({ message: 'Missing required fields: title, faculty, department, level' })
    }

    const course = await Course.create({
      title,
      description: description || '',
      faculty,
      department,
      level,
      units: units || 3,
      instructor: instructor || '',
      image: image || '',
      topics: 0
    })

    res.status(201).json({
      message: 'Course created successfully',
      course
    })
  } catch (error) {
    console.error('Create course error:', error)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Course with this title already exists' })
    }
    res.status(500).json({ message: 'Failed to create course' })
  }
}

