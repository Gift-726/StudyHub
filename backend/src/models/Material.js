import mongoose from 'mongoose'

const materialSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: [true, 'Please provide a course code'],
    trim: true,
    uppercase: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  yearRange: {
    type: String,
    required: [true, 'Please provide a year/session range'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please provide a material type'],
    enum: ['past-question', 'summary', 'formulas']
  },
  description: {
    type: String,
    trim: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileSize: {
    type: String,
    required: true
  },
  uploader: {
    type: String,
    default: 'Anonymous Student'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Material', materialSchema)
