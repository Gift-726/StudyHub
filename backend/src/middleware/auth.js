import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const protect = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    try {
      if (token === 'guest-token') {
        req.user = {
          _id: '60d5ec493ad5c426685718e9',
          email: 'guest@studyhub.com',
          fullName: 'Guest Student',
          faculty: 'Science & Tech',
          department: 'Computer Science',
          level: '100',
          isGuest: true
        }
        return next()
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' })
      }
      next()
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export { protect }

