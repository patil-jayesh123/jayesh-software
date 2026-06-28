// import React, { useState } from 'react'
// import axios from 'axios'
// import { Link, useNavigate } from 'react-router-dom'
// import { useAuth } from '../contex/ContextProvider'
// import { toast } from 'react-toastify'
// import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
// import { useTheme } from '../contex/ThemeContext'

// const API = 'https://note-dacr.onrender.com'

// export default function Register() {
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [showPass, setShowPass] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const navigate = useNavigate()
//   const { login } = useAuth()
//   const { theme, toggleTheme } = useTheme()

//   const handleSubmit = async e => {
//     e.preventDefault()
//     if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }
//     setLoading(true)
//     try {
//       const res = await axios.post(`${API}/api/auth/register`, { name, email, password })
//       if (res.data.success) {
//         login(res.data.user, res.data.token)
//         toast.success('Account created!')
//         navigate('/')
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Registration failed')
//     } finally { setLoading(false) }
//   }

//   return (
//     <div className="auth-page">
//       <button
//         onClick={toggleTheme}
//         style={{ position: 'fixed', top: 16, right: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13 }}
//       >
//         {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
//       </button>

//       <div className="auth-card">
//         <div className="auth-logo">
//           <div className="brand-icon">📝</div>
//           <div>
//             <div className="brand-name">NoteApp</div>
//             <div className="brand-sub">Your workspace</div>
//           </div>
//         </div>

//         <h1 className="auth-title">Create your account</h1>
//         <p className="auth-sub" style={{ marginBottom: 28 }}>Start organizing your thoughts today</p>

//         <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//           <div className="form-group">
//             <label className="form-label" htmlFor="name">Full name</label>
//             <div style={{ position: 'relative' }}>
//               <FiUser style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 15 }} />
//               <input
//                 id="name" type="text" className="form-input"
//                 style={{ paddingLeft: 38 }}
//                 placeholder="Jane Doe"
//                 value={name} onChange={e => setName(e.target.value)} required
//               />
//             </div>
//           </div>

//           <div className="form-group">
//             <label className="form-label" htmlFor="email">Email</label>
//             <div style={{ position: 'relative' }}>
//               <FiMail style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 15 }} />
//               <input
//                 id="email" type="email" className="form-input"
//                 style={{ paddingLeft: 38 }}
//                 placeholder="name@example.com"
//                 value={email} onChange={e => setEmail(e.target.value)} required
//               />
//             </div>
//           </div>

//           <div className="form-group">
//             <label className="form-label" htmlFor="password">Password</label>
//             <div style={{ position: 'relative' }}>
//               <FiLock style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 15 }} />
//               <input
//                 id="password" type={showPass ? 'text' : 'password'} className="form-input"
//                 style={{ paddingLeft: 38, paddingRight: 42 }}
//                 placeholder="At least 6 characters"
//                 value={password} onChange={e => setPassword(e.target.value)} required
//               />
//               <button type="button" onClick={() => setShowPass(s => !s)}
//                 style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
//               >
//                 {showPass ? <FiEyeOff /> : <FiEye />}
//               </button>
//             </div>
//             {password && (
//               <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
//                 {[1,2,3,4].map(i => (
//                   <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: password.length >= i * 3 ? (password.length >= 10 ? 'var(--success)' : password.length >= 6 ? 'var(--warning)' : 'var(--danger)') : 'var(--border)' }} />
//                 ))}
//               </div>
//             )}
//           </div>

//           <button type="submit" className="btn btn-primary" style={{ height: 42, fontSize: 14, marginTop: 4, justifyContent: 'center' }} disabled={loading}>
//             {loading ? 'Creating account…' : 'Create account'}
//           </button>
//         </form>

//         <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
//           Already have an account?{' '}
//           <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
//         </div>
//       </div>
//     </div>
//   )
// }


import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contex/ContextProvider'
import { toast } from 'react-toastify'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useTheme } from '../contex/ThemeContext'

const API = 'https://jayesh-software-backend.onrender.com'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const handleSubmit = async e => {
    e.preventDefault()
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const res = await axios.post(`${API}/api/auth/register`, { name, email, password })
      if (res.data.success) {
        login(res.data.user, res.data.token)
        toast.success('Account created!')
        navigate('/')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
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

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub" style={{ marginBottom: 28 }}>Start organizing your thoughts today</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full name</label>
            <div style={{ position: 'relative' }}>
              <FiUser style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 15 }} />
              <input
                id="name" type="text" className="form-input"
                style={{ paddingLeft: 38 }}
                placeholder="Jane Doe"
                value={name} onChange={e => setName(e.target.value)} required
              />
            </div>
          </div>

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
                placeholder="At least 6 characters"
                value={password} onChange={e => setPassword(e.target.value)} required
              />
              <button type="button" onClick={() => setShowPass(s => !s)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {password && (
              <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: password.length >= i * 3 ? (password.length >= 10 ? 'var(--success)' : password.length >= 6 ? 'var(--warning)' : 'var(--danger)') : 'var(--border)' }} />
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: 42, fontSize: 14, marginTop: 4, justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </div>
      </div>
    </div>
  )
}