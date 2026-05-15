const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./models/User')
require('dotenv').config({ path: '../.env' })

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB for seeding')

    const superadminEmail = 'dawoodhassan055@gmail.com'
    const existing = await User.findOne({ email: superadminEmail })

    if (existing) {
      console.log('ℹ️ Superadmin already exists. Updating role to superadmin...')
      existing.role = 'superadmin'
      existing.companyCode = 'GLOBAL'
      await existing.save()
    } else {
      console.log('🌱 Creating new Superadmin account...')
      const superadmin = new User({
        fullName: 'Dawood Hassan',
        email: superadminEmail,
        password: 'admin123', // Standard initial password
        role: 'superadmin',
        companyCode: 'GLOBAL'
      })
      await superadmin.save()
      console.log('✅ Superadmin created successfully!')
      console.log('📧 Email: dawoodhassan055@gmail.com')
      console.log('🔑 Password: admin123')
    }

    console.log('🚀 Seeding complete!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding error:', err.message)
    process.exit(1)
  }
}

seed()
