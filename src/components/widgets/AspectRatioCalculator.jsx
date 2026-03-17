import React, { useState, useEffect } from 'react'
import { Maximize2, MoveDiagonal, Copy, Check } from 'lucide-react'
import Modal from '../Modal'
import { usePersistentState } from '../../hooks/usePersistentState'

const AspectRatioCalculator = () => {
  const [state, setState] = usePersistentState('aspect_ratio_calc', {
    w1: 1920,
    h1: 1080,
    w2: 1080,
    h2: 0,
    lockRatio: true
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const { w1, h1, w2, h2 } = state

  useEffect(() => {
    calculateNewHeight(w2)
  }, [w1, h1])

  const calculateNewHeight = (newW) => {
    const ratio = w1 / h1
    const newH = Math.round(newW / ratio)
    setState(prev => ({ ...prev, w2: newW, h2: newH }))
  }

  const handleW2Change = (e) => {
    const val = e.target.value === '' ? '' : parseFloat(e.target.value)
    if (val === '') {
      setState(prev => ({ ...prev, w2: '', h2: '' }))
      return
    }
    const ratio = w1 / h1
    const newH = Math.round(val / ratio)
    setState(prev => ({ ...prev, w2: val, h2: newH }))
  }

  const handleH2Change = (e) => {
    const val = e.target.value === '' ? '' : parseFloat(e.target.value)
    if (val === '') {
      setState(prev => ({ ...prev, w2: '', h2: '' }))
      return
    }
    const ratio = w1 / h1
    const newW = Math.round(val * ratio)
    setState(prev => ({ ...prev, w2: newW, h2: val }))
  }

  const copyResult = () => {
    navigator.clipboard.writeText(`${w2}x${h2}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderContent = () => (
    <>
      <div className="ratio-input-group">
        <div className="section-label">Ratio Original</div>
        <div className="inputs-row">
          <div className="input-field">
            <input 
              type="number" 
              value={w1} 
              onChange={(e) => setState(prev => ({ ...prev, w1: parseFloat(e.target.value) || 0 }))}
              placeholder="W"
            />
          </div>
          <span className="separator">:</span>
          <div className="input-field">
            <input 
              type="number" 
              value={h1} 
              onChange={(e) => setState(prev => ({ ...prev, h1: parseFloat(e.target.value) || 0 }))}
              placeholder="H"
            />
          </div>
        </div>
      </div>

      <div className="ratio-visualizer">
         <div className="ratio-box-outer">
            <div className="ratio-box-inner" style={{ aspectRatio: `${w1}/${h1}` }}>
               <span>{((w1/h1) || 0).toFixed(2)}:1</span>
            </div>
         </div>
      </div>

      <div className="target-input-group">
        <div className="section-label">Cálculo Objetivo</div>
        <div className="inputs-row">
          <div className="input-field">
            <label>Ancho (px)</label>
            <input type="number" value={w2} onChange={handleW2Change} />
          </div>
          <div className="icon-link">
             <MoveDiagonal size={16} />
          </div>
          <div className="input-field">
            <label>Alto (px)</label>
            <input type="number" value={h2} onChange={handleH2Change} />
          </div>
        </div>
      </div>

      <button className="copy-btn" onClick={copyResult}>
        {copied ? <Check size={16} /> : <Copy size={16} />}
        <span>{copied ? 'Copiado' : 'Copiar Dimensiones'}</span>
      </button>
    </>
  )

  return (
    <div className="card aspect-ratio-card" data-col="7">
      <div className="widget-header">
        <h3 className="widget-title">Calculadora de Ratio</h3>
        <button className="maximize-btn" onClick={() => setIsModalOpen(true)}>
          <Maximize2 size={16} />
        </button>
      </div>

      {renderContent()}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Calculadora de Aspect Ratio">
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          {renderContent()}
        </div>
      </Modal>

      <style jsx="true">{`
        .aspect-ratio-card {
          display: flex;
          flex-direction: column;
        }
        .section-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          opacity: 0.5;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        .inputs-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .input-field {
          flex: 1;
        }
        .input-field input {
          padding: 0.5rem !important;
          font-size: 0.9rem;
          text-align: center;
        }
        .input-field label {
          display: block;
          font-size: 0.75rem;
          margin-bottom: 0.25rem;
          opacity: 0.7;
        }
        .separator {
          opacity: 0.5;
          font-weight: bold;
        }
        .ratio-visualizer {
          background: var(--bg-color);
          border: 1px dashed var(--border-color);
          border-radius: 8px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          padding: 1.5rem;
          overflow: hidden;
        }
        .ratio-box-outer {
           width: 100%;
           height: 100%;
           display: flex;
           align-items: center;
           justify-content: center;
        }
        .ratio-box-inner {
          background: rgba(var(--accent-color-rgb), 0.15);
          border: 2px solid var(--accent-color);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-color);
          font-weight: 700;
          font-size: 0.8rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          
          /* Lógica de dimensionado proporcial: 
             Si el ratio es muy ancho (frente al contenedor), ocupamos el 100% del ancho.
             De lo contrario, ocupamos el 100% del alto disponible.
          */
          aspect-ratio: ${w1 || 1} / ${h1 || 1};
          width: ${(w1 || 1) / (h1 || 1) > 2.5 ? '100%' : 'auto'};
          height: ${(w1 || 1) / (h1 || 1) > 2.5 ? 'auto' : '100%'};
          max-width: 100%;
          max-height: 100%;
        }
        .icon-link {
          opacity: 0.3;
          padding-top: 1.25rem;
        }
        .copy-btn {
          margin-top: auto;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem !important;
        }
      `}</style>
    </div>
  )
}

export default AspectRatioCalculator
