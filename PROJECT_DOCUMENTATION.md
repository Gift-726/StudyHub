# 📚 Studyhub - Complete Project Documentation

## Table of Contents
1. [Overview](#overview)
2. [Project Purpose](#project-purpose)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [Database Models](#database-models)
7. [API Endpoints](#api-endpoints)
8. [User Features](#user-features)
9. [Admin Features](#admin-features)
10. [Setup & Installation](#setup--installation)
11. [Environment Variables](#environment-variables)
12. [Authentication & Security](#authentication--security)
13. [YouTube Integration](#youtube-integration)
14. [Deployment](#deployment)
15. [Troubleshooting](#troubleshooting)

---

## Overview

**Studyhub** is a comprehensive full-stack web application designed to enhance academic performance for university students. It provides a centralized platform where students can access educational video content, track their learning progress, manage courses, and utilize academic tools like CGPA calculators.

The platform features a dual-interface system:
- **Student Interface**: For browsing courses, watching videos, tracking progress
- **Admin Interface**: For managing courses, importing YouTube playlists, uploading study materials

---

## Project Purpose

Studyhub aims to:
- **Centralize Learning Resources**: Provide a single platform for accessing course videos and materials
- **Track Academic Progress**: Monitor course completion, study hours, and learning milestones
- **Enhance Study Experience**: Offer tools like CGPA calculators and exam countdown timers
- **Support Lower Levels**: Special focus on 100L and 200L students with supplementary materials (PDF summaries, past questions)
- **Streamline Content Management**: Enable administrators to easily import and manage course content from YouTube

---

## Features

### 🎓 Student Features

1. **User Authentication**
   - Secure registration with email verification
   - Login with JWT-based authentication
   - Password reset via OTP (One-Time Password)
   - Protected routes for authenticated users

2. **Dashboard**
   - **Key Metrics Display**:
     - Courses Enrolled count
     - Overall Progress percentage
     - Total Study Hours
   - **Exam Countdown Timer**: Real-time countdown to semester exams (March 2, 2026) showing days, hours, minutes, and seconds
   - **Recently Watched**: Displays last 6 videos watched with course and topic information

3. **Courses Page**
   - Browse all available courses
   - Filter courses by status (All Courses, In Progress)
   - Sort courses by:
     - Alphabetical order
     - Progress percentage
     - Recent Activity
   - Course cards showing:
     - Course image
     - Title and description
     - Topics count
     - Progress bar
     - Last activity date
   - Enroll in new courses
   - Click course cards to view detailed course page

4. **Course Detail Page**
   - View course information
   - List of topics with videos
   - **YouTube Video Player**:
     - Embedded player (no redirect to YouTube)
     - Custom "Next Lesson" and "Previous Lesson" buttons
     - Related videos from same channel only (`rel=0`)
     - Minimal YouTube branding (`modestbranding=1`)
   - **Progress Tracking**:
     - Automatic tracking when video ends
     - Watch time recording
     - Completion percentage per course
   - **Study Materials** (for 100L/200L courses):
     - PDF summaries displayed below video
     - Past questions (FUTA Past Questions) available for download

5. **CGPA Calculator**
   - Add multiple courses with:
     - Course code
     - Credit units
     - Grade (A, B, C, D, E, F)
   - Calculate CGPA automatically
   - Mobile-friendly with auto-scroll to new inputs
   - Auto-scroll to results when calculated

6. **Quizzes Page** (Placeholder for future implementation)

7. **Forum Page** (Placeholder for future implementation)

### 👨‍💼 Admin Features

1. **Admin Authentication**
   - Separate login page (`/admin/login`)
   - Email and password-based authentication
   - Admin-specific routes protection
   - Separate admin sidebar (no access to user pages)

2. **Admin Dashboard**
   - **Manage Courses** (Top priority section):
     - View all courses
     - Create new courses
     - Edit existing courses
     - Delete courses
   - **Import YouTube Playlist**:
     - Select course from dropdown
     - Paste YouTube playlist URL
     - Enter topic title and description
     - Import all videos from playlist
     - Videos stored in database (avoids YouTube API quota exhaustion)
   - **Upload Study Materials**:
     - Select course and topic
     - Upload PDF summaries
     - Upload past questions (FUTA Past Questions)
     - Materials appear below video player for students

3. **Course Management**
   - Create courses with:
     - Title and description
     - Faculty and department
     - Level (100, 200, 300, 400, 500)
     - Instructor name
     - Course units
     - Course image
   - Collapsible "Create Course" section (hidden by default)

---

## Technology Stack

### Frontend
- **Framework**: React.js 19.2.3
- **Build Tool**: Vite 7.3.0
- **Routing**: React Router DOM 7.11.0
- **Styling**: Tailwind CSS 3.4.19
- **HTTP Client**: Axios 1.13.2
- **Forms**: React Hook Form 7.69.0
- **Notifications**: React Hot Toast 2.6.0
- **YouTube Integration**: YouTube IFrame Player API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose 9.0.2
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Hashing**: bcryptjs 3.0.3
- **Validation**: express-validator 7.3.1
- **File Uploads**: Multer 2.0.2
- **Email Service**: Nodemailer 6.10.1
- **YouTube API**: googleapis 169.0.0
- **Security**: Helmet 8.1.0, CORS 2.8.5
- **Rate Limiting**: express-rate-limit 8.2.1

### Database
- **Primary Database**: MongoDB Atlas (Cloud) or Local MongoDB
- **ODM**: Mongoose

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

---

## Project Structure

```
Studyhub/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminLayout.jsx          # Admin-specific layout with sidebar
│   │   │   ├── BrowseCourseCard.jsx     # Course card for browsing
│   │   │   ├── CountdownTimer.jsx        # Exam countdown component
│   │   │   ├── CourseCard.jsx            # Course card for enrolled courses
│   │   │   ├── CourseProgress.jsx       # Progress display component
│   │   │   ├── Layout.jsx                # User layout with sidebar
│   │   │   ├── MetricsCard.jsx           # Dashboard metrics card
│   │   │   └── YouTubePlayer.jsx         # YouTube video player component
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx        # Admin dashboard page
│   │   │   ├── AdminLogin.jsx            # Admin login page
│   │   │   ├── CGPACalculator.jsx        # CGPA calculator page
│   │   │   ├── CourseDetail.jsx          # Course detail with videos
│   │   │   ├── Courses.jsx               # Courses browsing page
│   │   │   ├── Dashboard.jsx             # User dashboard
│   │   │   ├── EnterOTP.jsx              # OTP verification page
│   │   │   ├── ForgotPassword.jsx        # Password reset request
│   │   │   ├── Forum.jsx                 # Forum page (placeholder)
│   │   │   ├── Login.jsx                 # User login page
│   │   │   ├── Quizzes.jsx               # Quizzes page (placeholder)
│   │   │   ├── ResetPassword.jsx        # Password reset page
│   │   │   └── SignUp.jsx                # User registration page
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # Authentication context provider
│   │   ├── services/
│   │   │   └── api.js                     # API service functions
│   │   ├── utils/
│   │   │   └── faculties.js               # Faculty and department data
│   │   ├── assets/                       # Images and icons
│   │   ├── App.jsx                       # Main app component with routes
│   │   ├── index.css                     # Global styles and Tailwind config
│   │   └── main.jsx                      # App entry point
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json                       # Vercel deployment config
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                     # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── adminController.js        # Admin operations
│   │   │   ├── authController.js        # Authentication logic
│   │   │   ├── courseController.js      # Course CRUD operations
│   │   │   ├── dashboardController.js    # Dashboard data
│   │   │   ├── passwordController.js     # Password reset logic
│   │   │   └── progressController.js      # Video progress tracking
│   │   ├── middleware/
│   │   │   ├── adminAuth.js              # Admin authentication middleware
│   │   │   ├── auth.js                   # User authentication middleware
│   │   │   └── errorHandler.js           # Error handling middleware
│   │   ├── models/
│   │   │   ├── Course.js                 # Course model
│   │   │   ├── Enrollment.js             # Course enrollment model
│   │   │   ├── OTP.js                    # OTP model for password reset
│   │   │   ├── StudySession.js           # Study session tracking
│   │   │   ├── Topic.js                  # Course topic model
│   │   │   ├── User.js                   # User model
│   │   │   └── VideoProgress.js          # Video progress tracking
│   │   ├── routes/
│   │   │   ├── adminRoutes.js            # Admin API routes
│   │   │   ├── authRoutes.js             # Authentication routes
│   │   │   ├── courseRoutes.js           # Course API routes
│   │   │   ├── dashboardRoutes.js        # Dashboard API routes
│   │   │   └── progressRoutes.js         # Progress tracking routes
│   │   ├── services/
│   │   │   └── youtubeService.js         # YouTube API integration
│   │   ├── utils/
│   │   │   └── emailService.js           # Email sending service
│   │   └── server.js                     # Express server setup
│   ├── scripts/
│   │   ├── testLogin.js                  # Test login script
│   │   ├── testLoginAPI.js               # Test login API script
│   │   ├── updateAdmin.js                # Update admin credentials
│   │   └── verifyAdmin.js                # Verify admin setup
│   ├── uploads/
│   │   └── materials/                    # Uploaded PDF files
│   └── package.json
│
├── assets/                               # Shared assets
├── ADMIN_SETUP.md                        # Admin setup guide
├── DEPLOYMENT.md                         # Deployment instructions
├── EMAIL_SETUP.md                        # Email service setup
├── PROJECT_DOCUMENTATION.md              # This file
├── QUICK_DEPLOY.md                       # Quick deployment guide
├── README.md                             # Basic project readme
├── SETUP.md                              # Setup instructions
└── render.yaml                           # Render deployment config
```

---

## Database Models

### User Model
```javascript
{
  email: String (required, unique, lowercase)
  password: String (required, min 6 chars, hashed with bcrypt)
  fullName: String (required)
  faculty: String (required)
  department: String (required)
  level: String (enum: '100', '200', '300', '400', '500')
  isAdmin: Boolean (default: false)
  createdAt: Date
}
```

### Course Model
```javascript
{
  title: String (required)
  description: String
  faculty: String (required)
  department: String (required)
  level: String (enum: '100', '200', '300', '400', '500', required)
  instructor: String
  topics: Number (default: 0)
  units: Number (default: 3)
  image: String
  createdAt: Date
}
```

### Topic Model
```javascript
{
  courseId: ObjectId (ref: Course)
  title: String (required)
  description: String
  videos: [{
    youtubeId: String (required)
    title: String (required)
    thumbnail: String
    duration: String
    order: Number
  }]
  materials: [{
    type: String (enum: 'summary', 'pastQuestion')
    filename: String
    originalName: String
    path: String
    uploadedAt: Date
  }]
  createdAt: Date
}
```

### Enrollment Model
```javascript
{
  userId: ObjectId (ref: User)
  courseId: ObjectId (ref: Course)
  progress: Number (0-100, default: 0)
  lastActivity: Date
  enrolledAt: Date
}
```

### VideoProgress Model
```javascript
{
  userId: ObjectId (ref: User)
  courseId: ObjectId (ref: Course)
  topicId: ObjectId (ref: Topic)
  videoId: String (YouTube video ID)
  completed: Boolean (default: false)
  watchTime: Number (seconds)
  lastWatchedAt: Date
  completedAt: Date
}
```

### StudySession Model
```javascript
{
  userId: ObjectId (ref: User)
  courseId: ObjectId (ref: Course)
  duration: Number (minutes)
  startedAt: Date
  endedAt: Date
}
```

### OTP Model
```javascript
{
  email: String (required)
  otp: String (6 digits, required)
  expiresAt: Date (15 minutes from creation)
  used: Boolean (default: false)
}
```

---

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| GET | `/me` | Get current user | Yes |
| POST | `/forgot-password` | Request password reset OTP | No |
| POST | `/verify-otp` | Verify OTP for password reset | No |
| POST | `/reset-password` | Reset password with token | No |

### Course Routes (`/api/courses`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all courses | Yes |
| GET | `/browse` | Browse all available courses | Yes |
| GET | `/enrolled` | Get enrolled courses | Yes |
| GET | `/:courseId` | Get course details | Yes |
| POST | `/:courseId/enroll` | Enroll in course | Yes |
| GET | `/:courseId/topics` | Get course topics | Yes |

### Dashboard Routes (`/api/dashboard`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get dashboard data | Yes |

### Progress Routes (`/api/progress`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/video/complete` | Mark video as completed | Yes |
| POST | `/video/progress` | Update video watch progress | Yes |
| GET | `/course/:courseId` | Get course progress | Yes |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/login` | Admin login | No (but admin email required) |
| POST | `/courses` | Create new course | Yes (Admin) |
| PUT | `/courses/:courseId` | Update course | Yes (Admin) |
| DELETE | `/courses/:courseId` | Delete course | Yes (Admin) |
| POST | `/courses/:courseId/topics` | Create topic | Yes (Admin) |
| POST | `/topics/:topicId/import-playlist` | Import YouTube playlist | Yes (Admin) |
| POST | `/topics/:topicId/upload-material` | Upload study material | Yes (Admin) |
| GET | `/courses` | Get all courses (admin view) | Yes (Admin) |
| GET | `/courses/:courseId/topics` | Get course topics (admin) | Yes (Admin) |

---

## User Features

### Registration & Login
1. **Sign Up**:
   - Full name, email, password
   - Faculty and department selection
   - Level selection (100-500)
   - Email validation
   - Password minimum 6 characters

2. **Login**:
   - Email and password authentication
   - JWT token generation
   - Automatic redirect to dashboard

3. **Password Reset**:
   - Request OTP via email
   - Verify OTP (6 digits)
   - Reset password with token

### Dashboard
- **Metrics Cards**: Courses Enrolled, Overall Progress, Study Hours
- **Exam Countdown**: Real-time countdown to March 2, 2026
- **Recently Watched**: Last 6 videos with course and topic info

### Courses
- Browse all courses
- Filter by status (All, In Progress)
- Sort by Alphabetical, Progress, Recent Activity
- Enroll in courses
- View course details with topics and videos

### Video Learning
- Embedded YouTube player (no redirect)
- Next/Previous lesson navigation
- Automatic progress tracking
- Completion detection when video ends
- Study materials for 100L/200L courses

### CGPA Calculator
- Add multiple courses
- Calculate CGPA automatically
- Mobile-friendly with auto-scroll

---

## Admin Features

### Admin Login
- Separate login page at `/admin/login`
- Email and password authentication
- Must match `ADMIN_EMAIL` in environment variables

### Course Management
1. **Create Course**:
   - Title, description
   - Faculty, department, level
   - Instructor name
   - Course units
   - Course image

2. **Manage Courses**:
   - View all courses
   - Edit course details
   - Delete courses

### YouTube Playlist Import
1. Select course from dropdown
2. Paste YouTube playlist URL
3. Enter topic title and description
4. Import all videos
5. Videos stored in database (saves API quota)

### Study Materials Upload
1. Select course and topic
2. Upload PDF summaries
3. Upload past questions
4. Materials appear below video for students

---

## Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- YouTube Data API v3 key (for admin features)
- Gmail App Password (for email service)

### Step 1: Clone Repository
```bash
git clone https://github.com/Gift-726/StudyHub.git
cd Studyhub
```

### Step 2: Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd ../backend
npm install
```

### Step 3: Environment Variables

See [Environment Variables](#environment-variables) section below.

### Step 4: Start Development Servers

**Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173` (Vite default port)

---

## Environment Variables

### Backend (.env)
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/studyhub
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/studyhub

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Admin Configuration
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-secure-admin-password

# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key_here

# Email Service (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### Frontend (.env)
```env
# API URL
VITE_API_URL=http://localhost:5000/api

# Admin Email (must match backend ADMIN_EMAIL)
VITE_ADMIN_EMAIL=your-admin-email@example.com
```

### Getting YouTube API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "YouTube Data API v3"
4. Create credentials (API Key)
5. Copy API key to `backend/.env`

### Getting Gmail App Password
1. Go to Google Account settings
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate app password for "Mail"
5. Copy password to `backend/.env` as `EMAIL_PASS`

---

## Authentication & Security

### User Authentication
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt with 12 salt rounds
- **Protected Routes**: Middleware checks for valid JWT
- **Token Expiration**: Tokens expire after 7 days

### Admin Authentication
- **Email-based**: Admin must use specific email from `ADMIN_EMAIL`
- **Password Verification**: Same password hashing as users
- **Separate Middleware**: `adminAuth.js` checks admin status
- **Route Protection**: Admin routes only accessible to admins

### Security Features
- **Helmet.js**: Security headers
- **CORS**: Configured for frontend origin
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: express-validator for all inputs
- **Password Requirements**: Minimum 6 characters

---

## YouTube Integration

### How It Works
1. **Admin Imports Playlist**:
   - Admin pastes YouTube playlist URL
   - Backend fetches playlist using YouTube Data API v3
   - Videos stored in database (ID, title, thumbnail)

2. **Student Views Video**:
   - Frontend loads video from database (no API call)
   - YouTube IFrame Player API embeds video
   - Video plays within app (no redirect)

3. **Progress Tracking**:
   - `onStateChange` listener detects video end
   - Backend marks video as completed
   - Progress percentage calculated

### YouTube Player Configuration
- `rel=0`: Related videos from same channel only
- `modestbranding=1`: Minimal YouTube branding
- `controls=1`: Show player controls
- `autoplay=0`: No autoplay

### API Quota Management
- Playlist import uses ~1-2 API units
- Videos stored in database
- Students don't use API quota
- Daily quota: 10,000 units (default)

---

## Deployment

### Frontend (Vercel)
1. Connect GitHub repository
2. Set root directory to `frontend`
3. Framework preset: Vite
4. Add environment variables:
   - `VITE_API_URL`: Backend URL
   - `VITE_ADMIN_EMAIL`: Admin email
5. Deploy

### Backend (Render)
1. Connect GitHub repository
2. Service type: Web Service
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables (see [Environment Variables](#environment-variables))
7. Deploy

### Database (MongoDB Atlas)
1. Create free cluster
2. Get connection string
3. Whitelist IP addresses (or allow all for development)
4. Add connection string to backend `.env`

For detailed deployment instructions, see:
- `DEPLOYMENT.md` - Full deployment guide
- `QUICK_DEPLOY.md` - Quick 15-minute guide

---

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check `MONGODB_URI` in `.env`
   - Verify IP whitelist in MongoDB Atlas
   - Ensure database name is correct

2. **Admin Login Not Working**
   - Verify `ADMIN_EMAIL` matches in both frontend and backend `.env`
   - Run `npm run update-admin` in backend
   - Check email format (no normalization)

3. **YouTube API Errors**
   - Verify API key is correct
   - Check API quota in Google Cloud Console
   - Ensure YouTube Data API v3 is enabled

4. **Email Not Sending**
   - Verify Gmail App Password (not regular password)
   - Check 2-Step Verification is enabled
   - Verify email credentials in `.env`

5. **Frontend Build Errors**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm cache clean --force`
   - Run `npm install` again

6. **esbuild Platform Error**
   - Delete `frontend/node_modules`
   - Delete `frontend/package-lock.json`
   - Run `npm install` in frontend directory

### Getting Help
- Check error messages in browser console
- Check backend logs in terminal
- Verify all environment variables are set
- Ensure all dependencies are installed

---

## Future Enhancements

Planned features for future development:
- [ ] Quiz system with questions and answers
- [ ] Forum/Discussion board
- [ ] User profiles and settings
- [ ] Notifications system
- [ ] Study groups
- [ ] Achievement badges
- [ ] Study reminders
- [ ] Mobile app (React Native)

---

## License

ISC

---

## Contact & Support

For issues, questions, or contributions:
- GitHub Repository: https://github.com/Gift-726/StudyHub
- Create an issue on GitHub for bug reports
- Pull requests welcome for contributions

---

**Last Updated**: January 2025
**Version**: 1.0.0
