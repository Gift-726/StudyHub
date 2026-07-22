import nodemailer from 'nodemailer'

// Helper to safely retrieve clean environment variables without whitespace
const getEnv = (key) => (process.env[key] ? process.env[key].trim() : '')

// Create transporter based on environment configuration
const createTransporter = () => {
  const emailService = getEnv('EMAIL_SERVICE').toLowerCase()
  const emailUser = getEnv('EMAIL_USER')
  const emailPass = getEnv('EMAIL_PASSWORD')
  const smtpHost = getEnv('SMTP_HOST')
  const smtpPort = parseInt(getEnv('SMTP_PORT') || '465', 10)
  const smtpSecure = getEnv('SMTP_SECURE') === 'true' || smtpPort === 465

  // 1. Gmail SMTP (Optimized for both localhost and hosted cloud servers like Render)
  if (emailService === 'gmail' || (!smtpHost && emailUser.endsWith('@gmail.com'))) {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // SSL port 465 is more reliable on hosted servers
      auth: {
        user: emailUser,
        pass: emailPass, // Google App Password (16 characters)
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  }

  // 2. Custom SMTP provider (e.g., SendGrid, Mailgun, Brevo, ZoHo)
  return nodemailer.createTransport({
    host: smtpHost || 'smtp.gmail.com',
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })
}

// Send OTP email
export const sendOTPEmail = async (email, otpCode) => {
  const resendApiKey = getEnv('RESEND_API_KEY')
  const emailUser = getEnv('EMAIL_USER')
  const emailFrom = getEnv('EMAIL_FROM') || `StudyHub <${emailUser || 'onboarding@resend.dev'}>`

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset OTP</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #faf9f6;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 40px 20px; text-align: center;">
            <table role="presentation" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #eaeaea; overflow: hidden;">
              <tr>
                <td style="padding: 32px 30px; text-align: center; background-color: #4B2E83;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; tracking-tight: -0.5px;">StudyHub</h1>
                  <p style="margin: 4px 0 0 0; color: #e9d5ff; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Academic Workspace</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 36px 32px;">
                  <h2 style="margin: 0 0 12px 0; color: #111827; font-size: 20px; font-weight: 700;">Password Reset Code</h2>
                  <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
                    Hello, you requested to reset your password for your StudyHub account. Use the 6-digit OTP security code below to complete your verification:
                  </p>
                  
                  <div style="background-color: #f3e8ff; border: 2px dashed #8b5cf6; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
                    <span style="font-size: 36px; font-weight: 900; color: #4B2E83; letter-spacing: 10px; font-family: 'Courier New', monospace;">
                      ${otpCode}
                    </span>
                  </div>

                  <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 13px; line-height: 1.5;">
                    This OTP verification code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                    If you did not request a password reset, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #f3f4f6;">
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    © ${new Date().getFullYear()} StudyHub. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  const textContent = `Password Reset OTP - StudyHub\n\nYour OTP security code is: ${otpCode}\nThis code will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.`

  try {
    // Priority 1: Resend HTTP API (Ideal for hosted servers - bypasses all SMTP port blocks)
    if (resendApiKey) {
      console.log('Sending email via Resend API (HTTP)...')
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: emailFrom,
          to: email,
          subject: 'Password Reset OTP - StudyHub',
          html: htmlContent,
          text: textContent,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Resend API error (${response.status})`)
      }

      const info = await response.json()
      console.log('✅ Email sent successfully via Resend:', info.id)
      return { success: true, messageId: info.id }
    }

    // Priority 2: Nodemailer SMTP Transporter
    const transporter = createTransporter()
    const mailOptions = {
      from: emailFrom,
      to: email,
      subject: 'Password Reset OTP - StudyHub',
      html: htmlContent,
      text: textContent,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent successfully via SMTP:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message || error)
    throw error
  }
}

// Verify email configuration
export const verifyEmailConfig = async () => {
  if (getEnv('RESEND_API_KEY')) {
    console.log('✅ Resend API configuration detected. Ready to send messages.')
    return true
  }

  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('✅ SMTP Email server connection verified successfully.')
    return true
  } catch (error) {
    console.warn('⚠️ SMTP Email configuration warning:', error.message)
    return false
  }
}
