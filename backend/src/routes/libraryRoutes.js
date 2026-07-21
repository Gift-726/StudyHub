import express from 'express'
import { getMaterials, contributeMaterial, downloadMaterial, upload } from '../controllers/libraryController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getMaterials)
router.post('/upload', protect, upload.single('file'), contributeMaterial)
router.get('/download/:filename', downloadMaterial)

export default router
