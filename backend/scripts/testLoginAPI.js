import dotenv from 'dotenv'
import axios from 'axios'

// Load environment variables
dotenv.config({ path: './.env' })

const API_URL = process.env.FRONTEND_URL?.replace(':3000', ':5000') || 'http://localhost:5000'
const adminEmail = process.env.ADMIN_EMAIL
const adminPassword = process.env.ADMIN_PASSWORD

const testLoginAPI = async () => {
  try {
    console.log('Testing Login API...\n')
    console.log(`API URL: ${API_URL}/api/auth/login`)
    console.log(`Email: ${adminEmail}`)
    console.log(`Password: ${adminPassword}\n`)

    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email: adminEmail,
      password: adminPassword
    })

    console.log('✅ Login successful!')
    console.log('Response:', {
      email: response.data.email,
      fullName: response.data.fullName,
      isAdmin: response.data.isAdmin,
      hasToken: !!response.data.token
    })
  } catch (error) {
    console.error('❌ Login failed!')
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Message:', error.response.data.message)
      if (error.response.data.errors) {
        console.error('Validation errors:', error.response.data.errors)
      }
    } else if (error.request) {
      console.error('No response received. Is the backend server running?')
      console.error('Make sure to start the backend with: npm run dev')
    } else {
      console.error('Error:', error.message)
    }
  }
}

testLoginAPI()

