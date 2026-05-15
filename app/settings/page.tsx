'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Settings, Bell, Lock, Globe, Save } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const handleSave = () => {
    toast.success('Settings saved successfully!')
  }

  const sections = [
    {
      title: 'General Settings',
      icon: Globe,
      items: [
        { label: 'Language', value: 'English (US)' },
        { label: 'Timezone', value: 'UTC (GMT+0)' },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Email Alerts', value: 'Enabled', toggle: true },
        { label: 'Low Stock Alerts', value: 'Enabled', toggle: true },
      ]
    },
    {
      title: 'Security',
      icon: Lock,
      items: [
        { label: 'Two-Factor Authentication', value: 'Disabled', toggle: true },
        { label: 'Session Timeout', value: '30 Minutes' },
      ]
    }
  ]

  return (
    <div className="container py-5" style={{ maxWidth: '900px' }}>
      <header className="mb-5">
        <h1 className="h3 fw-bold mb-1">Settings</h1>
        <p className="text-muted small mb-0">Manage your application preferences and system configuration.</p>
      </header>

      <div className="d-flex flex-column gap-4">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="ims-card overflow-hidden"
          >
            <div className="p-4 border-bottom bg-light d-flex align-items-center gap-3">
              <section.icon size={20} className="text-ims-primary" />
              <h3 className="h6 fw-bold mb-0 text-dark">{section.title}</h3>
            </div>
            <div>
              {section.items.map((item, j) => (
                <div key={j} className="p-4 d-flex align-items-center justify-content-between border-bottom">
                  <span className="fw-bold small text-dark">{item.label}</span>
                  <div className="d-flex align-items-center gap-4">
                    <span className="small text-muted">{item.value}</span>
                    {item.toggle ? (
                      <div className="form-check form-switch mb-0">
                        <input className="form-check-input cursor-pointer shadow-none" type="checkbox" role="switch" defaultChecked={item.value === 'Enabled'} />
                      </div>
                    ) : (
                      <button className="btn btn-link btn-sm fw-bold text-ims-primary text-decoration-none p-0">Edit</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <div className="d-flex justify-content-end pt-3">
          <button 
            onClick={handleSave}
            className="btn btn-ims d-inline-flex align-items-center gap-2 py-3 px-5 shadow"
          >
            <Save size={20} />
            <span className="fw-bold">Save All Changes</span>
          </button>
        </div>
      </div>
    </div>
  )
}
