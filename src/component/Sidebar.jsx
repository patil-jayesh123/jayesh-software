import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contex/ContextProvider'
import { FiBook, FiArchive, FiTrash2, FiUser, FiSettings, FiHome } from 'react-icons/fi'

const Sidebar = ({ notes = [], archivedNotes = [], trashedNotes = [], onClose }) => {
  const { user } = useAuth()
  const location = useLocation()
  const path = location.pathname

  const nav = [
    { to: '/', icon: <FiHome />, label: 'Home', exact: true },
    { to: '/notes', icon: <FiBook />, label: 'Notes', badge: notes.length },
    { to: '/archive', icon: <FiArchive />, label: 'Archive', badge: archivedNotes.length },
    { to: '/trash', icon: <FiTrash2 />, label: 'Trash', badge: trashedNotes.length },
  ]

  const isActive = (to, exact) => exact ? path === to : path.startsWith(to)

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">📝</div>
        <div>
          <div className="brand-name">NoteApp</div>
          <div className="brand-sub">Your workspace</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Menu</div>
        {nav.map(({ to, icon, label, badge, exact }) => (
          <Link
            key={to}
            to={to}
            className={`nav-item ${isActive(to, exact) ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">{icon}</span>
            {label}
            {badge != null && <span className="nav-badge">{badge}</span>}
          </Link>
        ))}

        <div className="nav-section-label" style={{ marginTop: 12 }}>Account</div>
        <Link
          to="/profile"
          className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
          onClick={onClose}
        >
          <span className="nav-icon"><FiUser /></span>
          Profile
        </Link>
      </nav>

      <div className="sidebar-footer">
        {user ? (
          <Link to="/profile" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 6px', borderRadius: 8, textDecoration: 'none', transition: 'background 0.18s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
              {user.avatar ? <img src={user.avatar} alt="" /> : initials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>View profile</div>
            </div>
          </Link>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Sign in</Link>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
