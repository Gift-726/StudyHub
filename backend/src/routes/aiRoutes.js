import express from 'express'
import { askStudyBuddy } from '../controllers/aiController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Mount AI queries
router.post('/ask', protect, askStudyBuddy)

export default router
