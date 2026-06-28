import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contex/ContextProvider'
import { toast } from 'react-toastify'
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiArrowLeft } from 'react-icons/fi'
import { useTheme } from '../contex/ThemeContext'

const API = 'https://jayesh-software-backend.onrender.com'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  // 2FA step
  const [step, setStep] = useState('credentials') // 'credentials' | '2fa'
  const [tempToken, setTempToken] = useState(null)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const otpRefs = useRef([])

  const navigate = useNavigate()
  const { login } = useAuth()
  const { theme, toggleTheme } = useTheme()

  // Auto-focus first OTP box when entering 2FA step
  useEffect(() => {
    if (step === '2fa') {
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    }
  }, [step])

  const handleCredentials = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password })
      if (res.data.requiresTwoFactor) {
        setTempToken(res.data.tempToken)
        setStep('2fa')
        toast.info('Enter the code from your authenticator app')
      } else if (res.data.success) {
        login(res.data.user, res.data.token)
        toast.success(`Welcome back, ${res.data.user.name}!`)
        navigate('/')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  const handleOtpChange = (index, value) => {
    // Allow paste of full 6-digit code
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('')
      const next = [...otp]
      digits.forEach((d, i) => { if (index + i < 6) next[index + i] = d })
      setOtp(next)
      const focusIdx = Math.min(index + digits.length, 5)
      otpRefs.current[focusIdx]?.focus()
      return
    }
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify2FA = async e => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length !== 6) { toast.error('Enter all 6 digits'); return }
    setLoading(true)
    try {
      const res = await axios.post(`${API}/api/auth/login/2fa`, { tempToken, code })
      if (res.data.success) {
        login(res.data.user, res.data.token)
        toast.success(`Welcome back, ${res.data.user.name}!`)
        navigate('/')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid code')
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <button
        onClick={toggleTheme}
        style={{ position: 'fixed', top: 16, right: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13 }}
      >
        {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
      </button>

      <div className="auth-card">
        <div className="auth-logo">
          <div className="brand-icon">📝</div>
          <div>
            <div className="brand-name">NoteApp</div>
            <div className="brand-sub">Your workspace</div>
          </div>
        </div>

        {/* ── Step 1: Email + Password ── */}
        {step === 'credentials' && (
          <>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-sub" style={{ marginBottom: 28 }}>Sign in to your account to continue</p>

            <form onSubmit={handleCredentials} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <div style={{ position: 'relative' }}>
                  <FiMail style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 15 }} />
                  <input
                    id="email" type="email" className="form-input"
                    style={{ paddingLeft: 38 }}
                    placeholder="name@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 15 }} />
                  <input
                    id="password" type={showPass ? 'text' : 'password'} className="form-input"
                    style={{ paddingLeft: 38, paddingRight: 42 }}
                    placeholder="Your password"
                    value={password} onChange={e => setPassword(e.target.value)} required
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  >
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ height: 42, fontSize: 14, marginTop: 4, justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
            </div>
          </>
        )}

        {/* ── Step 2: TOTP code ── */}
        {step === '2fa' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <button
                onClick={() => { setStep('credentials'); setOtp(['', '', '', '', '', '']); setTempToken(null) }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}
              >
                <FiArrowLeft /> Back
              </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 24 }}>
                <FiShield style={{ color: 'var(--accent)', fontSize: 26 }} />
              </div>
              <h1 className="auth-title">Two-factor authentication</h1>
              <p className="auth-sub">Open your authenticator app and enter the 6-digit code for NoteApp</p>
            </div>

            <form onSubmit={handleVerify2FA} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* OTP boxes */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    style={{
                      width: 46, height: 54, textAlign: 'center', fontSize: 22, fontWeight: 700,
                      border: '2px solid', borderColor: digit ? 'var(--accent)' : 'var(--border)',
                      borderRadius: 10, background: 'var(--bg-input)', color: 'var(--text-primary)',
                      outline: 'none', transition: 'border-color 0.15s',
                      caretColor: 'var(--accent)'
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = digit ? 'var(--accent)' : 'var(--border)'}
                  />
                ))}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ height: 42, fontSize: 14, justifyContent: 'center' }}
                disabled={loading || otp.join('').length !== 6}
              >
                {loading ? 'Verifying…' : 'Verify & Sign in'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Use Google Authenticator, Microsoft Authenticator, or any TOTP-compatible app.
            </p>
          </>
        )}
      </div>
    </div>
  )
}