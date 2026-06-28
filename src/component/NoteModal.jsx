import React, { useState, useEffect } from 'react'
import { FiX } from 'react-icons/fi'

const TAGS = ['personal', 'work', 'ideas', 'other']

const NoteModal = ({ onClose, onSave, note }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tag, setTag] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (note) {
      setTitle(note.title || '')
      setDescription(note.description || '')
      setTag(note.tag || '')
    } else {
      setTitle('')
      setDescription('')
      setTag('')
    }
  }, [note])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    await onSave(title.trim(), description.trim(), tag, note?._id)
    setLoading(false)
  }

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" role="dialog" aria-modal aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">{note ? 'Edit note' : 'New note'}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><FiX /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="note-title">Title</label>
              <input
                id="note-title"
                className="form-input"
                placeholder="Give your note a title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="note-desc">Description</label>
              <textarea
                id="note-desc"
                className="form-textarea"
                placeholder="What's on your mind?"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={5}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {TAGS.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTag(tag === t ? '' : t)}
                    style={{
                      padding: '5px 14px',
                      borderRadius: 99,
                      border: '1px solid',
                      borderColor: tag === t ? 'var(--accent)' : 'var(--border)',
                      background: tag === t ? 'var(--accent-light)' : 'var(--bg-input)',
                      color: tag === t ? 'var(--accent-text)' : 'var(--text-secondary)',
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      textTransform: 'capitalize'
                    }}
                  >
                    {t === 'personal' && '👤 '}
                    {t === 'work' && '💼 '}
                    {t === 'ideas' && '💡 '}
                    {t === 'other' && '📌 '}
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading || !title.trim()}>
              {loading ? 'Saving…' : note ? 'Save changes' : 'Add note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NoteModal
