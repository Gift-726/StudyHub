import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import Material from '../src/models/Material.js'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Cloudinary setup (using dynamic import to allow running even if not installed yet)
let cloudinaryModule;
try {
  cloudinaryModule = await import('cloudinary')
} catch (err) {
  console.warn('Cloudinary package not installed. Run "npm install cloudinary" inside backend directory.')
}

const runMigration = async () => {
  if (!cloudinaryModule) {
    console.error('Migration aborted: Please install cloudinary dependency first using "npm install cloudinary".')
    process.exit(1)
  }

  const cloudinary = cloudinaryModule.v2
  const dbUri = process.env.MONGODB_URI

  if (!dbUri) {
    console.error('Error: MONGODB_URI is not set in environment variables.')
    process.exit(1)
  }

  const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim()
  const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim()
  const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim()

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Error: Cloudinary credentials are not set in environment variables.')
    process.exit(1)
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  })

  // Folder containing your downloaded Google Drive files
  const importFolderPath = path.join(__dirname, '../import-temp')

  if (!fs.existsSync(importFolderPath)) {
    console.error(`Error: Import folder not found at: ${importFolderPath}`)
    console.log('Please create the "import-temp" folder inside your backend/ directory and put your PDFs there.')
    process.exit(1)
  }

  try {
    console.log('Connecting to database...')
    await mongoose.connect(dbUri)
    console.log('Database connected successfully.')

    const files = fs.readdirSync(importFolderPath).filter(file => file.endsWith('.pdf'))
    if (files.length === 0) {
      console.log('No PDF files found in the import-temp folder.')
      mongoose.connection.close()
      process.exit(0)
    }

    console.log(`Found ${files.length} PDF files to upload. Starting migration...`)

    for (let i = 0; i < files.length; i++) {
      const fileName = files[i]
      const filePath = path.join(importFolderPath, fileName)
      
      console.log(`\n[${i + 1}/${files.length}] Processing file: ${fileName}`)

      // Extract Course Code (e.g., "MTH 101" or "MTS102")
      const courseMatch = fileName.match(/([A-Z]{3})\s*(\d{3})/i)
      const courseCode = courseMatch ? `${courseMatch[1].toUpperCase()} ${courseMatch[2]}` : 'GENERAL'

      // Extract Session/Year (e.g., "2021/2022" or "2022-2023" or "2022")
      let yearMatch = fileName.match(/(\d{4})[/-](\d{4})/)
      if (!yearMatch) {
        yearMatch = fileName.match(/\d{4}/)
      }
      const yearRange = yearMatch ? yearMatch[0] : '2023/2024'

      // Clean up title (remove extension and replace underscores/dashes)
      const cleanTitle = fileName
        .replace(/\.pdf$/i, '')
        .replace(/[_-]/g, ' ')
        .trim()

      const fileStats = fs.statSync(filePath)
      const fileSizeMb = (fileStats.size / (1024 * 1024)).toFixed(1) + ' MB'

      console.log(`- Course Code: ${courseCode}`)
      console.log(`- Title: ${cleanTitle}`)
      console.log(`- Session: ${yearRange}`)
      console.log(`- Size: ${fileSizeMb}`)
      console.log('- Uploading to Cloudinary...')

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(filePath, {
          resource_type: 'raw', // always treat PDFs as raw documents
          folder: 'studyhub_library',
          public_id: path.basename(fileName, '.pdf').replace(/[^a-zA-Z0-9]/g, '_'),
        }, (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        })
      })

      const fileUrl = uploadResult.secure_url
      console.log(`- Cloud URL: ${fileUrl}`)

      // Check if material already exists in DB
      const existingMaterial = await Material.findOne({
        $or: [
          { fileUrl },
          { courseCode, title: cleanTitle }
        ]
      })

      if (existingMaterial) {
        console.log(`- Material already exists: "${cleanTitle}". Skipping DB registration.`)
        continue
      }

      // Create record in MongoDB
      await Material.create({
        courseCode,
        title: cleanTitle,
        yearRange,
        type: cleanTitle.toLowerCase().includes('quiz') || cleanTitle.toLowerCase().includes('exam') || cleanTitle.toLowerCase().includes('past') ? 'past-question' : 'summary',
        description: `Imported resource library material for ${courseCode}.`,
        fileUrl,
        fileSize: fileSizeMb,
        uploader: 'StudyHub Admin'
      })

      console.log('✓ Successfully uploaded and registered.')
    }

    console.log('\n=============================================')
    console.log('🎉 Migration completed successfully!')
    console.log('All files are now uploaded to Cloudinary and seeded in your database.')
    console.log('You can now safely delete the local files and Google Drive files.')
    console.log('=============================================')

  } catch (error) {
    console.error('Migration failed with error:', error)
    process.exitCode = 1
  } finally {
    mongoose.connection.close()
  }
}

runMigration()
