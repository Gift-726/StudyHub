import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from '../src/models/User.js'
import connectDB from '../src/config/db.js'

// Load environment variables
dotenv.config({ path: './.env' })

const testLogin = async () => {
  try {
    // Connect to database
    await connectDB()
    console.log('Connected to MongoDB\n')

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      console.error('Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file')
      process.exit(1)
    }

    console.log('Testing login with:')
    console.log(`  Email: ${adminEmail}`)
    console.log(`  Password: ${adminPassword}\n`)

    // Find user
    const user = await User.findOne({ email: adminEmail.toLowerCase().trim() })
    
    if (!user) {
      console.error('❌ User not found!')
      console.log(`Searched for: "${adminEmail.toLowerCase().trim()}"`)
      
      // List all users to help debug
      const allUsers = await User.find({}).select('email fullName isAdmin')
      console.log('\nAll users in database:')
      allUsers.forEach(u => {
        console.log(`  - ${u.email} (isAdmin: ${u.isAdmin})`)
      })
      
      process.exit(1)
    }

    console.log('✅ User found:')
    console.log(`  Email: ${user.email}`)
    console.log(`  Full Name: ${user.fullName}`)
    console.log(`  isAdmin: ${user.isAdmin}`)
    console.log(`  Hashed Password: ${user.password.substring(0, 20)}...`)

    // Test password comparison
    console.log('\nTesting password comparison...')
    const passwordMatch = await user.comparePassword(adminPassword)
    
    if (passwordMatch) {
      console.log('✅ Password matches!')
    } else {
      console.log('❌ Password does NOT match!')
      console.log('\nAttempting to fix password...')
      
      // Force update password
      user.password = adminPassword
      await user.save()
      
      // Test again
      const retryMatch = await user.comparePassword(adminPassword)
      if (retryMatch) {
        console.log('✅ Password fixed and now matches!')
      } else {
        console.log('❌ Still not matching after fix. There may be an issue with password hashing.')
      }
    }

    console.log('\n✅ Login test complete!')
    process.exit(0)
  } catch (error) {
    console.error('Error testing login:', error)
    process.exit(1)
  }
}

// Run the script
testLogin()

