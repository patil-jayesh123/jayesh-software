import React, { useState, useRef, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiCamera, FiLogOut, FiUser, FiMail, FiShield, FiX, FiCheck, FiAlertTriangle } from 'react-icons/fi'
import Topbar from '../component/Topbar'
import Sidebar from '../component/Sidebar'
import { useAuth } from '../contex/ContextProvider'
import { useNavigate } from 'react-router-dom'

const API = 'https://jayesh-software-backend.onrender.com'

// ── Reusable OTP input ──────────────────────────────────────────────────────
function OtpInput({ value, onChange, disabled }) {
  const refs = useRef([])
  const digits = (value || '').padEnd(6, '').split('').slice(0, 6)

  const handleChange = (i, v) => {
    if (v.length > 1) {
      // paste
      const chars = v.replace(/\D/g, '').slice(0, 6).split('')
      const next = [...digits]
      chars.forEach((c, j) => { if (i + j < 6) next[i + j] = c })
      onChange(next.join(''))
      refs.current[Math.min(i + chars.length, 5)]?.focus()
      return
    }
    if (!/^\d?$/.test(v)) return
    const next = [...digits]
    next[i] = v
    onChange(next.join(''))
    if (v && i < 5) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus()
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => refs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={d}
          disabled={disabled}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          style={{
            width: 42, height: 50, textAlign: 'center', fontSize: 20, fontWeight: 700,
            border: '2px solid', borderColor: d ? 'var(--accent)' : 'var(--border)',
            borderRadius: 8, background: disabled ? 'var(--bg-active)' : 'var(--bg-input)',
            color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.15s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = d ? 'var(--accent)' : 'var(--border)'}
        />
      ))}
    </div>
  )
}

