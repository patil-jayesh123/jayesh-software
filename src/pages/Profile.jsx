import React, { useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { FiCamera, FiLogOut, FiUser, FiMail, FiShield } from 'react-icons/fi'
import Topbar from '../component/Topbar'
import Sidebar from '../component/Sidebar'
import { useAuth } from '../contex/ContextProvider'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const fileRef = useRef()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null)
  const [editName, setEditName] = useState(false)
  const [name, setName] = useState(user?.name || '')

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const handleAvatarChange = e => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return }
    const reader = new FileReader()
    reader.onload = ev => {
      const dataUrl = ev.target.result
      setAvatarPreview(dataUrl)
      if (user) {
        updateUser({ ...user, avatar: dataUrl })
        localStorage.setItem('userAvatar', dataUrl)
        toast.success('Avatar updated')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNameSave = () => {
    if (!name.trim()) return
    updateUser({ ...user, name: name.trim() })
    setEditName(false)
    toast.success('Name updated')
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="app-layout">
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 99 }} />}
      <Sidebar onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Topbar onMenuToggle={() => setSidebarOpen(o => !o)} title="Profile" />
        <div className="page-content" style={{ maxWidth: 720 }}>

          {/* Hero */}
          <div className="profile-hero">
            <div className="profile-avatar-wrap">
              <div className="avatar" style={{ width: 88, height: 88, fontSize: 28 }}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : initials}
              </div>
              <button
                className="avatar-upload-btn"
                onClick={() => fileRef.current?.click()}
                title="Change avatar"
              >
                <FiCamera style={{ fontSize: 13 }} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {editName ? (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                  <input
                    className="form-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{ maxWidth: 240, height: 36, fontSize: 15 }}
                    onKeyDown={e => e.key === 'Enter' && handleNameSave()}
                    autoFocus
                  />
                  <button className="btn btn-primary btn-sm" onClick={handleNameSave}>Save</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setEditName(false); setName(user.name) }}>Cancel</button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</h1>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditName(true)} style={{ fontSize: 12, padding: '0 10px' }}>
                    Edit
                  </button>
                </div>
              )}
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>NoteApp member</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <span style={{ background: 'var(--accent-light)', color: 'var(--accent-text)', fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 99 }}>
                  Free plan
                </span>
              </div>
            </div>

            <button className="btn btn-danger btn-sm" onClick={handleLogout} style={{ alignSelf: 'flex-start' }}>
              <FiLogOut /> Sign out
            </button>
          </div>

          {/* Info cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
            {[
              { icon: <FiUser />, label: 'Full name', value: user.name, color: 'var(--accent)' },
              { icon: <FiMail />, label: 'Email address', value: user.email || 'Not provided', color: 'var(--teal)' },
              { icon: <FiShield />, label: 'Account status', value: 'Active', color: 'var(--success)' },
            ].map(item => (
              <div key={item.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ color: item.color, fontSize: 17 }}>{item.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{item.label}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', wordBreak: 'break-word' }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Avatar upload tip */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>Profile photo</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>
              Upload a photo to personalize your account. Supported formats: JPG, PNG, GIF. Max 2MB.
            </p>
            <button className="btn btn-secondary btn-sm" onClick={() => fileRef.current?.click()}>
              <FiCamera /> Change photo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
