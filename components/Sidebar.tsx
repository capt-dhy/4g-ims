'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  Activity,
  User,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react'
import { clearAuth, getUser } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setUser(getUser())
  }, [])

  const handleLogout = () => {
    clearAuth()
    toast.success('Signed out successfully')
    router.push('/login')
  }

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Inventory', icon: <Package size={20} />, path: '/inventory' },
    { name: 'Activity', icon: <Activity size={20} />, path: '/activity' },
  ]

  // Add management items for admins
  if (user?.role === 'admin' || user?.role === 'superadmin') {
    navItems.push({ name: 'Team', icon: <Users size={20} />, path: '/team' })
  }

  // Add superadmin specific items
  if (user?.role === 'superadmin') {
    navItems.push({ name: 'User Management', icon: <ShieldCheck size={20} />, path: '/users' })
  }

  const bottomItems = [
    { name: 'Profile', icon: <User size={20} />, path: '/profile' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ]

  return (
    <>
      {/* Mobile Header */}
      <div className="d-lg-none position-fixed top-0 start-0 w-100 bg-white border-bottom px-4 d-flex align-items-center justify-content-between shadow-sm" style={{ height: '70px', zIndex: 1050 }}>
        <div className="d-flex align-items-center gap-2">
          <div className="bg-ims-primary p-2 rounded-3">
            <Package size={24} className="text-white" />
          </div>
          <span className="fw-bold h5 mb-0 tracking-tight">4G-IMS</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-light p-2 border-0"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25" 
          style={{ zIndex: 1040, backdropFilter: 'blur(4px)' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`bg-white border-end position-fixed top-0 start-0 h-100 sidebar-transition ${isOpen ? 'translate-x-0' : 'sidebar-collapsed'} d-lg-block`}
        style={{ width: 'var(--sidebar-width)', zIndex: 1045, transform: (typeof window !== 'undefined' && window.innerWidth >= 992) || isOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <div className="p-4 h-100 d-flex flex-column">
          {/* Logo */}
          <div className="d-flex align-items-center gap-3 mb-5 px-2">
            <div className="bg-ims-primary p-2 rounded-3 shadow-sm">
              <Package size={28} className="text-white" />
            </div>
            <div>
              <h1 className="h5 fw-bold mb-0 tracking-tight text-ims-primary">4G-IMS</h1>
              <span className="text-muted" style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>ENTERPRISE</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-grow-1">
            <p className="small fw-bold text-muted text-uppercase mb-3 px-2" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Main Menu</p>
            <nav className="d-flex flex-column gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none transition-all ${
                    pathname === item.path 
                      ? 'bg-ims-primary text-white shadow-sm' 
                      : 'text-secondary hover-bg-light'
                  }`}
                >
                  {item.icon}
                  <span className="fw-semibold">{item.name}</span>
                </Link>
              ))}
            </nav>

            <p className="small fw-bold text-muted text-uppercase mt-5 mb-3 px-2" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>System</p>
            <nav className="d-flex flex-column gap-2">
              {bottomItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none transition-all ${
                    pathname === item.path 
                      ? 'bg-ims-primary text-white shadow-sm' 
                      : 'text-secondary hover-bg-light'
                  }`}
                >
                  {item.icon}
                  <span className="fw-semibold">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* User Profile Summary */}
          <div className="mt-auto pt-4 border-top">
            <div className="d-flex align-items-center gap-3 mb-4 px-2">
              <div className="rounded-circle bg-ims-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                {(user?.fullName || 'U')[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="small fw-bold mb-0 text-dark text-truncate">{user?.fullName}</p>
                <p className="text-muted mb-0 text-truncate" style={{ fontSize: '11px' }}>{user?.role?.toUpperCase()}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="btn btn-light w-100 text-danger fw-bold d-flex align-items-center justify-content-center gap-2 border py-2"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <style jsx>{`
        .hover-bg-light:hover {
          background-color: #f1f5f9;
          color: var(--ims-primary) !important;
        }
        .translate-x-0 {
          transform: translateX(0) !important;
        }
      `}</style>
    </>
  )
}
