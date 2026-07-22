export const verifyGoogleToken = async (accessToken) => {
  if (!accessToken) {
    throw new Error('Google access token is required')
  }

  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`)
    
    if (!response.ok) {
      throw new Error(`Google API returned status ${response.status}`)
    }

    const payload = await response.json()
    return payload // returns { email, name, email_verified, picture, ... }
  } catch (error) {
    console.error('Google Access Token Verification Error:', error)
    throw new Error('Invalid Google access token')
  }
}
