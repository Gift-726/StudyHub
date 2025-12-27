import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  faculty: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    enum: ['100', '200', '300', '400', '500'],
    required: true
  },
  instructor: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Course', courseSchema)

