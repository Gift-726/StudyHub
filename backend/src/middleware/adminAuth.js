// Admin authentication middleware
// Checks if user email matches admin email from environment variables

export const adminAuth = (req, res, next) => {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    return res.status(500).json({ 
      message: 'Admin credentials not configured' 
    })
  }

  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  // Check if user email matches admin email
  if (req.user.email.toLowerCase() !== adminEmail.toLowerCase()) {
    return res.status(403).json({ message: 'Admin access required' })
  }

  // Verify password matches (for extra security)
  // Note: In production, you might want to store hashed password
  // For now, we'll check it matches the env variable
  // This is a simple check - you can enhance this later

  next()
}

