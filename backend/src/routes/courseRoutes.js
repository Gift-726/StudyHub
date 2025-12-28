import express from 'express'
import { getMyCourses, getAllCourses, enrollCourse } from '../controllers/courseController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// All routes are protected
router.get('/my-courses', protect, getMyCourses)
router.get('/', protect, getAllCourses)
router.post('/:courseId/enroll', protect, enrollCourse)

export default router

