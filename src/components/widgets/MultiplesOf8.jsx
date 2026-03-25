import React, { useState, useEffect } from 'react'
import { Check, Copy, Maximize2, Settings2 } from 'lucide-react'
import Modal from '../Modal'
import { usePersistentState } from '../../hooks/usePersistentState'

const MultiplesOf8 = ({ height, width }) => {
  const [copied, setCopied] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [step, setStep] = usePersistentState('multiples_step', 8)
  const baseSize = 16

  const numbers = []
  const maxVal = 800
  for (let i = step; i <= maxVal; i += step) {
    numbers.push(i)
  }

  const copyToClipboard = (num) => {
    navigator.clipboard.writeText(num.toString())
    setCopied(num)
    setTimeout(() => setCopied(null), 2000)
  }

  const renderContent = (isModal = false) => (
    <div className={`multiples-grid ${isModal ? 'is-modal' : ''}`}>
      {numbers.slice(0, isModal ? 200 : 100).map((num) => (
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 className="widget-title">Múltiplos</h3>
          <div className="step-selector">
            <Settings2 size={12} style={{ opacity: 0.4 }} />
            <input 
              type="number" 
              value={step} 
              onChange={(e) => setStep(Math.max(1, parseInt(e.target.value) || 1))}
              className="step-input"
            />
          </div>
        </div>
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
        title={`Múltiplos de ${step}`}
      >
        {renderContent(true)}
      </Modal>

      <style jsx="true">{`
        .step-selector { display: flex; align-items: center; gap: 4px; background: var(--hover-color); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border-color); }
        .step-input { background: none; border: none; color: var(--text-color); font-size: 0.7rem; font-weight: 700; width: 3.75rem; outline: none; -moz-appearance: textfield; }
        .step-input::-webkit-inner-spin-button, .step-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }

        .multiples-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 0;
          background: var(--border-color);
          border: 1px solid var(--border-color);
          border-radius: 0.25rem;
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
          cursor: pointer;
          transition: all 0.1s;
          position: relative;
          color: var(--text-color);
          z-index: 1;
        }
        .number-card:hover {
          background: var(--card-bg);
          z-index: 50;
          transform: scale(2);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          border-radius: 0.25rem;
        }
        .number-card.copied {
          background: var(--accent-color);
          color: white;
        }
        .px-value { font-weight: 500; font-size: 0.7rem; }
        .rem-value { font-size: 0.55rem; opacity: 0.6; }
      `}</style>
    </div>
  )
}

export default MultiplesOf8
