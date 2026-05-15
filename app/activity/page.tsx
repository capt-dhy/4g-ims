'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { History, User, Package, Edit, Trash2, Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ActivityLogPage() {
  const activities = [
    { id: 1, user: 'Admin', action: 'added', target: 'MacBook Pro M3', time: '10 mins ago', icon: Plus, color: 'text-success', bg: 'bg-success bg-opacity-10' },
    { id: 2, user: 'Admin', action: 'updated', target: 'iPhone 15 Pro', time: '1 hour ago', icon: Edit, color: 'text-primary', bg: 'bg-primary bg-opacity-10' },
    { id: 3, user: 'Admin', action: 'deleted', target: 'Old Inventory Item', time: '3 hours ago', icon: Trash2, color: 'text-danger', bg: 'bg-danger bg-opacity-10' },
    { id: 4, user: 'Admin', action: 'updated stock', target: 'Sony WH-1000XM5', time: '5 hours ago', icon: Package, color: 'text-warning', bg: 'bg-warning bg-opacity-10' },
  ]

  return (
    <div className="container py-5" style={{ maxWidth: '900px' }}>
      <header className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-5 gap-3">
        <div>
          <h1 className="h3 fw-bold mb-1">Activity Log</h1>
          <p className="text-muted small mb-0">Detailed audit trail of all inventory movements and changes.</p>
        </div>
        <Link 
          href="/dashboard"
          className="btn btn-light border d-inline-flex align-items-center gap-2 fw-bold small"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </header>

      <div className="ims-card overflow-hidden">
        <div>
          {activities.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 d-flex align-items-start gap-3 border-bottom hover-bg-light transition-all"
            >
              <div className={`${activity.bg} ${activity.color} p-3 rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '48px', height: '48px' }}>
                <activity.icon size={20} />
              </div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <p className="fw-bold mb-0 text-dark">{activity.user}</p>
                  <span className="small text-muted">{activity.time}</span>
                </div>
                <p className="text-muted small mb-0">
                  User {activity.user} {activity.action} <span className="fw-bold text-dark">{activity.target}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="mt-5 text-center">
        <button className="btn btn-outline-primary fw-bold px-4 py-2 rounded-pill">Load More Activities</button>
      </div>
    </div>
  )
}
