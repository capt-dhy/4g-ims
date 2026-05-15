const mongoose = require('mongoose')

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },  // 'added', 'updated', 'deleted'
  target: { type: String, required: true },   // product name or entity name
  companyCode: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('ActivityLog', activityLogSchema)
