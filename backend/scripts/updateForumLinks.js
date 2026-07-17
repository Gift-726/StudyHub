import dotenv from 'dotenv'
import connectDB from '../src/config/db.js'
import Course from '../src/models/Course.js'

dotenv.config({ path: './.env' })

const WHATSAPP_COMMUNITIES = [
  // 100 Level
  { codes: ['MTS 101', 'MTH 101'], url: 'https://chat.whatsapp.com/Ln49AvJ1Syj9thS68mNECn' },
  { codes: ['CHE 101', 'CHM 101'], url: 'https://chat.whatsapp.com/HiYWZ7OfcLo5Zn5INp8ZfB' },
  { codes: ['PHY 101'], url: 'https://chat.whatsapp.com/LdXHvcywPBrJ7mPnBCil1n' },
  { codes: ['BIO 101'], url: 'https://chat.whatsapp.com/Bx6WPLgpyttFy8FdkiDGsa' },
  { codes: ['MEE 101'], url: 'https://chat.whatsapp.com/L1wK2sMqjhx8KEQ8ZdNKBi' },
  { codes: ['PHY 103'], url: 'https://chat.whatsapp.com/GHPK2DOGPSjA3SgiSiyxuS' },
  { codes: ['MTS 102', 'MTH 102'], url: 'https://chat.whatsapp.com/CqLxxVhcjTqByflvcRxteW' },
  { codes: ['PHY 102'], url: 'https://chat.whatsapp.com/J6ju7FF5wEw0YKmRGEKOJS' },
  { codes: ['MTS 104', 'MTH 104'], url: 'https://chat.whatsapp.com/CoVAq4UMuK851YKcuvEe6y' },
  { codes: ['CHE 102', 'CHM 102'], url: 'https://chat.whatsapp.com/BxsnVsyZGet2GAlVSvt9oC' },
  { codes: ['BIO 102'], url: 'https://chat.whatsapp.com/C6KdaTbaQihFrgkYMrYTvQ' },

  // 200 Level
  { codes: ['MTS 201', 'MTH 201'], url: 'https://chat.whatsapp.com/LXRDw6qeH2iHmdHEXT4YL6' },
  { codes: ['BCH 201'], url: 'https://chat.whatsapp.com/Kb8Bj8Dcfp70kvnhM3ihpL' },
  { codes: ['CHE 203', 'CHM 203'], url: 'https://chat.whatsapp.com/CQjjutIciGk9nikUtn4CMm' },
  { codes: ['CHE 205', 'CHM 205'], url: 'https://chat.whatsapp.com/FmcKfiUPjCc1xOPQNxT2mu' },
  { codes: ['MEE 207'], url: 'https://chat.whatsapp.com/LQuIVGMX4cyFv1FOisUIOx' },
  { codes: ['ANA 203'], url: 'https://chat.whatsapp.com/CHUQh2rN65V4QKFMyGDe1J' },
  { codes: ['MTS 202', 'MTH 202'], url: 'https://chat.whatsapp.com/LMv68agvlYdDfkBmDIhNo0' },
  { codes: ['CHE 202', 'CHM 202'], url: 'https://chat.whatsapp.com/FznZsAiS6DM3SuwuUdtwZF' },
  { codes: ['STA 122', 'STA 224', 'STA 122/224'], url: 'https://chat.whatsapp.com/KSysFmYL8tk3FzXctGMpCB' },
  { codes: ['MEE 206'], url: 'https://chat.whatsapp.com/E7olijsQflb8CDybvCetgg' },

  // 300 Level
  { codes: ['MTS 315', 'MTH 315'], url: 'https://chat.whatsapp.com/ElR3pOnNGN10oeGAWA1rC7' },
  { codes: ['CHE 303', 'CHM 303'], url: 'https://chat.whatsapp.com/DQW9TEJq96o8Ric4Wtxscs' },
  { codes: ['CHE 315', 'CHM 315'], url: 'https://chat.whatsapp.com/G8y5C7UbVYi8mukJmgC4hv' },
  { codes: ['MTS 316', 'MTH 316'], url: 'https://chat.whatsapp.com/E3neA0Zweoo3OyAYrZ76uv' }
]

const run = async () => {
  try {
    await connectDB()
    console.log('Successfully connected to MongoDB')

    const courses = await Course.find({})
    console.log(`Found ${courses.length} courses in the database. Updating WhatsApp links...`)

    let updatedCount = 0

    for (const course of courses) {
      // Find matching configuration by checking if course title starts with any of our codes
      const match = WHATSAPP_COMMUNITIES.find(item => 
        item.codes.some(code => {
          const regex = new RegExp(`^${code.replace(/\s+/g, '\\s*')}\\b`, 'i')
          return regex.test(course.title)
        })
      )

      if (match) {
        console.log(`Matching Course: "${course.title}" -> WhatsApp Link: ${match.url}`)
        
        // Remove existing WhatsApp links to prevent duplicates
        course.forumLinks = course.forumLinks.filter(link => link.platform !== 'WhatsApp')

        // Add the new WhatsApp link
        course.forumLinks.push({
          title: `${course.title.split('-')[0].trim()} WhatsApp Community`,
          url: match.url,
          platform: 'WhatsApp',
          description: `Official WhatsApp community group for ${course.title.split('-')[0].trim()} discussions and updates.`
        })

        await course.save()
        updatedCount++
      } else {
        console.log(`No WhatsApp community link matched for: "${course.title}"`)
      }
    }

    console.log(`\n🎉 DONE! Successfully updated ${updatedCount} courses with WhatsApp community links.`)
    process.exit(0)
  } catch (error) {
    console.error('Failed to update forum links:', error)
    process.exit(1)
  }
}

run()
