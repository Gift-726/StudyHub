import express from 'express'
import { askStudyBuddy } from '../controllers/aiController.js'

const router = express.Router()

// Mount AI queries
router.post('/ask', askStudyBuddy)

export default router
