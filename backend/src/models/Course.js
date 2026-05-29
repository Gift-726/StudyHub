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
  courseAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  adminAccessToken: {
    type: String,
    default: null
  },
  topics: {
    type: Number,
    default: 0
  },
  units: {
    type: Number,
    default: 3
  },
  image: {
    type: String,
    trim: true
  },
  forumLinks: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    platform: {
      type: String,
      trim: true,
      default: 'Other' // e.g., WhatsApp, Telegram, Discord, Facebook, etc.
    },
    description: {
      type: String,
      trim: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Course', courseSchema)

