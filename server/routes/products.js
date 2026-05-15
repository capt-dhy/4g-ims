const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const ActivityLog = require('../models/ActivityLog')
const { authenticate, requireRole } = require('../middleware/auth')

// GET /api/products
router.get('/', authenticate, async (req, res) => {
  try {
    let query = {}
    if (req.user.role === 'superadmin') {
      // Superadmin can filter by a specific companyCode via query param
      if (req.query.companyCode) query.companyCode = req.query.companyCode
    } else {
      // Admin/staff only see their own company's products
      query.companyCode = req.user.companyCode
    }
    const products = await Product.find(query).sort({ createdAt: -1 })
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/products
router.post('/', authenticate, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const { name, sku, category, price, stock, lowStockThreshold, description, imageUrl } = req.body
    if (!name || !sku) return res.status(400).json({ error: 'name and sku are required' })

    const product = new Product({
      name, sku, category, price: price || 0,
      stock: stock || 0, lowStockThreshold: lowStockThreshold || 5,
      description, imageUrl,
      companyCode: req.user.companyCode,
      createdBy: req.user._id
    })
    await product.save()

    await ActivityLog.create({ user: req.user._id, action: 'added', target: name, companyCode: req.user.companyCode })
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/products/:id
router.put('/:id', authenticate, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!product) return res.status(404).json({ error: 'Product not found' })
    await ActivityLog.create({ user: req.user._id, action: 'updated', target: product.name, companyCode: req.user.companyCode })
    res.json(product)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/products/:id
router.delete('/:id', authenticate, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    await ActivityLog.create({ user: req.user._id, action: 'deleted', target: product.name, companyCode: req.user.companyCode })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
