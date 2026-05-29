import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from '../src/models/User.js'
import connectDB from '../src/config/db.js'

// Load environment variables
dotenv.config({ path: './.env' })

const verifyAdmin = async () => {
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

    console.log(`\nVerifying admin user...`)
    console.log(`Expected Email: ${adminEmail}`)
    console.log(`Expected Password: ${adminPassword}`)

    // Find user with this email
    const user = await User.findOne({ email: adminEmail.toLowerCase() })

    if (!user) {
      console.error('❌ ERROR: Admin user not found in database!')
      console.log('Run: npm run update-admin to create/update the admin user')
      process.exit(1)
    }

    console.log(`\n✅ User found in database:`)
    console.log(`  Email: ${user.email}`)
    console.log(`  Name: ${user.fullName}`)
    console.log(`  isAdmin: ${user.isAdmin}`)

    // Test password
    const passwordMatch = await user.comparePassword(adminPassword)
    if (passwordMatch) {
      console.log(`  Password: ✅ MATCHES`)
    } else {
      console.log(`  Password: ❌ DOES NOT MATCH`)
      console.log('\n⚠️  Password mismatch! Updating password...')
      user.password = adminPassword
      await user.save()
      console.log('✅ Password updated!')
    }

    // Verify isAdmin flag
    if (!user.isAdmin) {
      console.log('\n⚠️  isAdmin flag is false! Updating...')
      user.isAdmin = true
      await user.save()
      console.log('✅ isAdmin flag updated!')
    }

    console.log(`\n✅ Admin user is ready!`)
    console.log(`\nLogin credentials:`)
    console.log(`  Email: ${adminEmail}`)
    console.log(`  Password: ${adminPassword}`)

    process.exit(0)
  } catch (error) {
    console.error('Error verifying admin user:', error)
    process.exit(1)
  }
}

// Run the script
verifyAdmin()

