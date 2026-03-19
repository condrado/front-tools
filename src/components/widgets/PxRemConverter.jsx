import React, { useState } from 'react'
import { ArrowRightLeft, Maximize2, Copy, Check } from 'lucide-react'
import Modal from '../Modal'
import { usePersistentState } from '../../hooks/usePersistentState'

const PxRemConverter = ({ height, width }) => {
  const [state, setState] = usePersistentState('px_rem_conv', {
    px: '16',
    rem: '1',
    base: '16'
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copied, setCopied] = useState(null)

  const { px, rem, base } = state

  const updateState = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }))
  }

  const handlePxChange = (e) => {
    const value = e.target.value
    const newState = { ...state, px: value }
    if (value && !isNaN(value)) {
      newState.rem = (parseFloat(value) / parseFloat(base)).toFixed(3).replace(/\.?0+$/, '')
    } else {
      newState.rem = ''
    }
    setState(newState)
  }

  const handleRemChange = (e) => {
    const value = e.target.value
    const newState = { ...state, rem: value }
    if (value && !isNaN(value)) {
      newState.px = (parseFloat(value) * parseFloat(base)).toFixed(0)
    } else {
      newState.px = ''
    }
    setState(newState)
  }

  const handleBaseChange = (e) => {
    const newBase = e.target.value
    const newState = { ...state, base: newBase }
    if (px && !isNaN(px) && newBase && !isNaN(newBase)) {
      newState.rem = (parseFloat(px) / parseFloat(newBase)).toFixed(3).replace(/\.?0+$/, '')
    }
    setState(newState)
  }

  const copyToClipboard = (value, unit) => {
    if (!value) return
    const text = `${value}${unit}`
    navigator.clipboard.writeText(text)
    setCopied(unit)
    setTimeout(() => setCopied(null), 2000)
  }

  const renderContent = () => (
    <>
      <div className="converter-inputs">
        <div className="input-group">
          <label>Píxeles (px)</label>
          <div className="input-with-action">
            <input
              type="number"
              value={px}
              onChange={handlePxChange}
              placeholder="32"
            />
            <button
              className={`copy-input-btn ${copied === 'px' ? 'copied' : ''}`}
              onClick={() => copyToClipboard(px, 'px')}
              title="Copiar con px"
            >
              {copied === 'px' ? <Check size={14} className="size-14" /> : <Copy size={14} className="size-14" />}
            </button>
          </div>
        </div>

        <div className="icon-wrapper">
          <ArrowRightLeft size={20} className="size-20 conversion-icon" />
        </div>

        <div className="input-group">
          <label>REM (rem)</label>
          <div className="input-with-action">
            <input
              type="number"
              value={rem}
              onChange={handleRemChange}
              placeholder="2"
              step="0.01"
            />
            <button
              className={`copy-input-btn ${copied === 'rem' ? 'copied' : ''}`}
              onClick={() => copyToClipboard(rem, 'rem')}
              title="Copiar con rem"
            >
              {copied === 'rem' ? <Check size={14} className="size-14" /> : <Copy size={14} className="size-14" />}
            </button>
          </div>
        </div>
      </div>

      <div className="reference-section">
        <label>Base de conversión (1rem = ?px)</label>
        <div className="base-input-wrapper">
          <input
            type="number"
            value={base}
            onChange={handleBaseChange}
            className="base-input"
          />
          <span className="unit">px</span>
        </div>
        <p className="hint">Normalmente es 16px, pero puedes ajustarlo según tu proyecto.</p>
      </div>
    </>
  )

  return (
    <div className="card converter-card" data-h={height} data-col={width}>
      <div className="widget-header">
        <h3 className="widget-title">Conversor Px/REM</h3>
        <button className="maximize-btn" onClick={() => setIsModalOpen(true)}>
          <Maximize2 size={16} className="size-16" />
        </button>
      </div>

      {renderContent()}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Conversor Px/REM"
      >
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          {renderContent()}
        </div>
      </Modal>
      <style jsx="true">{`
        .converter-card {
          display: flex;
          flex-direction: column;
        }
        .converter-inputs {
          display: flex;
          align-items: flex-end;
          gap: 1rem;
          padding-bottom: 1.25rem;
        }
        .input-group {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .input-with-action {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-with-action input {
          padding-right: 2.5rem;
        }
        .copy-input-btn {
          position: absolute;
          right: 0.5rem;
          background: none;
          border: none;
          color: var(--text-color);
          opacity: 0.3;
          padding: 0.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.25rem; /* 4px */
        }
        .copy-input-btn:hover {
          opacity: 1;
          background: var(--hover-color);
        }
        .copy-input-btn.copied {
          color: var(--accent-color);
          opacity: 1;
        }
        .input-group label {
          font-size: 0.75rem;
          font-weight: 400;
          opacity: 0.7;
          margin-bottom: 0.4rem;
        }
        .icon-wrapper {
          color: var(--accent-color);
        }
        .reference-section {
          padding-top: 0;
        }
        .reference-section label {
          font-size: 0.75rem;
          font-weight: 400;
          opacity: 0.7;
          display: block;
          margin-bottom: 0.4rem;
        }
        .base-input-wrapper {
          position: relative;
          max-width: 7.5rem; /* 120px */
        }
        .base-input {
          padding-right: 2.5rem;
        }
        .unit {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.875rem;
          opacity: 0.5;
          pointer-events: none;
        }
        .hint {
          font-size: 0.75rem;
          opacity: 0.6;
          margin-top: 0.5rem;
        }
        @media (max-width: 480px) {
          .converter-inputs {
            flex-direction: column;
            align-items: center;
          }
          .icon-wrapper {
            transform: rotate(90deg);
          }
        }
      `}</style>
    </div>
  )
}

export default PxRemConverter
