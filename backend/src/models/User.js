import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
  },
  faculty: {
    type: String,
    required: [true, 'Please select your faculty'],
    trim: true,
  },
  department: {
    type: String,
    required: [true, 'Please select your department'],
    trim: true,
  },
  level: {
    type: String,
    required: [true, 'Please select your level'],
    enum: ['100', '200', '300', '400', '500'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Hash password before saving
userSchema.pre('save', async function () {
  // Skip if password hasn't been modified
  if (!this.isModified('password')) {
    return
  }

  try {
    // Hash the password
    this.password = await bcrypt.hash(this.password, 12)
  } catch (error) {
    throw error
  }
})

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User

