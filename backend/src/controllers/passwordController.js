import { validationResult } from 'express-validator'
import User from '../models/User.js'
import OTP from '../models/OTP.js'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { sendOTPEmail } from '../utils/emailService.js'

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Generate reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

// @desc    Request password reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg || 'Validation failed',
        errors: errors.array(),
      })
    }

    const { email } = req.body

    // Check if user exists - only registered users can reset password
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address. Please sign up first.',
      })
    }

    // Generate OTP and token
    const otpCode = generateOTP()
    const resetToken = generateResetToken()

    // Delete any existing unused OTPs for this email
    await OTP.deleteMany({ email, used: false })

    // Save OTP to database (expires in 10 minutes)
    await OTP.create({
      email,
      otp: otpCode,
      token: resetToken,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    })

    // Send OTP via email
    try {
      await sendOTPEmail(email, otpCode)
      console.log(`✅ OTP email sent successfully to ${email}`)
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError.message)
      // Log OTP to console as fallback for development
      console.log('\n========================================')
      console.log(`📧 PASSWORD RESET OTP FOR: ${email}`)
      console.log(`🔐 OTP CODE: ${otpCode}`)
      console.log(`🔑 Reset Token: ${resetToken}`)
      console.log('========================================\n')
      
      // Still return success but log the error
      // In production, you might want to return an error here
      if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({
          success: false,
          message: 'Failed to send email. Please try again later.',
        })
      }
    }

    res.json({
      success: true,
      message: 'OTP code sent to your email',
      // Return OTP in development for testing (remove in production)
      otp: process.env.NODE_ENV === 'development' ? otpCode : undefined,
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ message: error.message || 'Server error occurred' })
  }
}

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg || 'Validation failed',
        errors: errors.array(),
      })
    }

    const { email, otp } = req.body

    // Find OTP record
    const otpRecord = await OTP.findOne({
      email,
      otp,
      used: false,
      expiresAt: { $gt: new Date() },
    })

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }

    // Mark OTP as used
    otpRecord.used = true
    await otpRecord.save()

    res.json({
      success: true,
      message: 'OTP verified successfully',
      token: otpRecord.token,
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    res.status(500).json({ message: error.message || 'Server error occurred' })
  }
}

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg || 'Validation failed',
        errors: errors.array(),
      })
    }

    const { email, token, password } = req.body

    // Verify token
    const otpRecord = await OTP.findOne({
      email,
      token,
      used: true,
      expiresAt: { $gt: new Date() },
    })

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired reset token' })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update password
    user.password = password
    await user.save()

    // Delete used OTP records for this email
    await OTP.deleteMany({ email, used: true })

    // Generate JWT token for auto-login
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })

    res.json({
      success: true,
      message: 'Password reset successfully',
      token: jwtToken,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ message: error.message || 'Server error occurred' })
  }
}

export { forgotPassword, verifyOTP, resetPassword }

