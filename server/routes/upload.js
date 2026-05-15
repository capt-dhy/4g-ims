const express = require('express')
const router = express.Router()
const multer = require('multer')
const cloudinary = require('../lib/cloudinary')
const { authenticate } = require('../middleware/auth')

// Use memory storage for multer
const storage = multer.memoryStorage()
const upload = multer({ storage })

// POST /api/upload
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Convert buffer to base64
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: 'ims-products',
      resource_type: 'auto'
    })

    res.json({
      url: result.secure_url,
      publicId: result.public_id
    })
  } catch (err) {
    console.error('Cloudinary upload error:', err)
    res.status(500).json({ error: 'Failed to upload image to Cloudinary' })
  }
})

module.exports = router
