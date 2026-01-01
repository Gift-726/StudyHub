import express from 'express'
import { protect } from '../middleware/auth.js'
import { adminAuth } from '../middleware/adminAuth.js'
import { 
  importPlaylist, 
  uploadMaterial, 
  getAllCoursesAdmin,
  getCourseDetailsAdmin,
  deleteTopic,
  createCourse,
  upload 
} from '../controllers/adminController.js'

const router = express.Router()

// All admin routes require authentication and admin access
router.use(protect)
router.use(adminAuth)

router.get('/courses', getAllCoursesAdmin)
router.get('/courses/:courseId', getCourseDetailsAdmin)
router.post('/courses', createCourse)
router.post('/import-playlist', importPlaylist)
router.post('/upload-material', upload.single('file'), uploadMaterial)
router.delete('/topics/:topicId', deleteTopic)

export default router

