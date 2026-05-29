import express from 'express'
import { protect } from '../middleware/auth.js'
import {
  markVideoComplete,
  updateWatchTime,
  trackVideoWatch,
  getCourseProgress
} from '../controllers/progressController.js'

const router = express.Router()

// All progress routes require authentication
router.use(protect)

router.post('/complete', markVideoComplete)
router.post('/watch-time', updateWatchTime)
router.post('/track', trackVideoWatch)
router.get('/course/:courseId', getCourseProgress)

export default router

