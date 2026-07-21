import Material from '../models/Material.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import multer from 'multer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configure multer for library PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/library')
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'library-' + uniqueSuffix + path.extname(file.originalname))
  }
})

export const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed'))
    }
  }
})

// @desc    Get all library materials
// @route   GET /api/library
// @access  Public
export const getMaterials = async (req, res) => {
  try {
    const materials = await Material.find().sort({ createdAt: -1 })
    res.json(materials)
  } catch (error) {
    console.error('Error fetching materials:', error)
    res.status(500).json({ message: 'Server error fetching library materials' })
  }
}

// @desc    Contribute/Upload a library material
// @route   POST /api/library/upload
// @access  Private (or Public if we allow guests/registered students)
export const contributeMaterial = async (req, res) => {
  try {
    const { courseCode, title, yearRange, type, description } = req.body
    const file = req.file

    if (!file) {
      return res.status(400).json({ message: 'No PDF file uploaded' })
    }

    if (!courseCode || !title || !yearRange || !type) {
      // Clean up uploaded file if validation failed
      fs.unlinkSync(file.path)
      return res.status(400).json({ message: 'Missing required registration fields' })
    }

    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB'
    const fileUrl = `/uploads/library/${file.filename}`

    const material = await Material.create({
      courseCode,
      title,
      yearRange,
      type,
      description,
      fileUrl,
      fileSize: fileSizeMb,
      uploader: req.user ? req.user.fullName : 'Anonymous Student'
    })

    res.status(201).json(material)
  } catch (error) {
    console.error('Error contributing material:', error)
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path)
      } catch (err) {
        console.error('Error unlinking file:', err)
      }
    }
    res.status(500).json({ message: error.message || 'Server error uploading material' })
  }
}

// @desc    Download material file directly as attachment
// @route   GET /api/library/download/:filename
// @access  Public
export const downloadMaterial = async (req, res) => {
  try {
    const { filename } = req.params
    const filePath = path.join(__dirname, '../../uploads/library', filename)

    if (!fs.existsSync(filePath)) {
      // Check in the course materials folder as fallback
      const courseFilePath = path.join(__dirname, '../../uploads/materials', filename)
      if (fs.existsSync(courseFilePath)) {
        return res.download(courseFilePath)
      }
      return res.status(404).json({ message: 'File not found' })
    }

    res.download(filePath)
  } catch (error) {
    console.error('Error downloading file:', error)
    res.status(500).json({ message: 'Server error downloading file' })
  }
}
