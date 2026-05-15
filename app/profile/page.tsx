'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Shield, Building, Calendar, Loader2, LogOut, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { apiFetch, getUser, clearAuth } from '@/lib/api'
import { toast } from 'sonner'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      // Get detailed profile from API
      const profile = await apiFetch('/api/auth/me')
      setUser(profile)
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      // Fallback to localStorage if API fails
      const localUser = getUser()
      if (localUser) {
        setUser(localUser)
      } else {
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clearAuth()
    toast.success('Signed out successfully')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <Loader2 className="animate-spin text-ims-primary" size={40} />
      </div>
    )
  }

  return (
    <div className="container py-5">
      <header className="mb-5">
        <h1 className="h3 fw-bold mb-1">Account Profile</h1>
        <p className="text-muted small">Manage your security credentials and organization settings.</p>
      </header>

      <div className="row g-4">
        <div className="col-lg-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="ims-card p-4 text-center"
          >
            <div className="rounded-circle bg-ims-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3 shadow-lg" style={{ width: '100px', height: '100px', fontSize: '32px' }}>
              {(user?.fullName || user?.email || 'U')[0].toUpperCase()}
            </div>
            <h2 className="h5 fw-bold mb-1">{user?.fullName || 'Anonymous User'}</h2>
            <p className="text-muted small mb-4">{user?.email}</p>
            
            <div className={`badge rounded-pill px-4 py-2 mb-4 ${
              user?.role === 'superadmin' ? 'bg-danger text-white' : 'bg-ims-primary text-white'
            }`}>
              {user?.role?.toUpperCase()}
            </div>

            <hr className="my-4 opacity-10" />

            <button 
              onClick={handleLogout}
              className="btn btn-outline-danger w-100 py-2 d-flex align-items-center justify-content-center gap-2"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </motion.div>
        </div>

        <div className="col-lg-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="ims-card overflow-hidden"
          >
            <div className="p-4 border-bottom bg-light">
              <h3 className="h6 fw-bold mb-0">Identity & Organization</h3>
            </div>
            <div className="p-4">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="p-3 rounded-4 border bg-light d-flex align-items-center gap-3">
                    <div className="bg-white p-2 rounded-3 shadow-sm">
                      <Mail size={20} className="text-ims-primary" />
                    </div>
                    <div>
                      <p className="small text-muted mb-0">Email Address</p>
                      <p className="fw-bold mb-0 text-dark">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 rounded-4 border bg-light d-flex align-items-center gap-3">
                    <div className="bg-white p-2 rounded-3 shadow-sm">
                      <Shield size={20} className="text-ims-primary" />
                    </div>
                    <div>
                      <p className="small text-muted mb-0">System Role</p>
                      <p className="fw-bold mb-0 text-dark text-capitalize">{user?.role}</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 rounded-4 border bg-light d-flex align-items-center gap-3">
                    <div className="bg-white p-2 rounded-3 shadow-sm">
                      <Building size={20} className="text-ims-primary" />
                    </div>
                    <div>
                      <p className="small text-muted mb-0">Company Code</p>
                      <p className="fw-bold mb-0 text-dark font-monospace">{user?.companyCode || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 rounded-4 border bg-light d-flex align-items-center gap-3">
                    <div className="bg-white p-2 rounded-3 shadow-sm">
                      <Calendar size={20} className="text-ims-primary" />
                    </div>
                    <div>
                      <p className="small text-muted mb-0">Member Since</p>
                      <p className="fw-bold mb-0 text-dark">{new Date(user?.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-4 bg-ims-primary text-white position-relative overflow-hidden">
                <div className="position-relative z-index-1">
                  <h4 className="h6 fw-bold mb-2">Account Verified</h4>
                </div>
                <Check size={80} className="position-absolute text-white opacity-10" style={{ right: '-10px', bottom: '-10px' }} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
