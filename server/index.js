require('dotenv').config({ path: '../.env' })
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')

// Routes
const authRouter = require('./routes/auth')
const teamRouter = require('./routes/team')
const usersRouter = require('./routes/users')
const productsRouter = require('./routes/products')
const activityRouter = require('./routes/activity')
const profilesRouter = require('./routes/profiles')
const uploadRouter = require('./routes/upload')

const app = express()
const PORT = process.env.PORT || 5000

// Production Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Required for Cloudinary images to load
}))

app.use(cors({
  origin: true, // Allow all origins
  credentials: true
}))

app.use(express.json())

// Health Check for Render
app.get('/', (req, res) => {
  res.json({ 
    status: 'online', 
    service: '4G-IMS API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  })
})

// API Routes
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/team', teamRouter)
app.use('/api/products', productsRouter)
app.use('/api/activity', activityRouter)
app.use('/api/profiles', profilesRouter)
app.use('/api/upload', uploadRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// Connect to MongoDB and Start Server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas')
    app.listen(PORT, () => {
      console.log(`✅ 4G-IMS Express API running on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err)
  })
