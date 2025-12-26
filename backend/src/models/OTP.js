import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 600, // 10 minutes
  },
  used: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for faster queries
otpSchema.index({ email: 1, otp: 1 })
otpSchema.index({ token: 1 })

const OTP = mongoose.model('OTP', otpSchema)

export default OTP

