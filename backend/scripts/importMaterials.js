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

// Check if we want to force local storage run
const forceLocal = process.argv.includes('--local')

// Check if we want to run in Cloudinary production mode
const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim()
const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim()
const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim()

const useCloudinary = !forceLocal && (process.argv.includes('--cloudinary') || (cloudName && apiKey && apiSecret))

let cloudinary;
if (useCloudinary) {
  try {
    const cloudinaryModule = await import('cloudinary')
    cloudinary = cloudinaryModule.v2
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    })
    console.log('☁️  Cloudinary configuration detected. Script will run in CLOUD migration mode.')
  } catch (err) {
    console.error('Error loading Cloudinary module. Run "npm install cloudinary" inside backend directory.')
    process.exit(1)
  }
} else {
  console.log('💻 Local configuration detected. Script will copy files LOCALLY to uploads/library/.')
}

// Find all PDF files recursively
const getPdfFilesRecursively = (dir, fileList = []) => {
  const files = fs.readdirSync(dir)
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      getPdfFilesRecursively(filePath, fileList)
    } else if (file.toLowerCase().endsWith('.pdf')) {
      fileList.push({
        filePath,
        fileName: file,
        parentDirName: path.basename(dir)
      })
    }
  })
  return fileList
}

const runImport = async () => {
  const dbUri = process.env.MONGODB_URI

  if (!dbUri) {
    console.error('Error: MONGODB_URI is not set in environment variables.')
    process.exit(1)
  }

  const importFolderPath = path.join(__dirname, '../import-temp')

  if (!fs.existsSync(importFolderPath)) {
    console.error(`Error: Import folder not found at: ${importFolderPath}`)
    process.exit(1)
  }

  try {
    console.log('Connecting to database...')
    await mongoose.connect(dbUri)
    console.log('Database connected successfully.')

    const allPdfs = getPdfFilesRecursively(importFolderPath)
    if (allPdfs.length === 0) {
      console.log('No PDF files found in the import-temp subdirectories.')
      mongoose.connection.close()
      process.exit(0)
    }

    console.log(`Found ${allPdfs.length} PDF files to import. starting process...\n`)

    // Create local uploads directory if running in local mode
    const localUploadPath = path.join(__dirname, '../uploads/library')
    if (!useCloudinary && !fs.existsSync(localUploadPath)) {
      fs.mkdirSync(localUploadPath, { recursive: true })
    }

    for (let i = 0; i < allPdfs.length; i++) {
      const { filePath, fileName, parentDirName } = allPdfs[i]
      
      // Parse Course Code
      let courseCode = ''
      const courseMatch = fileName.match(/([A-Z]{3})\s*(\d{3})/i)
      if (courseMatch) {
        courseCode = `${courseMatch[1].toUpperCase()} ${courseMatch[2]}`
      } else {
        // Fallback to parent directory name if it looks like a course code
        const parentMatch = parentDirName.match(/([A-Z]{3})\s*(\d{3})/i)
        if (parentMatch) {
          courseCode = `${parentMatch[1].toUpperCase()} ${parentMatch[2]}`
        } else {
          courseCode = 'GENERAL'
        }
      }

      // Parse Session
      let yearRange = '2023/2024'
      const yearMatch = fileName.match(/(\d{4})[/-](\d{4})/)
      if (yearMatch) {
        yearRange = yearMatch[0]
      }

      // Clean Title
      const cleanTitle = fileName
        .replace(/\.pdf$/i, '')
        .replace(/[_-]/g, ' ')
        .trim()

      const fileStats = fs.statSync(filePath)
      const fileSizeMb = (fileStats.size / (1024 * 1024)).toFixed(1) + ' MB'

      console.log(`[${i + 1}/${allPdfs.length}] Processing: ${fileName}`)
      console.log(`  - Course: ${courseCode} | Year: ${yearRange} | Size: ${fileSizeMb}`)

      let fileUrl = ''

      if (useCloudinary) {
        // --- CLOUDINARY MODE ---
        console.log('  - Uploading to Cloudinary...')
        try {
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
          fileUrl = uploadResult.secure_url
          console.log(`  - Cloud URL: ${fileUrl}`)
        } catch (uploadErr) {
          console.error(`  ❌ Cloudinary upload failed for ${fileName}:`, uploadErr.message)
          continue // skip this file
        }
      } else {
        // --- LOCAL MODE ---
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const localFileName = `library-${uniqueSuffix}.pdf`
        const destinationPath = path.join(localUploadPath, localFileName)
        
        fs.copyFileSync(filePath, destinationPath)
        fileUrl = `/uploads/library/${localFileName}`
        console.log(`  - Saved locally to: ${fileUrl}`)
      }

      // Save to database
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

      console.log('  ✓ Registered in Database.')
    }

    console.log('\n=============================================')
    console.log('🎉 Import process completed successfully!')
    if (useCloudinary) {
      console.log('All files are permanently hosted on Cloudinary.');
      console.log('You can now safely delete the local import-temp folder.');
    } else {
      console.log('All files are copied to backend/uploads/library/ and registered.');
      console.log('Keep the uploads folder, but you can clean/delete import-temp folder now.');
    }
    console.log('=============================================')

  } catch (error) {
    console.error('Import failed with error:', error)
  } finally {
    mongoose.connection.close()
  }
}

runImport()
