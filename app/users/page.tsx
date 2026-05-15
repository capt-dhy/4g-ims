'use client'

import React, { useEffect, useState } from 'react'
import { Users, Shield, ShieldAlert, Loader2, Search, Boxes, UserPlus, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import { toast } from 'sonner'

interface UserProfile {
  _id: string
  fullName: string | null
  email: string
  role: string
  companyCode: string | null
  createdAt: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newFullName, setNewFullName] = useState('')
  const [newRole, setNewRole] = useState('admin')
  const [newCompanyCode, setNewCompanyCode] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [me, allUsers] = await Promise.all([
        apiFetch('/api/me'),
        apiFetch('/api/users')
      ])
      setCurrentUser(me)
      setUsers(allUsers)
    } catch (error: any) {
      toast.error(error.message || 'Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      await apiFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
          fullName: newFullName,
          role: newRole,
          companyCode: newCompanyCode || null
        })
      })
      toast.success(`User "${newFullName || newEmail}" created as ${newRole}!`)
      setShowModal(false)
      setNewEmail(''); setNewPassword(''); setNewFullName(''); setNewRole('admin'); setNewCompanyCode('')
      await fetchData()
    } catch (err: any) {
      toast.error(err.message || 'Failed to create user')
    } finally {
      setIsCreating(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await apiFetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole })
      })
      toast.success(`Role updated to ${newRole}`)
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u))
    } catch (err: any) {
      toast.error(err.message || 'Failed to update role')
    }
  }

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!confirm(`Permanently delete "${name}"? This cannot be undone.`)) return
    try {
      await apiFetch(`/api/users/${userId}`, { method: 'DELETE' })
      toast.success(`"${name}" deleted.`)
      setUsers(users.filter(u => u._id !== userId))
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user')
    }
  }

  const filteredUsers = users.filter(u =>
    (u.fullName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (u.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (u._id?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (u.companyCode?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container py-5">
      <header className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-5 gap-3">
        <div>
          <h1 className="h3 fw-bold mb-1">User Management</h1>
          <p className="text-muted small mb-0">Create and manage platform users across all companies.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-ims d-flex align-items-center gap-2 shadow-sm">
          <UserPlus size={18} />
          <span className="fw-bold">Add New User</span>
        </button>
      </header>

      <div className="mb-4" style={{ maxWidth: '400px' }}>
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0"><Search size={18} className="text-muted" /></span>
          <input type="text" placeholder="Search by name, email, or company..." className="form-control border-start-0 py-2 shadow-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="ims-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light border-bottom">
              <tr>
                <th className="py-3 px-4 small fw-bold text-uppercase text-muted border-0">User</th>
                <th className="py-3 px-4 small fw-bold text-uppercase text-muted border-0">Company Code</th>
                <th className="py-3 px-4 small fw-bold text-uppercase text-muted border-0">Role</th>
                <th className="py-3 px-4 small fw-bold text-uppercase text-muted border-0">Joined</th>
                <th className="py-3 px-4 small fw-bold text-uppercase text-muted text-end border-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="p-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold text-white"
                        style={{ width: '40px', height: '40px', fontSize: '16px', backgroundColor: user.role === 'superadmin' ? '#dc3545' : user.role === 'admin' ? '#003B73' : '#6c757d' }}>
                        {(user.fullName || user.email || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="fw-bold mb-0 text-dark">{user.fullName || user.email}</p>
                        <p className="small text-muted mb-0" style={{ fontSize: '11px' }}>{user.email}</p>
                        {user._id === currentUser?.id && <span className="badge bg-ims-primary mt-1" style={{ fontSize: '10px' }}>YOU</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted small font-monospace">{user.companyCode || '—'}</td>
                  <td className="p-4">
                    <div className={`badge px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2 ${user.role === 'superadmin' ? 'bg-danger bg-opacity-10 text-danger' : user.role === 'admin' ? 'bg-primary bg-opacity-10 text-primary' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                      {user.role === 'superadmin' ? <ShieldAlert size={14} /> : <Shield size={14} />}
                      <span className="text-uppercase" style={{ fontSize: '11px' }}>{user.role}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted small">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-end">
                    <div className="d-flex align-items-center justify-content-end gap-2">
                      <Link href={`/inventory?companyCode=${user.companyCode}`} className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1">
                        <Boxes size={14} />
                        <span style={{ fontSize: '11px' }} className="fw-bold">Inventory</span>
                      </Link>
                      {user._id !== currentUser?.id && (
                        <>
                          <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)} className="form-select form-select-sm d-inline-block w-auto">
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                            <option value="superadmin">Superadmin</option>
                          </select>
                          <button onClick={() => handleDeleteUser(user._id, user.fullName || user.email)} className="btn btn-sm btn-outline-danger"><Trash2 size={14} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && !isLoading && (
                <tr><td colSpan={5} className="p-5 text-center text-muted">No users found matching your search.</td></tr>
              )}
              {isLoading && (
                <tr><td colSpan={5} className="p-5 text-center"><Loader2 size={32} className="animate-spin text-ims-primary mx-auto" /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className="ims-card shadow-lg" style={{ width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div>
                <h2 className="h5 fw-bold mb-0">Add New User</h2>
                <p className="text-muted small mb-0">Create a user and assign their role instantly.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="btn btn-light btn-sm border-0"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateUser} className="p-4">
              <div className="mb-3">
                <label className="form-label small fw-bold" htmlFor="newFullName">Full Name</label>
                <input id="newFullName" type="text" className="form-control py-2 shadow-none" placeholder="John Doe" value={newFullName} onChange={(e) => setNewFullName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold" htmlFor="newEmail">Email Address <span className="text-danger">*</span></label>
                <input id="newEmail" type="email" className="form-control py-2 shadow-none" placeholder="john@company.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold" htmlFor="newPassword">Password <span className="text-danger">*</span></label>
                <input id="newPassword" type="password" className="form-control py-2 shadow-none" placeholder="Minimum 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
              </div>
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="form-label small fw-bold" htmlFor="newRole">Role <span className="text-danger">*</span></label>
                  <select id="newRole" className="form-select py-2 shadow-none" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold" htmlFor="newCompanyCode">Company Code</label>
                  <input id="newCompanyCode" type="text" className="form-control py-2 shadow-none" placeholder="e.g. ACME-01" value={newCompanyCode} onChange={(e) => setNewCompanyCode(e.target.value)} />
                </div>
              </div>
              <div className="d-flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-light border fw-bold flex-grow-1 py-2">Cancel</button>
                <button type="submit" disabled={isCreating} className="btn btn-ims fw-bold flex-grow-1 py-2 d-flex align-items-center justify-content-center gap-2">
                  {isCreating ? <><Loader2 size={18} className="animate-spin" /> Creating...</> : <><UserPlus size={18} /> Create User</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
