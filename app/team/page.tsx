'use client'

import React, { useEffect, useState } from 'react'
import { Users, Shield, ShieldAlert, Loader2, Copy, Check, UserPlus, Trash2, X } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { toast } from 'sonner'

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newFullName, setNewFullName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [me, members] = await Promise.all([
        apiFetch('/api/me'),
        apiFetch('/api/team')
      ])
      setCurrentUser(me)
      setTeamMembers(members)
    } catch (error: any) {
      toast.error(error.message || 'Failed to load team')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      await apiFetch('/api/team', {
        method: 'POST',
        body: JSON.stringify({ email: newEmail, password: newPassword, fullName: newFullName })
      })
      toast.success(`Staff member "${newFullName || newEmail}" added!`)
      setShowModal(false)
      setNewEmail(''); setNewPassword(''); setNewFullName('')
      await fetchData()
    } catch (err: any) {
      toast.error(err.message || 'Failed to add staff member')
    } finally {
      setIsCreating(false)
    }
  }

  const handleRemoveMember = async (memberId: string, name: string) => {
    if (!confirm(`Remove "${name}" from your team? This permanently deletes their account.`)) return
    try {
      await apiFetch(`/api/team/${memberId}`, { method: 'DELETE' })
      toast.success(`"${name}" removed from team.`)
      setTeamMembers(teamMembers.filter(m => m._id !== memberId))
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove member')
    }
  }

  const copyToClipboard = () => {
    if (!currentUser?.companyCode) return
    navigator.clipboard.writeText(currentUser.companyCode)
    setCopied(true)
    toast.success('Company code copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  if (currentUser?.role === 'staff') {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
        <ShieldAlert size={64} className="text-warning mb-3" />
        <h1 className="h3 fw-bold text-dark">Access Denied</h1>
        <p className="text-muted" style={{ maxWidth: '400px' }}>Only Admins can manage the team.</p>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <header className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-5 gap-3">
        <div>
          <h1 className="h3 fw-bold mb-1">Team Management</h1>
          <p className="text-muted small mb-0">Create and manage staff members for your company.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-ims d-flex align-items-center gap-2 shadow-sm">
          <UserPlus size={18} />
          <span className="fw-bold">Add Staff Member</span>
        </button>
      </header>

      <div className="row g-4">
        {/* Company Code Card */}
        <div className="col-md-4">
          <div className="bg-ims-primary text-white p-4 p-md-5 rounded-4 shadow position-relative overflow-hidden h-100">
            <div className="position-relative" style={{ zIndex: 1 }}>
              <h2 className="h5 fw-bold mb-2">Your Company Code</h2>
              <p className="small text-white-50 mb-4">Share this code so staff can self-register and join your company.</p>
              <div className="bg-white bg-opacity-10 rounded-3 p-3 d-flex align-items-center justify-content-between border border-light border-opacity-25">
                <span className="font-monospace fs-5 fw-bold">{currentUser?.companyCode || '—'}</span>
                <button onClick={copyToClipboard} className="btn btn-sm btn-outline-light border-0">
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
              <p className="small text-white-50 mt-3 mb-0">
                <Shield size={12} className="me-1" />
                Staff you create directly are automatically assigned to this company.
              </p>
            </div>
            <div className="position-absolute bg-white bg-opacity-10 rounded-circle" style={{ width: '250px', height: '250px', bottom: '-100px', right: '-100px', filter: 'blur(40px)' }}></div>
          </div>
        </div>

        {/* Team Members List */}
        <div className="col-md-8">
          <div className="ims-card overflow-hidden h-100">
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between bg-light">
              <h3 className="h6 fw-bold mb-0">Team Members ({teamMembers.length})</h3>
              <div className="d-flex align-items-center gap-2 small text-muted">
                <Shield size={14} />
                <span>Your Company</span>
              </div>
            </div>
            <div>
              {isLoading ? (
                <div className="p-5 text-center"><Loader2 size={32} className="animate-spin text-ims-primary mx-auto" /></div>
              ) : teamMembers.length === 0 ? (
                <div className="p-5 text-center text-muted">
                  <Users size={40} className="mb-3 opacity-25" />
                  <p className="mb-0">No team members yet. Click "Add Staff Member" to get started.</p>
                </div>
              ) : (
                teamMembers.map((member) => (
                  <div key={member._id} className="p-4 d-flex align-items-center justify-content-between border-bottom hover-bg-light transition-colors">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold text-white"
                        style={{ width: '44px', height: '44px', fontSize: '16px', backgroundColor: member.role === 'admin' ? '#003B73' : '#6c757d' }}>
                        {(member.fullName || member.email || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="fw-bold mb-0 text-dark">
                          {member.fullName || member.email}
                          {member._id === currentUser?.id && <span className="badge bg-ims-primary ms-2" style={{ fontSize: '10px' }}>YOU</span>}
                        </p>
                        <p className="small text-muted mb-0">{member.email}</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <span className={`badge text-uppercase px-3 py-2 rounded-pill ${member.role === 'admin' ? 'bg-primary bg-opacity-10 text-primary' : 'bg-secondary bg-opacity-10 text-secondary'}`} style={{ fontSize: '11px' }}>
                        {member.role}
                      </span>
                      {member._id !== currentUser?.id && (
                        <button onClick={() => handleRemoveMember(member._id, member.fullName || member.email)} className="btn btn-sm btn-outline-danger border-0">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className="ims-card shadow-lg" style={{ width: '100%', maxWidth: '460px' }}>
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div>
                <h2 className="h5 fw-bold mb-0">Add Staff Member</h2>
                <p className="text-muted small mb-0">They'll be assigned to <strong>{currentUser?.companyCode}</strong> automatically.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="btn btn-light btn-sm border-0"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateStaff} className="p-4">
              <div className="mb-3">
                <label className="form-label small fw-bold" htmlFor="staffName">Full Name</label>
                <input id="staffName" type="text" className="form-control py-2 shadow-none" placeholder="Jane Smith" value={newFullName} onChange={(e) => setNewFullName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold" htmlFor="staffEmail">Email Address <span className="text-danger">*</span></label>
                <input id="staffEmail" type="email" className="form-control py-2 shadow-none" placeholder="jane@yourcompany.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold" htmlFor="staffPassword">Temporary Password <span className="text-danger">*</span></label>
                <input id="staffPassword" type="password" className="form-control py-2 shadow-none" placeholder="Minimum 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
              </div>
              <div className="d-flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-light border fw-bold flex-grow-1 py-2">Cancel</button>
                <button type="submit" disabled={isCreating} className="btn btn-ims fw-bold flex-grow-1 py-2 d-flex align-items-center justify-content-center gap-2">
                  {isCreating ? <><Loader2 size={18} className="animate-spin" /> Adding...</> : <><UserPlus size={18} /> Add Staff</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
