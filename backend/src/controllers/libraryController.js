import Material from '../models/Material.js'
import mongoose from 'mongoose'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configure Cloudinary
cloudinary.config({
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || '').trim(),
  api_key: (process.env.CLOUDINARY_API_KEY || '').trim(),
  api_secret: (process.env.CLOUDINARY_API_SECRET || '').trim()
})

// Configure multer for memory storage (Cloudinary-backed)
const storage = multer.memoryStorage()

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

// Helper to upload a buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, originalName) => {
  return new Promise((resolve, reject) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const cleanPublicId = path.basename(originalName, '.pdf').replace(/[^a-zA-Z0-9]/g, '_') + '-' + uniqueSuffix

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'studyhub_library',
        resource_type: 'raw', // treated as raw file/document PDF
        public_id: cleanPublicId
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )
    uploadStream.end(fileBuffer)
  })
}

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
      return res.status(400).json({ message: 'Missing required registration fields' })
    }

    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB'
    
    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(file.buffer, file.originalname)
    const fileUrl = uploadResult.secure_url

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

    if (error.name === 'ValidationError') {
      const firstMessage = Object.values(error.errors)[0]?.message || 'Validation failed'
      return res.status(400).json({ message: firstMessage })
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
    const sanitizedFilename = path.basename(filename)

    const filePath = path.join(__dirname, '../../uploads/library', sanitizedFilename)
    const courseFilePath = path.join(__dirname, '../../uploads/materials', sanitizedFilename)

    if (fs.existsSync(filePath)) {
      return res.download(filePath)
    }

    if (fs.existsSync(courseFilePath)) {
      return res.download(courseFilePath)
    }

    const nameWithoutExt = path.basename(sanitizedFilename, path.extname(sanitizedFilename))
    const escapedFilename = sanitizedFilename.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
    const escapedNoExt = nameWithoutExt.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')

    // Fallback: Check if the material exists in the database (e.g. Cloudinary)
    const isIdValid = mongoose.Types.ObjectId.isValid(sanitizedFilename) || mongoose.Types.ObjectId.isValid(nameWithoutExt)
    const validId = isIdValid ? (mongoose.Types.ObjectId.isValid(sanitizedFilename) ? sanitizedFilename : nameWithoutExt) : new mongoose.Types.ObjectId()

    const material = await Material.findOne({
      $or: [
        { _id: validId },
        { fileUrl: { $regex: escapedFilename, $options: 'i' } },
        { fileUrl: { $regex: escapedNoExt, $options: 'i' } },
        { title: { $regex: escapedNoExt, $options: 'i' } },
        { courseCode: { $regex: escapedNoExt, $options: 'i' } }
      ]
    })

    if (material && material.fileUrl) {
      if (material.fileUrl.startsWith('http')) {
        try {
          // Attempt streaming remote file directly so browser downloads it
          const cloudRes = await fetch(material.fileUrl)
          if (cloudRes.ok) {
            const cleanTitle = (material.title || material.courseCode || 'material').replace(/[^a-zA-Z0-9_-]/g, '_')
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', `attachment; filename="${cleanTitle}.pdf"`)
            const arrayBuffer = await cloudRes.arrayBuffer()
            return res.send(Buffer.from(arrayBuffer))
          }
        } catch (fetchErr) {
          console.error('Failed to stream remote Cloudinary file:', fetchErr.message)
        }

        // Fallback: redirect to Cloudinary with fl_attachment parameter
        let downloadUrl = material.fileUrl
        if (downloadUrl.includes('/raw/upload/') && !downloadUrl.includes('/fl_attachment/')) {
          downloadUrl = downloadUrl.replace('/raw/upload/', '/raw/upload/fl_attachment/')
        }
        return res.redirect(downloadUrl)
      }

      // Local relative path fallback
      const relativeLocalPath = path.join(__dirname, '../../', material.fileUrl)
      if (fs.existsSync(relativeLocalPath)) {
        return res.download(relativeLocalPath)
      }
    }

    return res.status(404).json({ message: 'Requested material file not found' })
  } catch (error) {
    console.error('Error downloading file:', error)
    res.status(500).json({ message: 'Server error downloading file' })
  }
}
