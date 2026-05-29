import nodemailer from 'nodemailer'

// Create transporter based on environment
const createTransporter = () => {
  // For Gmail SMTP
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
      },
    })
  }

  // For custom SMTP (works with most email providers)
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

// Send OTP email
export const sendOTPEmail = async (email, otpCode) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `"StudyHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP - StudyHub',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset OTP</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Urbanist', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 20px; text-align: center;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center; background-color: #faf9f6;">
                      <h1 style="margin: 0; color: #000000; font-size: 28px; font-weight: 700;">Password Reset</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                        Hello,
                      </p>
                      <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                        You requested to reset your password for your Studyhub account. Use the OTP code below to proceed:
                      </p>
                      <div style="background-color: #faf9f6; border: 2px solid #000000; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
                        <p style="margin: 0; font-size: 32px; font-weight: 700; color: #000000; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                          ${otpCode}
                        </p>
                      </div>
                      <p style="margin: 20px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                        This code will expire in <strong>10 minutes</strong>.
                      </p>
                      <p style="margin: 20px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                        If you didn't request this password reset, please ignore this email or contact support if you have concerns.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 30px; background-color: #faf9f6; text-align: center; border-top: 1px solid #e0e0e0;">
                      <p style="margin: 0; color: #999999; font-size: 12px;">
                        © ${new Date().getFullYear()} Studyhub. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
        Password Reset OTP - Studyhub
        
        Hello,
        
        You requested to reset your password for your Studyhub account. Use the OTP code below to proceed:
        
        OTP Code: ${otpCode}
        
        This code will expire in 10 minutes.
        
        If you didn't request this password reset, please ignore this email or contact support if you have concerns.
        
        © ${new Date().getFullYear()} Studyhub. All rights reserved.
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send email. Please try again later.')
  }
}

// Verify email configuration AIzaSyDQtNg5jyHHAx3F-8pZG7IiES18ksW206A
export const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('✅ Email server is ready to send messages')
    return true
  } catch (error) {
    console.error('❌ Email configuration error:', error.message)
    return false
  }
}

