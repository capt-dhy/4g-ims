const express = require('express')
const router = express.Router()
const ActivityLog = require('../models/ActivityLog')
const { authenticate } = require('../middleware/auth')

// GET /api/activity
router.get('/', authenticate, async (req, res) => {
  try {
    let query = {}
    if (req.user.role !== 'superadmin') {
      query.companyCode = req.user.companyCode
    }
    const logs = await ActivityLog.find(query)
      .populate('user', 'fullName role')
      .sort({ createdAt: -1 })
      .limit(50)
    res.json(logs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/activity
router.post('/', authenticate, async (req, res) => {
  try {
    const { action, target } = req.body
    if (!action || !target) return res.status(400).json({ error: 'action and target are required' })
    const log = await ActivityLog.create({ user: req.user._id, action, target, companyCode: req.user.companyCode })
    res.status(201).json(log)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
