'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Boxes, LogOut, User, Users } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { getUser, clearAuth } from '@/lib/api'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userRole, setUserRole] = useState('staff')

  useEffect(() => {
    const user = getUser()
    if (user) {
      setUserRole(user.role)
    } else {
      // If no user in localStorage, might need to redirect to login
      // but only if we're on a protected page
      if (pathname !== '/' && pathname !== '/login' && pathname !== '/signup') {
        router.push('/login')
      }
    }
  }, [pathname, router])

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }
  ]

  if (userRole === 'superadmin') {
    navItems.push({ name: 'Users', href: '/users', icon: Users })
  } else if (userRole === 'admin') {
    navItems.push({ name: 'Inventory', href: '/inventory', icon: Boxes })
    navItems.push({ name: 'Team', href: '/team', icon: Users })
  } else {
    // Staff
    navItems.push({ name: 'Inventory', href: '/inventory', icon: Boxes })
  }

  // Hide sidebar on auth pages and home page
  const hideSidebar = pathname === '/' || pathname === '/login' || pathname === '/signup'

  if (hideSidebar) return null

  return (
    <div 
      className="d-flex flex-column flex-shrink-0 bg-white border-end shadow-sm" 
      style={{ width: '280px', height: '100vh', position: 'sticky', top: 0, overflowY: 'auto' }}
    >
      <Link href="/dashboard" className="d-flex align-items-center gap-2 p-4 text-decoration-none border-bottom">
        <img src="/logo.png" alt="4G-IMS Logo" className="ims-logo" style={{ height: '32px' }} />
        <span className="fw-bold fs-5 text-ims-primary">4G-IMS</span>
      </Link>

      <div className="p-3">
        <p className="text-muted small fw-bold text-uppercase tracking-wider mb-2 px-2" style={{ fontSize: '11px' }}>
          Overview
        </p>
        <ul className="nav nav-pills flex-column mb-auto gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href} className="nav-item">
                <Link
                  href={item.href}
                  className={`nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 transition-all ${
                    isActive 
                      ? "active bg-ims-primary text-white shadow-sm" 
                      : "text-dark hover-bg-light"
                  }`}
                  style={{
                    backgroundColor: isActive ? 'var(--ims-primary)' : 'transparent',
                    color: isActive ? 'white' : 'inherit'
                  }}
                >
                  <Icon size={20} />
                  <span className="fw-medium">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <hr className="mt-auto mb-0 border-light" />
      
      <div className="p-3 border-top bg-light mt-auto">
        <div className="d-flex flex-column gap-2">
          <Link 
            href="/profile"
            className="btn btn-light d-flex align-items-center justify-content-start gap-3 w-100 py-2 border hover-bg-white transition-all text-start"
          >
            <div className="bg-white rounded p-1 border shadow-sm">
              <User size={16} className="text-ims-primary" />
            </div>
            <span className="fw-bold small flex-grow-1">My Profile</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="btn btn-outline-danger d-flex align-items-center justify-content-start gap-3 w-100 py-2 transition-all text-start"
          >
            <LogOut size={16} />
            <span className="fw-bold small">Sign Out</span>
          </button>
        </div>
      </div>

    </div>
  )
}
