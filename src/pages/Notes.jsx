import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiGrid, FiList } from 'react-icons/fi'
import NoteCard from '../component/NoteCard'
import NoteModal from '../component/NoteModal'
import ConfirmModal from '../component/ConfirmModal'
import Topbar from '../component/Topbar'
import Sidebar from '../component/Sidebar'

const API = 'https://note-dacr.onrender.com'

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [archivedNotes, setArchivedNotes] = useState([])
  const [trashedNotes, setTrashedNotes] = useState([])
  const [query, setQuery] = useState('')
  const [view, setView] = useState('grid')
  const [modalOpen, setModalOpen] = useState(false)
  const [editNote, setEditNote] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const token = localStorage.getItem('token')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` }
      const res = await axios.get(`${API}/api/note`, { headers })
      const all = res.data.notes || []
      setNotes(all.filter(n => !n.archived && !n.trashed))
      setArchivedNotes(all.filter(n => n.archived && !n.trashed))
      setTrashedNotes(all.filter(n => n.trashed))
    } catch { toast.error('Failed to load notes') }
  }

  const filtered = useMemo(() =>
    notes.filter(n => {
      const q = query.toLowerCase()
      return !q || n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
    }), [notes, query])

  // tag is now 3rd arg
  const handleSave = async (title, description, tag, id) => {
    try {
      const headers = { Authorization: `Bearer ${token}` }
      if (id) {
        await axios.put(`${API}/api/note/${id}`, { title, description, tag }, { headers })
        toast.success('Note updated')
      } else {
        await axios.post(`${API}/api/note/add`, { title, description, tag }, { headers })
        toast.success('Note added')
      }
      setModalOpen(false); setEditNote(null); fetchAll()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save') }
  }

  const handleArchive = async id => {
    try {
      await axios.put(`${API}/api/note/${id}`, { archived: true }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Note archived'); fetchAll()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to archive') }
  }

  const handleTrash = async id => {
    try {
      await axios.put(`${API}/api/note/${id}`, { trashed: true }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Moved to trash'); fetchAll()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  return (
    <div className="app-layout">
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 99 }} />}
      <Sidebar notes={notes} archivedNotes={archivedNotes} trashedNotes={trashedNotes} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Topbar query={query} onSearch={setQuery} onNewNote={() => { setEditNote(null); setModalOpen(true) }} onMenuToggle={() => setSidebarOpen(o => !o)} title="All Notes" />
        <div className="page-content">
          <div className="notes-toolbar">
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{filtered.length} note{filtered.length !== 1 ? 's' : ''}</span>
            <div className="view-toggle" style={{ marginLeft: 'auto' }}>
              <button className={`icon-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}><FiGrid /></button>
              <button className={`icon-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}><FiList /></button>
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <div className="empty-title">{query ? 'No notes match' : 'No notes yet'}</div>
              <div className="empty-desc">{query ? 'Try a different keyword.' : 'Create your first note to get started.'}</div>
            </div>
          ) : (
            <div className={view === 'grid' ? 'notes-grid' : 'notes-list'}>
              {filtered.map(note => (
                <NoteCard key={note._id} note={note} view={view} mode="active"
                  onEdit={n => { setEditNote(n); setModalOpen(true) }}
                  onArchive={handleArchive}
                  onDelete={id => setConfirmDelete(id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {modalOpen && <NoteModal note={editNote} onClose={() => { setModalOpen(false); setEditNote(null) }} onSave={handleSave} />}
      {confirmDelete && (
        <ConfirmModal title="Move to trash" message="This note will be moved to trash." confirmLabel="Move to trash" danger
          onConfirm={() => { handleTrash(confirmDelete); setConfirmDelete(null) }}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}
