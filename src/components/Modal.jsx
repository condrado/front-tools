import React from 'react'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  // Cerrar al hacer click fuera del contenido
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} className="size-20" />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
      <style jsx="true">{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1rem;
        }
        .modal-content {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 1rem;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .modal-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .modal-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0;
        }
        .modal-close {
          background: none;
          border: none;
          padding: 0.5rem;
          cursor: pointer;
          color: var(--text-color);
          opacity: 0.5;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
          transition: var(--transition);
        }
        .modal-close:hover {
          background: var(--hover-color);
          opacity: 1;
        }
        .modal-body {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
        }
      `}</style>
    </div>
  )
}

export default Modal
