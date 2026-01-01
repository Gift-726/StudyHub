import mongoose from 'mongoose'

const videoProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  videoId: {
    type: String, // YouTube video ID
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  watchTime: {
    type: Number, // in seconds
    default: 0
  },
  lastWatchedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
})

// Prevent duplicate progress entries
videoProgressSchema.index({ userId: 1, courseId: 1, videoId: 1 }, { unique: true })

export default mongoose.model('VideoProgress', videoProgressSchema)

