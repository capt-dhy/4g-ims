'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Mail, Lock, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { apiFetch, setToken, setUser } from '@/lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })

      setToken(data.token)
      setUser(data.user)
      toast.success('Session authorized. Welcome back!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex bg-white">
      {/* Left Column: Visual branding */}
      <div className="col-lg-7 d-none d-lg-flex bg-ims-primary align-items-center justify-content-center position-relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="position-absolute bg-white bg-opacity-10 rounded-circle" style={{ width: '600px', height: '600px', top: '-100px', left: '-100px' }}></div>
        <div className="position-absolute bg-white bg-opacity-5 rounded-circle" style={{ width: '800px', height: '800px', bottom: '-200px', right: '-100px' }}></div>
        
        <div className="text-center position-relative z-index-1">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white d-inline-flex p-4 rounded-5 shadow-lg mb-4 border" style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))' }}>
              <img src="/logo.png" alt="4G-IMS Logo" className="ims-logo" style={{ width: '120px' }} />
            </div>
            <h1 className="display-4 fw-bold text-white mb-2">4G-IMS</h1>
            <p className="fs-5 text-white-50">Secure Global Inventory Infrastructure</p>
          </motion.div>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="col-12 col-lg-5 d-flex align-items-center justify-content-center p-4 p-md-5">
        <div className="w-100" style={{ maxWidth: '420px' }}>
          <div className="mb-5 text-center text-lg-start">
            <h2 className="h3 fw-bold text-dark">Welcome Back</h2>
            <p className="text-muted small">Sign in to your account to continue</p>
          </div>

          <div className="ims-card p-4 p-md-5 border-0 shadow-sm bg-light">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label small fw-bold text-dark" htmlFor="email">Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <Mail size={18} className="text-muted" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="form-control bg-white border-start-0 py-3 shadow-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between">
                  <label className="form-label small fw-bold text-dark" htmlFor="password">Password</label>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <Lock size={18} className="text-muted" />
                  </span>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="form-control bg-white border-start-0 py-3 shadow-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-ims w-100 py-3 shadow-sm d-flex align-items-center justify-center mt-2"
              >
                {isLoading ? <Loader2 className="animate-spin me-2" size={20} /> : (
                  <>
                    <ShieldCheck size={18} className="me-2" />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center mt-5 small fw-bold text-muted opacity-50">
            Enterprise Inventory Control System
          </p>
        </div>
      </div>
    </div>
  )
}
