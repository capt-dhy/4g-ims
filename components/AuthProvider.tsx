'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getToken } from '@/lib/api'
import { Loader2 } from 'lucide-react'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  // Public routes that don't require login
  const publicRoutes = ['/login', '/signup', '/']

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken()
      const isPublicRoute = publicRoutes.includes(pathname)

      if (!token && !isPublicRoute) {
        // Redirect to login if no token and trying to access protected route
        router.push('/login')
      } else if (token && isPublicRoute && pathname !== '/') {
        // Redirect to dashboard if already logged in and trying to access login/signup
        router.push('/dashboard')
      } else {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  if (isChecking && !publicRoutes.includes(pathname)) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
        <div className="bg-white p-4 rounded-4 shadow-sm border d-flex flex-column align-items-center">
          <Loader2 className="animate-spin text-ims-primary mb-3" size={32} />
          <p className="small fw-bold text-muted mb-0">Verifying session...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
