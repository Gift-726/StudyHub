const testEndpoints = async () => {
  try {
    console.log('Testing GET /api/health...')
    const health = await fetch('http://localhost:5000/api/health')
    const healthData = await health.json()
    console.log('GET /api/health Response:', health.status, healthData)
  } catch (error) {
    console.error('GET /api/health Failed:', error.message)
  }

  try {
    console.log('\nTesting POST /api/auth/login...')
    const login = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    })
    const loginData = await login.json().catch(() => null)
    console.log('POST /api/auth/login Response:', login.status, loginData)
  } catch (error) {
    console.error('POST /api/auth/login Failed:', error.message)
  }
}

// Wait a bit to ensure server is fully started, then run
setTimeout(testEndpoints, 2000)
