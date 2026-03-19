import React, { useState } from 'react'
import { Check, Copy, Maximize2 } from 'lucide-react'
import Modal from '../Modal'

const MultiplesOf8 = ({ height, width }) => {
  const [copied, setCopied] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const baseSize = 16

  const numbers = []
  for (let i = 8; i <= 800; i += 8) {
    numbers.push(i)
  }

  const copyToClipboard = (num) => {
    navigator.clipboard.writeText(num.toString())
    setCopied(num)
    setTimeout(() => setCopied(null), 2000)
  }

  const renderContent = (isModal = false) => (
    <div className={`multiples-grid ${isModal ? 'is-modal' : ''}`}>
      {numbers.map((num) => (
        <button
          key={num}
          className={`number-card ${copied === num ? 'copied' : ''}`}
          onClick={() => copyToClipboard(num)}
        >
          <span className="px-value">{num}</span>
          <span className="rem-value">{(num / baseSize).toFixed(3).replace(/\.?0+$/, '')}</span>
        </button>
      ))}
    </div>
  )

  return (
    <div className="card widget-card" data-h={height} data-col={width}>
      <div className="widget-header">
        <h3 className="widget-title">Múltiplos de 8</h3>
        <button className="maximize-btn" onClick={() => setIsModalOpen(true)}>
          <Maximize2 size={16} className="size-16" />
        </button>
      </div>

      <div className="widget-content">
        {renderContent()}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Múltiplos de 8"
      >
        {renderContent(true)}
      </Modal>

      <style jsx="true">{`
        .multiples-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 0;
          background: var(--border-color);
          border: 1px solid var(--border-color);
          border-radius: 0.25rem; /* 4px */
          overflow: visible;
        }
        .multiples-grid.is-modal {
          grid-template-columns: repeat(16, 1fr);
        }
        @media (max-width: 800px) {
          .multiples-grid.is-modal {
            grid-template-columns: repeat(8, 1fr);
          }
        }
        .number-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.3rem 0;
          background: var(--card-bg);
          border: none;
          border-radius: 0;
          cursor: pointer;
          transition: background 0.1s, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
          position: relative;
          color: var(--text-color);
          z-index: 1;
        }
        .number-card:hover {
          background: var(--card-bg);
          z-index: 50;
          transform: scale(2);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
          border-radius: 0.25rem; /* 4px */
        }
        .number-card.copied {
          background: var(--accent-color);
          color: white;
        }
        .px-value {
          font-weight: 500;
          font-size: 0.7rem;
        }
        .rem-value {
          font-size: 0.55rem;
          opacity: 0.6;
        }
        .copy-indicator {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default MultiplesOf8
