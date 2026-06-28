import React from 'react'
import { FiEdit2, FiTrash2, FiArchive, FiRotateCcw, FiDelete } from 'react-icons/fi'

const COLORS = [
  'var(--accent)', 'var(--teal)', 'var(--purple)',
  '#f59e0b', '#ef4444', '#10b981', '#ec4899', '#06b6d4'
]

function colorForId(id) {
  if (!id) return COLORS[0]
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return COLORS[h % COLORS.length]
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const NoteCard = ({ note, onEdit, onDelete, onArchive, onRestore, onPermanentDelete, view = 'grid', mode = 'active' }) => {
  const accent = colorForId(note._id)
  const isGrid = view === 'grid'
  const isTrashed = mode === 'trash'

  return (
    <div
      className={`note-card ${!isGrid ? 'note-card-list' : ''}`}
      style={{ '--card-accent': accent }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="note-title" style={!isGrid ? { marginBottom: 2 } : {}}>{note.title}</div>
        <p className="note-desc" style={!isGrid ? {} : { marginTop: 6 }}>{note.description}</p>
      </div>

      {isGrid && (
        <div className="note-meta">
          {note.createdAt && <span className="note-date">{formatDate(note.createdAt)}</span>}
          {note.tag && <span className="note-tag">{note.tag}</span>}
        </div>
      )}

      <div className="note-actions" onClick={e => e.stopPropagation()}>
        {!isGrid && note.createdAt && (
          <span className="note-date" style={{ marginRight: 4 }}>{formatDate(note.createdAt)}</span>
        )}

        {isTrashed ? (
          <>
            <button className="note-action-btn restore" onClick={() => onRestore(note)} title="Restore note">
              <FiRotateCcw />
            </button>
            <button className="note-action-btn danger" onClick={() => onPermanentDelete(note._id)} title="Delete forever">
              <FiDelete />
            </button>
          </>
        ) : mode === 'archive' ? (
          <>
            <button className="note-action-btn restore" onClick={() => onRestore(note)} title="Restore note">
              <FiRotateCcw />
            </button>
            <button className="note-action-btn danger" onClick={() => onDelete(note._id)} title="Move to trash">
              <FiTrash2 />
            </button>
          </>
        ) : (
          <>
            <button className="note-action-btn" onClick={() => onEdit(note)} title="Edit note">
              <FiEdit2 />
            </button>
            <button className="note-action-btn archive" onClick={() => onArchive(note._id)} title="Archive note">
              <FiArchive />
            </button>
            <button className="note-action-btn danger" onClick={() => onDelete(note._id)} title="Move to trash">
              <FiTrash2 />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default NoteCard
