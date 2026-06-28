// import React, { useState, useEffect, useMemo } from 'react'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import { FiGrid, FiList } from 'react-icons/fi'
// import NoteCard from '../component/NoteCard'
// import ConfirmModal from '../component/ConfirmModal'
// import Topbar from '../component/Topbar'
// import Sidebar from '../component/Sidebar'

// const API = 'https://note-dacr.onrender.com'

// const apiCall = async (method, url, data, token) => {
//   try {
//     const res = await axios({ method, url, data, headers: { Authorization: `Bearer ${token}` } })
//     return { ok: true, data: res.data }
//   } catch (err) {
//     const msg = err.response?.data?.message || err.message || 'Request failed'
//     console.error(`API ${method.toUpperCase()} ${url}:`, err.response?.data || err.message)
//     return { ok: false, msg }
//   }
// }

// export default function Archive() {
//   const [notes, setNotes] = useState([])
//   const [archivedNotes, setArchivedNotes] = useState([])
//   const [trashedNotes, setTrashedNotes] = useState([])
//   const [query, setQuery] = useState('')
//   const [view, setView] = useState('grid')
//   const [confirmDelete, setConfirmDelete] = useState(null)
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const token = localStorage.getItem('token')

//   useEffect(() => { fetchAll() }, [])

//   const fetchAll = async () => {
//     const r = await apiCall('get', `${API}/api/note`, null, token)
//     if (!r.ok) { toast.error('Failed to load: ' + r.msg); return }
//     const all = r.data.notes || []
//     setNotes(all.filter(n => !n.archived && !n.trashed))
//     setArchivedNotes(all.filter(n => n.archived && !n.trashed))
//     setTrashedNotes(all.filter(n => n.trashed))
//   }

//   const filtered = useMemo(() =>
//     archivedNotes.filter(n => {
//       const q = query.toLowerCase()
//       return !q || n.title.toLowerCase().includes(q) || (n.description || '').toLowerCase().includes(q)
//     }), [archivedNotes, query])

//   const restore = async (note) => {
//     const r = await apiCall('put', `${API}/api/note/${note._id}`, { archived: false, trashed: false }, token)
//     if (!r.ok) { toast.error('Restore failed: ' + r.msg); return }
//     toast.success('Note restored to Notes')
//     fetchAll()
//   }

//   const trash = async (id) => {
//     const r = await apiCall('put', `${API}/api/note/${id}`, { trashed: true, archived: false }, token)
//     if (!r.ok) { toast.error('Failed: ' + r.msg); return }
//     toast.success('Moved to trash')
//     fetchAll()
//   }

//   return (
//     <div className="app-layout">
//       {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 99 }} />}
//       <Sidebar notes={notes} archivedNotes={archivedNotes} trashedNotes={trashedNotes} onClose={() => setSidebarOpen(false)} />
//       <div className="main-content">
//         <Topbar query={query} onSearch={setQuery} onMenuToggle={() => setSidebarOpen(o => !o)} title="Archive" />
//         <div className="page-content">
//           <div style={{ background: 'var(--warning-light)', color: 'var(--warning)', border: '1px solid', borderColor: 'var(--warning)', borderRadius: 10, padding: '10px 16px', marginBottom: 20, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
//             📦 Archived notes are hidden from your main view. Restore them anytime.
//           </div>
//           <div className="notes-toolbar">
//             <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{filtered.length} archived note{filtered.length !== 1 ? 's' : ''}</span>
//             <div className="view-toggle" style={{ marginLeft: 'auto' }}>
//               <button className={`icon-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}><FiGrid /></button>
//               <button className={`icon-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}><FiList /></button>
//             </div>
//           </div>
//           {filtered.length === 0 ? (
//             <div className="empty-state">
//               <div className="empty-icon">📦</div>
//               <div className="empty-title">Archive is empty</div>
//               <div className="empty-desc">Use the archive button (box icon) on any note card to send it here.</div>
//             </div>
//           ) : (
//             <div className={view === 'grid' ? 'notes-grid' : 'notes-list'}>
//               {filtered.map(note => (
//                 <NoteCard key={note._id} note={note} view={view} mode="archive"
//                   onRestore={restore} onDelete={id => setConfirmDelete(id)} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//       {confirmDelete && (
//         <ConfirmModal title="Move to trash" message="This archived note will be moved to trash." confirmLabel="Move to trash" danger
//           onConfirm={() => { trash(confirmDelete); setConfirmDelete(null) }}
//           onClose={() => setConfirmDelete(null)} />
//       )}
//     </div>
//   )
// }

