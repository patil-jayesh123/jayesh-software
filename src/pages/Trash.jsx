// import React, { useState, useEffect, useMemo } from 'react'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import { FiGrid, FiList, FiTrash2 } from 'react-icons/fi'
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

// export default function Trash() {
//   const [notes, setNotes] = useState([])
//   const [archivedNotes, setArchivedNotes] = useState([])
//   const [trashedNotes, setTrashedNotes] = useState([])
//   const [query, setQuery] = useState('')
//   const [view, setView] = useState('grid')
//   const [confirmPerm, setConfirmPerm] = useState(null)
//   const [confirmEmptyTrash, setConfirmEmptyTrash] = useState(false)
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
//     trashedNotes.filter(n => {
//       const q = query.toLowerCase()
//       return !q || n.title.toLowerCase().includes(q) || (n.description || '').toLowerCase().includes(q)
//     }), [trashedNotes, query])

//   const restore = async (note) => {
//     const r = await apiCall('put', `${API}/api/note/${note._id}`, { trashed: false, archived: false }, token)
//     if (!r.ok) { toast.error('Restore failed: ' + r.msg); return }
//     toast.success('Note restored to Notes')
//     fetchAll()
//   }

//   const permanentDelete = async (id) => {
//     const r = await apiCall('delete', `${API}/api/note/${id}`, null, token)
//     if (!r.ok) { toast.error('Delete failed: ' + r.msg); return }
//     toast.success('Note permanently deleted')
//     fetchAll()
//   }

//   const emptyTrash = async () => {
//     const results = await Promise.all(
//       trashedNotes.map(n => apiCall('delete', `${API}/api/note/${n._id}`, null, token))
//     )
//     const failed = results.filter(r => !r.ok).length
//     if (failed > 0) toast.error(`${failed} notes could not be deleted`)
//     else toast.success('Trash emptied')
//     fetchAll()
//   }

//   return (
//     <div className="app-layout">
//       {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 99 }} />}
//       <Sidebar notes={notes} archivedNotes={archivedNotes} trashedNotes={trashedNotes} onClose={() => setSidebarOpen(false)} />
//       <div className="main-content">
//         <Topbar query={query} onSearch={setQuery} onMenuToggle={() => setSidebarOpen(o => !o)} title="Trash" />
//         <div className="page-content">
//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
//             <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', border: '1px solid', borderColor: 'var(--danger)', borderRadius: 10, padding: '10px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
//               🗑️ Notes in trash can be restored or permanently deleted.
//             </div>
//             {trashedNotes.length > 0 && (
//               <button className="btn btn-danger btn-sm" onClick={() => setConfirmEmptyTrash(true)}>
//                 <FiTrash2 /> Empty trash
//               </button>
//             )}
//           </div>
//           <div className="notes-toolbar">
//             <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{filtered.length} deleted note{filtered.length !== 1 ? 's' : ''}</span>
//             <div className="view-toggle" style={{ marginLeft: 'auto' }}>
//               <button className={`icon-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}><FiGrid /></button>
//               <button className={`icon-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}><FiList /></button>
//             </div>
//           </div>
//           {filtered.length === 0 ? (
//             <div className="empty-state">
//               <div className="empty-icon">🗑️</div>
//               <div className="empty-title">Trash is empty</div>
//               <div className="empty-desc">Notes you delete will appear here before permanent removal.</div>
//             </div>
//           ) : (
//             <div className={view === 'grid' ? 'notes-grid' : 'notes-list'}>
//               {filtered.map(note => (
//                 <NoteCard key={note._id} note={note} view={view} mode="trash"
//                   onRestore={restore} onPermanentDelete={id => setConfirmPerm(id)} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//       {confirmPerm && (
//         <ConfirmModal title="Delete permanently" message="This note will be deleted forever and cannot be recovered." confirmLabel="Delete forever" danger
//           onConfirm={() => { permanentDelete(confirmPerm); setConfirmPerm(null) }}
//           onClose={() => setConfirmPerm(null)} />
//       )}
//       {confirmEmptyTrash && (
//         <ConfirmModal title="Empty trash" message={`All ${trashedNotes.length} notes will be permanently deleted. This cannot be undone.`} confirmLabel="Empty trash" danger
//           onConfirm={() => { emptyTrash(); setConfirmEmptyTrash(false) }}
//           onClose={() => setConfirmEmptyTrash(false)} />
//       )}
//     </div>
//   )
// }


