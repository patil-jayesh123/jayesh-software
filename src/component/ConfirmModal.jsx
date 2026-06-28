import React from 'react'
import { FiAlertTriangle, FiX } from 'react-icons/fi'

const ConfirmModal = ({ title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onClose }) => (
  <div className="modal-overlay">
    <div className="modal" style={{ maxWidth: 380 }}>
      <div className="modal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {danger && <FiAlertTriangle style={{ color: 'var(--danger)', fontSize: 18 }} />}
          <h2 className="modal-title">{title}</h2>
        </div>
        <button className="icon-btn" onClick={onClose}><FiX /></button>
      </div>
      <div className="modal-body">
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{message}</p>
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
)

export default ConfirmModal
