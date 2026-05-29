import mongoose from 'mongoose'

const studySessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 0
  },
  watchedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

export default mongoose.model('StudySession', studySessionSchema)

