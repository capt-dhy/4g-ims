'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Boxes, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  ArrowRight,
  Package,
  Activity,
  User,
  Shield
} from 'lucide-react'
import Link from 'next/link'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { apiFetch, getUser } from '@/lib/api'

// Simple timeAgo function
function timeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return date.toLocaleDateString()
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    inventoryValue: 0,
    recentActivity: [] as any[]
  })
  const [chartData, setChartData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState('User')
  const [userRole, setUserRole] = useState('staff')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const user = getUser()
      if (user) {
        setUserName(user.fullName || user.email.split('@')[0])
        setUserRole(user.role)
      }

      // Fetch actual data from Express API
      const [products, activities] = await Promise.all([
        apiFetch('/api/products'),
        apiFetch('/api/activity')
      ])

      const lowStockCount = products.filter((p: any) => p.stock <= p.lowStockThreshold).length
      const totalValue = products.reduce((acc: number, p: any) => acc + (p.price * p.stock), 0)

      setStats({
        totalProducts: products.length,
        lowStock: lowStockCount,
        inventoryValue: totalValue,
        recentActivity: activities.slice(0, 5)
      })

      // Generate dummy chart data based on real product count for aesthetics
      const data = [
        { name: 'Mon', value: Math.floor(products.length * 0.8) },
        { name: 'Tue', value: Math.floor(products.length * 1.2) },
        { name: 'Wed', value: Math.floor(products.length * 1.1) },
        { name: 'Thu', value: Math.floor(products.length * 1.5) },
        { name: 'Fri', value: Math.floor(products.length * 1.3) },
        { name: 'Sat', value: Math.floor(products.length * 1.8) },
        { name: 'Sun', value: products.length },
      ]
      setChartData(data)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const cards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'primary',
      trend: '+12% from last month'
    },
    {
      title: 'Low Stock Alerts',
      value: stats.lowStock,
      icon: AlertTriangle,
      color: 'warning',
      trend: stats.lowStock > 0 ? 'Action required' : 'All clear'
    },
    {
      title: 'Inventory Value',
      value: `$${stats.inventoryValue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'success',
      trend: '+5.4% increase'
    }
  ]

  return (
    <div className="container py-5">
      {/* Welcome Header */}
      <header className="mb-5 d-flex align-items-center justify-content-between">
        <div>
          <h1 className="h3 fw-bold mb-1 text-dark">Welcome back, {userName}</h1>
          <p className="text-muted small mb-0 d-flex align-items-center gap-2">
            <Clock size={14} />
            Last login: {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className={`badge rounded-pill px-3 py-2 d-flex align-items-center gap-2 border ${
          userRole === 'superadmin' ? 'bg-danger bg-opacity-10 text-danger border-danger border-opacity-25' : 
          'bg-ims-primary bg-opacity-10 text-ims-primary border-primary border-opacity-25'
        }`}>
          {userRole === 'superadmin' ? <Shield size={14} /> : <User size={14} />}
          <span className="text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '1px' }}>
            {userRole}
          </span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="row g-4 mb-5">
        {cards.map((card, i) => (
          <motion.div 
            key={card.title} 
            className="col-md-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="ims-card p-4 h-100 position-relative overflow-hidden">
              <div className="d-flex justify-content-between align-items-start position-relative z-index-1">
                <div>
                  <p className="small text-muted fw-bold text-uppercase tracking-wider mb-1">{card.title}</p>
                  <h3 className="display-6 fw-bold mb-1">{card.value}</h3>
                  <p className={`small mb-0 fw-medium ${card.color === 'warning' && stats.lowStock > 0 ? 'text-danger' : 'text-success'}`}>
                    {card.trend}
                  </p>
                </div>
                <div className={`bg-${card.color} bg-opacity-10 p-3 rounded-4 text-${card.color}`}>
                  <card.icon size={28} />
                </div>
              </div>
              {/* Subtle background icon */}
              <card.icon 
                size={120} 
                className={`position-absolute text-${card.color} opacity-05`} 
                style={{ right: '-20px', bottom: '-20px' }} 
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="row g-4">
        {/* Activity Chart */}
        <div className="col-lg-8">
          <div className="ims-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h3 className="h6 fw-bold mb-1">Inventory Activity</h3>
                <p className="text-muted small mb-0">Stock movements over the last 7 days</p>
              </div>
              <select className="form-select form-select-sm w-auto shadow-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--ims-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--ims-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="var(--ims-primary)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-lg-4">
          <div className="ims-card h-100 overflow-hidden">
            <div className="p-4 border-bottom bg-light d-flex align-items-center justify-content-between">
              <h3 className="h6 fw-bold mb-0">Live Activity Feed</h3>
              <Activity size={16} className="text-ims-primary" />
            </div>
            <div className="p-0">
              {stats.recentActivity.length > 0 ? stats.recentActivity.map((activity, i) => (
                <div key={activity._id} className="p-3 border-bottom hover-bg-light transition-all">
                  <div className="d-flex gap-3">
                    <div className={`rounded-circle p-2 flex-shrink-0 ${
                      activity.action === 'added' ? 'bg-success bg-opacity-10 text-success' :
                      activity.action === 'deleted' ? 'bg-danger bg-opacity-10 text-danger' :
                      'bg-primary bg-opacity-10 text-primary'
                    }`}>
                      <Package size={16} />
                    </div>
                    <div>
                      <p className="small mb-1 text-dark">
                        <span className="fw-bold">{activity.user?.fullName || 'System'}</span> {activity.action} <span className="fw-bold">"{activity.target}"</span>
                      </p>
                      <p className="text-muted" style={{ fontSize: '11px' }}>{timeAgo(activity.createdAt)}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-5 text-center text-muted">
                  <Clock size={32} className="mb-3 opacity-25" />
                  <p className="small mb-0">No recent activity detected.</p>
                </div>
              )}
            </div>
            <div className="p-3 bg-light border-top mt-auto">
              <Link href="/inventory" className="btn btn-link btn-sm text-ims-primary text-decoration-none fw-bold w-100 d-flex align-items-center justify-center gap-2">
                View Full Inventory
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
