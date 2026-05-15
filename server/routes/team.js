const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { authenticate, requireRole } = require('../middleware/auth')

// GET /api/team — list staff in Admin's company
router.get('/', authenticate, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const members = await User.find({ companyCode: req.user.companyCode }).sort({ createdAt: -1 })
    res.json(members)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/team — create staff for Admin's company
router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { email, password, fullName } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' })

    if (!req.user.companyCode) {
      return res.status(400).json({ error: 'Your account has no company code. Contact a Superadmin.' })
    }

    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'Email already in use' })

    const staff = new User({
      email,
      password,
      fullName,
      role: 'staff',
      companyCode: req.user.companyCode // Always scoped to Admin's company
    })
    await staff.save()
    res.status(201).json(staff)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/team/:id — remove staff (admin only, same company)
router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const target = await User.findById(req.params.id)
    if (!target) return res.status(404).json({ error: 'User not found' })
    if (target.companyCode !== req.user.companyCode) {
      return res.status(403).json({ error: 'You can only remove members of your own company.' })
    }
    if (target.role === 'admin' || target.role === 'superadmin') {
      return res.status(403).json({ error: 'Cannot remove Admins or Superadmins.' })
    }
    await User.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
