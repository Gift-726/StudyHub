import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

console.log('Keys in process.env:')
for (const key of Object.keys(process.env)) {
  if (key.includes('CLIENT')) {
    console.log(`- "${key}": "${process.env[key]}"`)
  }
}
process.exit(0)
