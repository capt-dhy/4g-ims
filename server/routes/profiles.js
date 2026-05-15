const express = require('express')
const router = express.Router()
const { authenticate } = require('../middleware/auth')

// GET /api/me
router.get('/', authenticate, async (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    fullName: req.user.fullName,
    role: req.user.role,
    companyCode: req.user.companyCode,
    createdAt: req.user.createdAt
  })
})

module.exports = router
