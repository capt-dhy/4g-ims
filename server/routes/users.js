const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { authenticate, requireRole } = require('../middleware/auth')

// GET /api/users — all users (superadmin only)
router.get('/', authenticate, requireRole('superadmin'), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/users — create a user (superadmin only)
router.post('/', authenticate, requireRole('superadmin'), async (req, res) => {
  try {
    const { email, password, fullName, role, companyCode } = req.body
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'email, password and role are required' })
    }
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'Email already in use' })

    const user = new User({ email, password, fullName, role, companyCode: companyCode || null })
    await user.save()
    res.status(201).json(user)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PATCH /api/users/:id/role — change role (superadmin only)
router.patch('/:id/role', authenticate, requireRole('superadmin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/users/:id — delete a user (superadmin only)
router.delete('/:id', authenticate, requireRole('superadmin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