import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiGrid, FiList } from 'react-icons/fi'
import NoteCard from '../component/NoteCard'
import ConfirmModal from '../component/ConfirmModal'
import Topbar from '../component/Topbar'
import Sidebar from '../component/Sidebar'

const API = 'https://jayesh-software-backend.onrender.com'

const apiCall = async (method, url, data, token) => {
  try {
    const res = await axios({ method, url, data, headers: { Authorization: `Bearer ${token}` } })
    return { ok: true, data: res.data }
  } catch (err) {
    const msg = err.response?.data?.message || err.message || 'Request failed'
    console.error(`API ${method.toUpperCase()} ${url}:`, err.response?.data || err.message)
    return { ok: false, msg }
  }
}

export default function Archive() {
  const [notes, setNotes] = useState([])
  const [archivedNotes, setArchivedNotes] = useState([])
  const [trashedNotes, setTrashedNotes] = useState([])
  const [query, setQuery] = useState('')
  const [view, setView] = useState('grid')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const token = localStorage.getItem('token')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    const r = await apiCall('get', `${API}/api/note`, null, token)
    if (!r.ok) { toast.error('Failed to load: ' + r.msg); return }
    const all = r.data.notes || []
    setNotes(all.filter(n => !n.archived && !n.trashed))
    setArchivedNotes(all.filter(n => n.archived && !n.trashed))
    setTrashedNotes(all.filter(n => n.trashed))
  }

  const filtered = useMemo(() =>
    archivedNotes.filter(n => {
      const q = query.toLowerCase()
      return !q || n.title.toLowerCase().includes(q) || (n.description || '').toLowerCase().includes(q)
    }), [archivedNotes, query])

  const restore = async (note) => {
    const r = await apiCall('put', `${API}/api/note/${note._id}`, { archived: false, trashed: false }, token)
    if (!r.ok) { toast.error('Restore failed: ' + r.msg); return }
    toast.success('Note restored to Notes')
    fetchAll()
  }

  const trash = async (id) => {
    const r = await apiCall('put', `${API}/api/note/${id}`, { trashed: true, archived: false }, token)
    if (!r.ok) { toast.error('Failed: ' + r.msg); return }
    toast.success('Moved to trash')
    fetchAll()
  }

  return (
    <div className="app-layout">
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 99 }} />}
      <Sidebar notes={notes} archivedNotes={archivedNotes} trashedNotes={trashedNotes} onClose={() => setSidebarOpen(false)} isOpen={sidebarOpen} />
      <div className="main-content">
        <Topbar query={query} onSearch={setQuery} onMenuToggle={() => setSidebarOpen(o => !o)} title="Archive" />
        <div className="page-content">
          <div style={{ background: 'var(--warning-light)', color: 'var(--warning)', border: '1px solid', borderColor: 'var(--warning)', borderRadius: 10, padding: '10px 16px', marginBottom: 20, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
            📦 Archived notes are hidden from your main view. Restore them anytime.
          </div>
          <div className="notes-toolbar">
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{filtered.length} archived note{filtered.length !== 1 ? 's' : ''}</span>
            <div className="view-toggle" style={{ marginLeft: 'auto' }}>
              <button className={`icon-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}><FiGrid /></button>
              <button className={`icon-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}><FiList /></button>
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <div className="empty-title">Archive is empty</div>
              <div className="empty-desc">Use the archive button (box icon) on any note card to send it here.</div>
            </div>
          ) : (
            <div className={view === 'grid' ? 'notes-grid' : 'notes-list'}>
              {filtered.map(note => (
                <NoteCard key={note._id} note={note} view={view} mode="archive"
                  onRestore={restore} onDelete={id => setConfirmDelete(id)} />
              ))}
            </div>
          )}
        </div>
      </div>
      {confirmDelete && (
        <ConfirmModal title="Move to trash" message="This archived note will be moved to trash." confirmLabel="Move to trash" danger
          onConfirm={() => { trash(confirmDelete); setConfirmDelete(null) }}
          onClose={() => setConfirmDelete(null)} />
      )}
    </div>
  )
}