// ── 2FA Setup Modal ──────────────────────────────────────────────────────────
function TwoFAModal({ mode, onClose, onSuccess }) {
  // mode: 'setup' | 'disable'
  const [phase, setPhase] = useState(mode === 'setup' ? 'qr' : 'confirm') // 'qr' | 'confirm' | 'confirm' for disable
  const [otpauthUrl, setOtpauthUrl] = useState(null)
  const [secret, setSecret] = useState(null)
  const canvasRef = useRef(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (mode === 'setup') fetchSetup()
  }, [])

  // Render QR code on canvas using qrcode.js loaded from CDN
  useEffect(() => {
    if (!otpauthUrl || !canvasRef.current) return
    const renderQR = () => {
      if (!canvasRef.current) return
      // Clear any previous QR
      canvasRef.current.innerHTML = ''
      new window.QRCode(canvasRef.current, {
        text: otpauthUrl,
        width: 180,
        height: 180,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.M
      })
    }
    if (window.QRCode) {
      renderQR()
    } else {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
      script.onload = renderQR
      script.onerror = () => console.error('Failed to load QR library')
      document.head.appendChild(script)
    }
  }, [otpauthUrl])

  const fetchSetup = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`${API}/api/auth/2fa/setup`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data.success) {
        setOtpauthUrl(res.data.otpauthUrl)
        setSecret(res.data.secret)
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to generate QR code'
      console.error('2FA setup full error:', err.response?.status, err.response?.data, err.message)
      toast.error('Setup error: ' + msg)
      onClose()
    } finally { setLoading(false) }
  }

  const handleEnable = async () => {
    if (code.length !== 6) { toast.error('Enter all 6 digits'); return }
    setLoading(true)
    try {
      const res = await axios.post(`${API}/api/auth/2fa/enable`, { code }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data.success) {
        toast.success('Two-factor authentication enabled!')
        onSuccess(true)
        onClose()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid code')
      setCode('')
    } finally { setLoading(false) }
  }

  const handleDisable = async () => {
    if (code.length !== 6) { toast.error('Enter your authenticator code'); return }
    setLoading(true)
    try {
      const res = await axios.post(`${API}/api/auth/2fa/disable`, { code }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data.success) {
        toast.success('Two-factor authentication disabled')
        onSuccess(false)
        onClose()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid code')
      setCode('')
    } finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'setup' ? '🔐 Set up two-factor auth' : '⚠️ Disable two-factor auth'}
          </h2>
          <button className="icon-btn" onClick={onClose}><FiX /></button>
        </div>

        <div className="modal-body">
          {/* ── Setup: QR phase ── */}
          {mode === 'setup' && phase === 'qr' && (
            <>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>Generating QR code…</div>
              ) : (
                <>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    Scan this QR code with <strong>Google Authenticator</strong>, <strong>Microsoft Authenticator</strong>, or any TOTP app. It will start generating 6-digit codes every 30 seconds.
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', padding: 12, borderRadius: 12, border: '1px solid var(--border)', display: 'inline-block', minHeight: 204, minWidth: 204, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {!otpauthUrl ? (
                        <div style={{ color: '#999', fontSize: 13 }}>Generating…</div>
                      ) : (
                        <div ref={canvasRef} />
                      )}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-active)', borderRadius: 8, padding: '10px 14px' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                      Can't scan? Enter manually
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <code style={{ fontSize: 12, color: 'var(--text-primary)', flex: 1, wordBreak: 'break-all', letterSpacing: '0.05em' }}>
                        {showSecret ? secret : '••••••••••••••••••••••••••••••••'}
                      </code>
                      <button
                        onClick={() => setShowSecret(s => !s)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}
                      >
                        {showSecret ? 'Hide' : 'Show'}
                      </button>
                      {showSecret && (
                        <button
                          onClick={() => { navigator.clipboard.writeText(secret); toast.success('Copied!') }}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12 }}
                        >
                          Copy
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* ── Setup: Confirm OTP phase ── */}
          {mode === 'setup' && phase === 'confirm' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📱</div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  Enter the 6-digit code from your authenticator app to confirm setup.
                </p>
              </div>
              <OtpInput value={code} onChange={setCode} disabled={loading} />
            </>
          )}

          {/* ── Disable: confirm with OTP ── */}
          {mode === 'disable' && (
            <>
              <div style={{ background: 'var(--danger-light)', border: '1px solid var(--danger)', borderRadius: 8, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <FiAlertTriangle style={{ color: 'var(--danger)', marginTop: 2, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: 'var(--danger)', lineHeight: 1.6, margin: 0 }}>
                  Disabling 2FA will make your account less secure. Enter your current authenticator code to confirm.
                </p>
              </div>
              <OtpInput value={code} onChange={setCode} disabled={loading} />
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>

          {mode === 'setup' && phase === 'qr' && (
            <button className="btn btn-primary" onClick={() => setPhase('confirm')} disabled={loading || !otpauthUrl}>
              I've scanned it →
            </button>
          )}
          {mode === 'setup' && phase === 'confirm' && (
            <button className="btn btn-primary" onClick={handleEnable} disabled={loading || code.length !== 6}>
              {loading ? 'Verifying…' : <><FiCheck style={{ marginRight: 4 }} /> Enable 2FA</>}
            </button>
          )}
          {mode === 'disable' && (
            <button
              onClick={handleDisable}
              disabled={loading || code.length !== 6}
              style={{ padding: '0 18px', height: 38, borderRadius: 8, background: 'var(--danger)', color: '#fff', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: (loading || code.length !== 6) ? 0.6 : 1 }}
            >
              {loading ? 'Disabling…' : 'Disable 2FA'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Profile page ────────────────────────────────────────────────────────
export default function Profile() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const fileRef = useRef()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null)
  const [editName, setEditName] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [twoFAEnabled, setTwoFAEnabled] = useState(user?.twoFactorEnabled || false)
  const [modal2FA, setModal2FA] = useState(null) // null | 'setup' | 'disable'

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

  const handleLogout = () => { logout(); navigate('/login') }

  const handleNameSave = () => {
    if (!name.trim()) return
    updateUser({ ...user, name: name.trim() })
    setEditName(false)
    toast.success('Name updated')
  }

  const handle2FASuccess = (enabled) => {
    setTwoFAEnabled(enabled)
    updateUser({ ...user, twoFactorEnabled: enabled })
  }

  if (!user) { navigate('/login'); return null }

  return (
    <div className="app-layout">
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 99 }} />}
      <Sidebar onClose={() => setSidebarOpen(false)} isOpen={sidebarOpen} />
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
              <button className="avatar-upload-btn" onClick={() => fileRef.current?.click()} title="Change avatar">
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
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditName(true)} style={{ fontSize: 12, padding: '0 10px' }}>Edit</button>
                </div>
              )}
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>NoteApp member</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <span style={{ background: 'var(--accent-light)', color: 'var(--accent-text)', fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 99 }}>
                  Free plan
                </span>
                {twoFAEnabled && (
                  <span style={{ background: 'var(--success-light, #d1fae5)', color: 'var(--success, #059669)', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FiShield style={{ fontSize: 11 }} /> 2FA on
                  </span>
                )}
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

          {/* ── Security / 2FA section ── */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px', boxShadow: 'var(--shadow-sm)', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <FiShield style={{ color: twoFAEnabled ? 'var(--success, #059669)' : 'var(--text-muted)', fontSize: 18 }} />
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Two-factor authentication
                  </h3>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                    background: twoFAEnabled ? 'var(--success-light, #d1fae5)' : 'var(--danger-light)',
                    color: twoFAEnabled ? 'var(--success, #059669)' : 'var(--danger)',
                  }}>
                    {twoFAEnabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                  {twoFAEnabled
                    ? 'Your account is protected with an authenticator app. You\'ll need to enter a code each time you sign in.'
                    : 'Add an extra layer of security. After enabling, you\'ll scan a QR code with an authenticator app like Google Authenticator.'}
                </p>

                {twoFAEnabled && (
                  <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <FiCheck style={{ color: 'var(--success, #059669)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>Works with Google Authenticator, Microsoft Authenticator, Authy, and more</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                {!twoFAEnabled ? (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setModal2FA('setup')}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <FiShield /> Enable 2FA
                  </button>
                ) : (
                  <button
                    onClick={() => setModal2FA('disable')}
                    style={{ padding: '0 14px', height: 34, borderRadius: 8, background: 'var(--danger-light)', color: 'var(--danger)', border: '1px solid var(--danger)', fontWeight: 600, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    Disable 2FA
                  </button>
                )}
              </div>
            </div>

            {/* Supported apps row */}
            {!twoFAEnabled && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Google Authenticator', 'Microsoft Authenticator', 'Authy', '1Password'].map(app => (
                  <span key={app} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 99, background: 'var(--bg-active)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {app}
                  </span>
                ))}
              </div>
            )}
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

      {/* 2FA Modal */}
      {modal2FA && (
        <TwoFAModal
          mode={modal2FA}
          onClose={() => setModal2FA(null)}
          onSuccess={handle2FASuccess}
        />
      )}
    </div>
  )
}