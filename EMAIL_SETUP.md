# Email Configuration Guide

This guide will help you set up email sending for password reset OTP codes.

## Option 1: Gmail (Easiest for Development)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Enable 2-Factor Authentication

### Step 2: Generate App Password
1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Other (Custom name)"
3. Enter "Studyhub" as the name
4. Click "Generate"
5. Copy the 16-character password (no spaces)

### Step 3: Add to .env file
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

---

## Option 2: Custom SMTP (Works with any email provider)

### For Outlook/Hotmail:
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

### For Yahoo:
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
```

### For Custom SMTP (Most providers):
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
```

---

## Option 3: Professional Email Services (Recommended for Production)

### SendGrid (Free tier: 100 emails/day)
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create API Key
3. Add to .env:
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

### Resend (Free tier: 3,000 emails/month)
1. Sign up at [Resend](https://resend.com/)
2. Get API key
3. Update emailService.js to use Resend API (or use SMTP)

### AWS SES (Very cheap, pay per email)
1. Set up AWS SES
2. Verify email/domain
3. Use SMTP credentials

---

## Testing Email Configuration

After setting up your .env file, restart your backend server. You should see:
- ✅ `Email server is ready to send messages` - Configuration is correct
- ❌ Error message - Check your credentials

---

## Security Notes

1. **Never commit .env file** - It contains sensitive credentials
2. **Use App Passwords** - Don't use your main account password
3. **Rotate passwords** - Change email passwords regularly
4. **Use environment variables** - Always use .env for credentials

---

## Troubleshooting

### "Invalid login" error
- Check your email and password are correct
- For Gmail, make sure you're using an App Password, not your regular password
- Ensure 2FA is enabled for Gmail

### "Connection timeout"
- Check your SMTP host and port
- Some networks block SMTP ports (587, 465)
- Try using port 465 with SMTP_SECURE=true

### Emails going to spam
- Use a professional email service (SendGrid, Resend)
- Set up SPF and DKIM records for your domain
- Use a verified sender email

---

## Quick Start (Gmail)

1. Enable 2FA on your Google account
2. Generate App Password at https://myaccount.google.com/apppasswords
3. Add to `backend/.env`:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```
4. Restart backend server
5. Test password reset - check your email!

