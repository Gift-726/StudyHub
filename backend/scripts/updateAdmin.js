import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from '../src/models/User.js'
import connectDB from '../src/config/db.js'

// Load environment variables
dotenv.config({ path: './.env' })

const updateAdmin = async () => {
  try {
    // Connect to database
    await connectDB()
    console.log('Connected to MongoDB')

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      console.error('Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file')
      process.exit(1)
    }

    console.log(`\nUpdating admin user with email: ${adminEmail}`)

    // Find existing user with this email
    let user = await User.findOne({ email: adminEmail.toLowerCase() })

    if (user) {
      // Update existing user
      console.log('Found existing user, updating...')
      // Mark password as modified to trigger hashing
      user.password = adminPassword // Will be hashed by pre-save hook
      user.isAdmin = true
      // Force save to ensure password is hashed
      user.markModified('password')
      await user.save()
      console.log('✅ Admin user updated successfully!')
    } else {
      // Create new admin user
      console.log('User not found, creating new admin user...')
      user = await User.create({
        email: adminEmail.toLowerCase(),
        password: adminPassword, // Will be hashed by pre-save hook
        fullName: 'Admin User',
        faculty: 'School of Computing (SC)',
        department: 'Computer Science (CSC)',
        level: '500',
        isAdmin: true
      })
      console.log('✅ Admin user created successfully!')
    }

    // Verify password works
    const passwordMatch = await user.comparePassword(adminPassword)
    
    console.log(`\nAdmin Details:`)
    console.log(`  Email: ${user.email}`)
    console.log(`  Name: ${user.fullName}`)
    console.log(`  isAdmin: ${user.isAdmin}`)
    console.log(`  Password Match: ${passwordMatch ? '✅ YES' : '❌ NO'}`)
    
    if (!passwordMatch) {
      console.log('\n⚠️  Password verification failed! Re-saving user...')
      user.password = adminPassword
      await user.save()
      const retryMatch = await user.comparePassword(adminPassword)
      console.log(`  Retry Password Match: ${retryMatch ? '✅ YES' : '❌ NO'}`)
    }
    
    console.log(`\n✅ Done! You can now login with:`)
    console.log(`  Email: ${adminEmail}`)
    console.log(`  Password: ${adminPassword}`)
    console.log(`\n⚠️  IMPORTANT: Make sure frontend/.env has:`)
    console.log(`  VITE_ADMIN_EMAIL=${adminEmail}`)

    process.exit(0)
  } catch (error) {
    console.error('Error updating admin user:', error)
    process.exit(1)
  }
}

// Run the script
updateAdmin()

