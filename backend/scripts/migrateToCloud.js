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

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Error: Cloudinary credentials are not set in environment variables.')
    process.exit(1)
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
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

      // Extract Session/Year (e.g., "2021/2022" or "2022-2023")
      const yearMatch = fileName.match(/(\d{4})[/-](\d{4})/ || /(\d{4})/)
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

      // Upload file to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(filePath, {
          resource_type: 'image', // Use 'image' for PDFs as Cloudinary treats them as document/image resources or 'raw'
          folder: 'studyhub_library',
          public_id: path.basename(fileName, '.pdf'),
        }, (error, result) => {
          if (error) {
            // Retry as 'raw' file type if image upload fails
            cloudinary.uploader.upload(filePath, {
              resource_type: 'raw',
              folder: 'studyhub_library',
            }, (rawError, rawResult) => {
              if (rawError) reject(rawError)
              else resolve(rawResult)
            })
          } else {
            resolve(result)
          }
        })
      })

      const fileUrl = uploadResult.secure_url
      console.log(`- Cloud URL: ${fileUrl}`)

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
  } finally {
    mongoose.connection.close()
  }
}

runMigration()
