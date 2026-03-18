import React, { useState, useEffect } from 'react'
import { Copy, Check, Maximize2 } from 'lucide-react'
import Modal from '../Modal'
import { usePersistentState } from '../../hooks/usePersistentState'

const ShadowGenerator = ({ height, width }) => {
  const [state, setState] = usePersistentState('shadow_gen', {
    hOffset: 0,
    vOffset: 10,
    blur: 25,
    spread: -5,
    opacity: 0.1,
    color: '#000000',
    format: 'css'
  })

  const [copied, setCopied] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { hOffset, vOffset, blur, spread, opacity, color, format = 'css' } = state

  const updateState = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }))
  }

  const shadowCSS = `${hOffset}px ${vOffset}px ${blur}px ${spread}px ${hexToRgba(color, opacity)}`
  const codeContent = format === 'css' ? `box-shadow: ${shadowCSS};` : `$shadow: ${shadowCSS};`

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderContent = () => (
    <>
      <div className="preview-container widget-preview">
        <div className="preview-box" style={{ boxShadow: shadowCSS }}>
          Previsualización
        </div>
      </div>

      <div className="controls">
        <div className="control-group">
          <label>Horizontal: {hOffset}px</label>
          <input type="range" min="-50" max="50" value={hOffset} onChange={(e) => updateState('hOffset', e.target.value)} />
        </div>
        <div className="control-group">
          <label>Vertical: {vOffset}px</label>
          <input type="range" min="-50" max="50" value={vOffset} onChange={(e) => updateState('vOffset', e.target.value)} />
        </div>
        <div className="control-group">
          <label>Blur: {blur}px</label>
          <input type="range" min="0" max="100" value={blur} onChange={(e) => updateState('blur', e.target.value)} />
        </div>
        <div className="control-group">
          <label>Spread: {spread}px</label>
          <input type="range" min="-50" max="50" value={spread} onChange={(e) => updateState('spread', e.target.value)} />
        </div>
        <div className="control-group">
          <label>Opacidad: {opacity}</label>
          <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={(e) => updateState('opacity', e.target.value)} />
        </div>
        <div className="control-group color-group">
          <label>Color de Sombra</label>
          <div className="color-field">
            <input type="color" value={color} onChange={(e) => updateState('color', e.target.value)} className="color-picker" />
            <input type="text" value={color} onChange={(e) => updateState('color', e.target.value)} className="color-text" />
          </div>
        </div>
      </div>

      <div className="result-area">
        <div className="code-header">
          <span className="code-label">Código {format.toUpperCase()}</span>
          <div className="format-toggle">
            <button
              className={format === 'css' ? 'active' : ''}
              onClick={() => updateState('format', 'css')}
            >CSS</button>
            <button
              className={format === 'scss' ? 'active' : ''}
              onClick={() => updateState('format', 'scss')}
            >SCSS</button>
          </div>
        </div>
        <div className="result-box">
          <code>{codeContent}</code>
          <button className="icon-copy-btn" onClick={copyToClipboard} title="Copiar código">
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className="card shadow-generator" data-h={height} data-col={width}>
      <div className="widget-header">
        <h3 className="widget-title">Generador de Sombras</h3>
        <button className="maximize-btn" onClick={() => setIsModalOpen(true)}>
          <Maximize2 size={16} />
        </button>
      </div>

      {renderContent()}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generador de Sombras"
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {renderContent()}
        </div>
      </Modal>

      <style jsx="true">{`
        .shadow-generator {
          display: flex;
          flex-direction: column;
        }
        .preview-container {
          padding: 1.5rem;
          justify-content: center;
        }
        .preview-box {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: #666;
        }
        [data-theme='dark'] .preview-box {
            background: #1e293b;
            color: #94a3b8;
        }
        .controls {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-bottom: 1.25rem;
        }
        .color-field {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .color-picker {
          width: 40px !important;
          height: 40px !important;
          padding: 0 !important;
          border-radius: 6px !important;
          cursor: pointer;
        }
        .color-text {
          flex: 1;
        }
        .control-group {
          display: flex;
          flex-direction: column;
        }
        .control-group label {
          font-size: 0.75rem;
          font-weight: 400;
          opacity: 0.7;
          margin-bottom: 0.4rem;
        }
        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .code-label {
          font-size: 0.75rem;
          font-weight: 500;
          opacity: 0.5;
        }
        .format-toggle {
          display: flex;
          background: var(--hover-color);
          padding: 2px;
          border-radius: 6px;
        }
        .format-toggle button {
          padding: 0.25rem 0.6rem;
          font-size: 0.7rem;
          background: none;
          color: var(--text-color);
          opacity: 0.6;
          border-radius: 4px;
        }
        .format-toggle button.active {
          background: var(--card-bg);
          opacity: 1;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        input[type="range"] {
          appearance: none;
          background: var(--border-color);
          height: 4px;
          border-radius: 2px;
          width: 100%;
          outline: none;
          padding: 0;
          border: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: var(--accent-color);
          border-radius: 50%;
          cursor: pointer;
          transition: transform 0.1s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  )
}

export default ShadowGenerator
