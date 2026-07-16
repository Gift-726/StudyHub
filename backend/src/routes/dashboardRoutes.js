import express from 'express'
import { getDashboard, getAcademicSeason } from '../controllers/dashboardController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, getDashboard)
router.get('/academic-season', protect, getAcademicSeason)

export default router

