import express from 'express'
import { protect } from '../middleware/auth.js'
import { adminAuth } from '../middleware/adminAuth.js'
import { 
  courseAdminLogin,
  generateCourseAccessToken,
  getMyAdminCourses,
  getMyCourseDetails,
  importPlaylist,
  importSingleVideo,
  uploadMaterial,
  addForumLink,
  updateForumLink,
  deleteForumLink,
  updateCourse,
  upload
} from '../controllers/courseAdminController.js'

const router = express.Router()

// Public route - no auth needed for login
router.post('/login', courseAdminLogin)

// Protected routes - require authentication
router.use(protect)

// Get courses where user is admin
router.get('/my-courses', getMyAdminCourses)

// Get course details (with permission check)
router.get('/courses/:courseId', getMyCourseDetails)

// Update course information
router.put('/courses/:courseId', updateCourse)

// Import videos and materials
router.post('/import-playlist', importPlaylist)
router.post('/import-video', importSingleVideo)
router.post('/upload-material', upload.single('file'), uploadMaterial)

// Forum links management
router.post('/courses/:courseId/forum-links', addForumLink)
router.put('/courses/:courseId/forum-links/:linkId', updateForumLink)
router.delete('/courses/:courseId/forum-links/:linkId', deleteForumLink)

// Super admin only - generate tokens
router.post('/generate-token', adminAuth, generateCourseAccessToken)

export default router
