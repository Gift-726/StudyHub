import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import User from '../models/User.js'
import mongoose from 'mongoose'

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: errors.array()[0].msg || 'Validation failed',
        errors: errors.array() 
      })
    }

    const { email, password, fullName, faculty, department, level } = req.body

    // Check if user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Create user
    const user = await User.create({
      email,
      password,
      fullName,
      faculty,
      department,
      level,
    })

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        faculty: user.faculty,
        department: user.department,
        level: user.level,
        token: generateToken(user._id),
      })
    } else {
      res.status(500).json({ message: 'Failed to create user' })
    }
  } catch (error) {
    console.error('Registration error:', error)
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email' })
    }
    res.status(500).json({ message: error.message || 'Server error occurred' })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: errors.array()[0].msg || 'Validation failed',
        errors: errors.array() 
      })
    }

    const { email, password } = req.body

    // Normalize email (lowercase and trim) to match database storage
    const normalizedEmail = email.toLowerCase().trim()

    // Check for user
    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    res.json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      faculty: user.faculty,
      department: user.department,
      level: user.level,
      token: generateToken(user._id),
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: error.message || 'Server error occurred' })
  }
}

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    if (req.user && req.user.isGuest) {
      return res.json(req.user)
    }
    const user = await User.findById(req.user._id).select('-password')
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const guestLogin = async (req, res) => {
  try {
    const guestId = new mongoose.Types.ObjectId().toString()
    const token = jwt.sign({ id: guestId, isGuest: true }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })
    res.json({
      _id: guestId,
      email: 'guest@studyhub.com',
      fullName: 'Guest Student',
      faculty: 'Science & Tech',
      department: 'Computer Science',
      level: '100',
      isGuest: true,
      token,
    })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error occurred' })
  }
}

export { register, login, getMe, guestLogin }

