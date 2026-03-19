import React, { useState, useEffect } from 'react'
import { Copy, Check, Calculator, Maximize2 } from 'lucide-react'
import Modal from '../Modal'
import { usePersistentState } from '../../hooks/usePersistentState'

const ClampCalculator = ({ height, width }) => {
  const [state, setState] = usePersistentState('clamp_calc', {
    minSize: '16',
    maxSize: '48',
    minVW: '320',
    maxVW: '1280',
    format: 'css'
  })

  const [clampResult, setClampResult] = useState('')
  const [copied, setCopied] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { minSize, maxSize, minVW, maxVW, format = 'css' } = state

  const updateState = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    calculateClamp()
  }, [minSize, maxSize, minVW, maxVW])

  const calculateClamp = () => {
    const minS = parseFloat(minSize)
    const maxS = parseFloat(maxSize)
    const minV = parseFloat(minVW)
    const maxV = parseFloat(maxVW)

    if (isNaN(minS) || isNaN(maxS) || isNaN(minV) || isNaN(maxV)) return

    const slope = (maxS - minS) / (maxV - minV)
    const yAxisIntersection = -minV * slope + minS
    const preferredValue = `${(yAxisIntersection / 16).toFixed(3)}rem + ${(slope * 100).toFixed(3)}vw`

    const result = `clamp(${(minS / 16).toFixed(3)}rem, ${preferredValue}, ${(maxS / 16).toFixed(3)}rem)`
    setClampResult(result)
  }

  const codeContent = format === 'css' ? `font-size: ${clampResult};` : `$fluid-size: ${clampResult};`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderContent = () => (
    <>
      <div className="inputs-grid">
        <div className="input-field">
          <label>Min Size (px)</label>
          <input type="number" value={minSize} onChange={(e) => updateState('minSize', e.target.value)} />
        </div>
        <div className="input-field">
          <label>Max Size (px)</label>
          <input type="number" value={maxSize} onChange={(e) => updateState('maxSize', e.target.value)} />
        </div>
        <div className="input-field">
          <label>Min Viewport (px)</label>
          <input type="number" value={minVW} onChange={(e) => updateState('minVW', e.target.value)} />
        </div>
        <div className="input-field">
          <label>Max Viewport (px)</label>
          <input type="number" value={maxVW} onChange={(e) => updateState('maxVW', e.target.value)} />
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
            {copied ? <Check size={16} className="size-16" /> : <Copy size={16} className="size-16" />}
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className="card clamp-card" data-h={height} data-col={width}>
      <div className="widget-header">
        <h3 className="widget-title">Calculadora Clamp()</h3>
        <button className="maximize-btn" onClick={() => setIsModalOpen(true)}>
          <Maximize2 size={16} className="size-16" />
        </button>
      </div>

      {renderContent()}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Calculadora Clamp()"
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {renderContent()}
        </div>
      </Modal>

      <style jsx="true">{`
        .clamp-card {
           display: flex;
           flex-direction: column;
        }
        .inputs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          padding-bottom: 1.25rem;
        }
        .input-field {
          display: flex;
          flex-direction: column;
        }
        .input-field label {
          font-size: 0.75rem;
          font-weight: 400;
          opacity: 0.7;
          margin-bottom: 0.4rem;
        }
      `}</style>
    </div>
  )
}

export default ClampCalculator