import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiGrid, FiList, FiTrash2 } from 'react-icons/fi'
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

export default function Trash() {
  const [notes, setNotes] = useState([])
  const [archivedNotes, setArchivedNotes] = useState([])
  const [trashedNotes, setTrashedNotes] = useState([])
  const [query, setQuery] = useState('')
  const [view, setView] = useState('grid')
  const [confirmPerm, setConfirmPerm] = useState(null)
  const [confirmEmptyTrash, setConfirmEmptyTrash] = useState(false)
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
    trashedNotes.filter(n => {
      const q = query.toLowerCase()
      return !q || n.title.toLowerCase().includes(q) || (n.description || '').toLowerCase().includes(q)
    }), [trashedNotes, query])

  const restore = async (note) => {
    const r = await apiCall('put', `${API}/api/note/${note._id}`, { trashed: false, archived: false }, token)
    if (!r.ok) { toast.error('Restore failed: ' + r.msg); return }
    toast.success('Note restored to Notes')
    fetchAll()
  }

  const permanentDelete = async (id) => {
    const r = await apiCall('delete', `${API}/api/note/${id}`, null, token)
    if (!r.ok) { toast.error('Delete failed: ' + r.msg); return }
    toast.success('Note permanently deleted')
    fetchAll()
  }

  const emptyTrash = async () => {
    const results = await Promise.all(
      trashedNotes.map(n => apiCall('delete', `${API}/api/note/${n._id}`, null, token))
    )
    const failed = results.filter(r => !r.ok).length
    if (failed > 0) toast.error(`${failed} notes could not be deleted`)
    else toast.success('Trash emptied')
    fetchAll()
  }

  return (
    <div className="app-layout">
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 99 }} />}
      <Sidebar notes={notes} archivedNotes={archivedNotes} trashedNotes={trashedNotes} onClose={() => setSidebarOpen(false)} isOpen={sidebarOpen} />
      <div className="main-content">
        <Topbar query={query} onSearch={setQuery} onMenuToggle={() => setSidebarOpen(o => !o)} title="Trash" />
        <div className="page-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', border: '1px solid', borderColor: 'var(--danger)', borderRadius: 10, padding: '10px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              🗑️ Notes in trash can be restored or permanently deleted.
            </div>
            {trashedNotes.length > 0 && (
              <button className="btn btn-danger btn-sm" onClick={() => setConfirmEmptyTrash(true)}>
                <FiTrash2 /> Empty trash
              </button>
            )}
          </div>
          <div className="notes-toolbar">
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{filtered.length} deleted note{filtered.length !== 1 ? 's' : ''}</span>
            <div className="view-toggle" style={{ marginLeft: 'auto' }}>
              <button className={`icon-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}><FiGrid /></button>
              <button className={`icon-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}><FiList /></button>
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🗑️</div>
              <div className="empty-title">Trash is empty</div>
              <div className="empty-desc">Notes you delete will appear here before permanent removal.</div>
            </div>
          ) : (
            <div className={view === 'grid' ? 'notes-grid' : 'notes-list'}>
              {filtered.map(note => (
                <NoteCard key={note._id} note={note} view={view} mode="trash"
                  onRestore={restore} onPermanentDelete={id => setConfirmPerm(id)} />
              ))}
            </div>
          )}
        </div>
      </div>
      {confirmPerm && (
        <ConfirmModal title="Delete permanently" message="This note will be deleted forever and cannot be recovered." confirmLabel="Delete forever" danger
          onConfirm={() => { permanentDelete(confirmPerm); setConfirmPerm(null) }}
          onClose={() => setConfirmPerm(null)} />
      )}
      {confirmEmptyTrash && (
        <ConfirmModal title="Empty trash" message={`All ${trashedNotes.length} notes will be permanently deleted. This cannot be undone.`} confirmLabel="Empty trash" danger
          onConfirm={() => { emptyTrash(); setConfirmEmptyTrash(false) }}
          onClose={() => setConfirmEmptyTrash(false)} />
      )}
    </div>
  )
}