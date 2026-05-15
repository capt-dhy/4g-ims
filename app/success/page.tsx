'use client'

import React, { Suspense } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Home, Boxes, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function SuccessContent() {
  const searchParams = useSearchParams()
  const action = searchParams.get('action') || 'operation'
  
  const getMessage = () => {
    switch(action) {
      case 'add': return 'Product has been successfully archived in your global inventory.'
      case 'edit': return 'Product signatures and data have been updated across the network.'
      case 'delete': return 'Product has been securely removed from the platform.'
      default: return 'The requested operation has been completed successfully.'
    }
  }

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center p-4 text-center page-transition bg-light">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
        className="position-relative mb-5"
      >
        <div className="bg-white rounded-circle shadow d-flex align-items-center justify-content-center position-relative z-index-1 border border-light" style={{ width: '120px', height: '120px' }}>
          <CheckCircle2 size={64} className="text-success" />
        </div>
      </motion.div>

      <div className="mb-5" style={{ maxWidth: '600px' }}>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="display-4 fw-bolder text-dark mb-3"
        >
          Success Confirmed
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lead text-muted fw-medium"
        >
          {getMessage()}
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="d-flex flex-column flex-sm-row align-items-center gap-3"
      >
        <Link 
          href="/dashboard" 
          className="btn btn-ims btn-lg d-flex align-items-center gap-2 fw-bold"
        >
          <Home size={20} />
          Command Center
        </Link>
        <Link 
          href="/inventory" 
          className="btn btn-outline-secondary btn-lg d-flex align-items-center gap-2 fw-bold"
        >
          <Boxes size={20} />
          Inventory List <ArrowRight size={20} />
        </Link>
      </motion.div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <Loader2 size={40} className="animate-spin text-ims-primary" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
