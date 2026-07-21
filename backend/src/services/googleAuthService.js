import { OAuth2Client } from 'google-auth-library'

export const verifyGoogleToken = async (token) => {
  const clientId = (process.env.CLIENT_ID || '').trim()
  
  if (!clientId) {
    throw new Error('CLIENT_ID is not configured in backend environment variables')
  }

  const client = new OAuth2Client(clientId)

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    })
    return ticket.getPayload()
  } catch (error) {
    console.error('Google Token Verification Error:', error)
    throw new Error('Invalid Google credential token')
  }
}
