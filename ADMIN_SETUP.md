# Admin Setup Guide

## Environment Variables

### Backend (.env)

Add these to your `backend/.env` file:

```env
# Existing variables...
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/studyhub
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:3000

# Admin Configuration
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-secure-admin-password

# YouTube API Configuration
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### Frontend (.env)

Add this to your `frontend/.env` file:

```env
# Existing variables...
VITE_API_URL=http://localhost:5000/api

# Admin Configuration (must match backend ADMIN_EMAIL)
VITE_ADMIN_EMAIL=your-admin-email@example.com
```

## Getting YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "YouTube Data API v3"
4. Create credentials (API Key)
5. Copy the API key and add it to `backend/.env`

**Important:** 
- The API key has a daily quota (10,000 units)
- Each playlist import uses ~1-2 units
- Videos are stored in your database, so students don't use quota

## Admin Access

1. **Create Admin Account:**
   - Register a new account with the email you set in `ADMIN_EMAIL`
   - Use the password you set in `ADMIN_PASSWORD`
   - Or update an existing user's email to match `ADMIN_EMAIL`

2. **Login:**
   - Go to `/admin/login`
   - Use your admin email and password
   - You'll be redirected to `/admin/dashboard`

## Admin Dashboard Features

### Import YouTube Playlist

1. Select a course from the dropdown
2. Paste YouTube playlist URL (e.g., `https://www.youtube.com/playlist?list=PL...`)
3. Enter topic title (e.g., "Introduction to Algebra")
4. Optionally add topic description
5. Click "Import Playlist"
6. All videos from the playlist will be imported and stored in your database

### Upload Study Materials

1. First, select a course to view its topics
2. Select a topic from the dropdown
3. Choose material type (PDF, Past Question, or Note)
4. Enter a title
5. Upload PDF file (max 10MB)
6. Click "Upload Material"

### Manage Courses

- View all courses
- Select a course to see its topics
- Delete topics (this removes all videos and materials in that topic)

## File Storage

Uploaded PDFs are stored in `backend/uploads/materials/` directory.

**For Production:**
- Consider using cloud storage (AWS S3, Cloudinary, etc.)
- Update the `uploadMaterial` function in `backend/src/controllers/adminController.js`

## Security Notes

- Admin access is restricted to the email specified in `ADMIN_EMAIL`
- The admin password should match `ADMIN_PASSWORD` (for login)
- In production, consider implementing more robust admin authentication
- Keep your YouTube API key secure and never commit it to version control

