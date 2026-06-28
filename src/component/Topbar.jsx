import React from 'react'
import { FiSearch, FiSun, FiMoon, FiMenu, FiPlus } from 'react-icons/fi'
import { useTheme } from '../contex/ThemeContext'
import { useAuth } from '../contex/ContextProvider'
import { Link, useNavigate } from 'react-router-dom'

const Topbar = ({ onSearch, query, onNewNote, onMenuToggle, title }) => {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <header className="topbar">
      <button className="icon-btn sidebar-toggle" onClick={onMenuToggle} aria-label="Toggle sidebar">
        <FiMenu />
      </button>

      {title && (
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
          {title}
        </span>
      )}

      {onSearch !== undefined && (
        <div className="topbar-search">
          <FiSearch className="search-icon" aria-hidden />
          <input
            type="text"
            placeholder="Search notes…"
            value={query || ''}
            onChange={e => onSearch(e.target.value)}
            aria-label="Search notes"
          />
        </div>
      )}

      <div className="topbar-actions">
        {onNewNote && (
          <button className="btn btn-primary btn-sm" onClick={onNewNote}>
            <FiPlus style={{ fontSize: 15 }} /> New note
          </button>
        )}

        <button className="icon-btn" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>

        {user ? (
          <div
            className="avatar"
            style={{ width: 34, height: 34, fontSize: 13, cursor: 'pointer', border: '2px solid var(--accent)' }}
            onClick={() => navigate('/profile')}
            title={user.name}
          >
            {user.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : initials}
          </div>
        ) : (
          <Link to="/login" className="btn btn-secondary btn-sm">Sign in</Link>
        )}
      </div>
    </header>
  )
}

export default Topbar
