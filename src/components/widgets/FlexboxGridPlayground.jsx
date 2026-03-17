import React, { useState } from 'react'
import { Copy, Check, Maximize2, LayoutGrid, Rows } from 'lucide-react'
import Modal from '../Modal'
import { usePersistentState } from '../../hooks/usePersistentState'

const FlexboxGridPlayground = () => {
  const [state, setState] = usePersistentState('flex_grid_playground', {
    mode: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1',
    itemCount: 3,
    itemWidth: '40',
    itemHeight: '40',
    unit: 'px',
    gridColumns: 0,
    format: 'css'
  })
  const [copied, setCopied] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const { 
    mode, 
    flexDirection, 
    justifyContent, 
    alignItems, 
    gap = '1', 
    itemCount = 3, 
    itemWidth = '40',
    itemHeight = '40',
    unit = 'px',
    gridColumns = 0,
    format = 'css' 
  } = state

  const updateState = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }))
  }

  const generateCSS = () => {
    const u = unit
    let itemStyles = '\n.item {'
    if (parseFloat(itemWidth) > 0) itemStyles += `\n  width: ${itemWidth}${u};`
    if (parseFloat(itemHeight) > 0) itemStyles += `\n  height: ${itemHeight}${u};`
    itemStyles += '\n}'

    const containerCSS = mode === 'flex' 
      ? `display: flex;\nflex-direction: ${flexDirection};\njustify-content: ${justifyContent};\nalign-items: ${alignItems};\ngap: ${gap}${u};`
      : `display: grid;\ngrid-template-columns: ${gridColumns > 0 ? `repeat(${gridColumns}, 1fr)` : `repeat(auto-fit, minmax(${parseFloat(itemWidth) > 0 ? `${itemWidth}${u}` : '100px'}, 1fr))`};\ngap: ${gap}${u};\nalign-items: ${alignItems};\njustify-items: ${justifyContent};`;

    const combined = containerCSS + itemStyles

    if (format === 'scss') {
      return `@mixin ${mode}-layout {\n  ${combined.replace(/\n/g, '\n  ')}\n}`
    }
    return combined
  }

  const copyCSS = () => {
    navigator.clipboard.writeText(generateCSS())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderContent = () => (
    <>
      <div className="mode-toggle">
        <button 
          className={mode === 'flex' ? 'active' : ''} 
          onClick={() => updateState('mode', 'flex')}
        >
          <Rows size={16} /> Flex
        </button>
        <button 
          className={mode === 'grid' ? 'active' : ''} 
          onClick={() => updateState('mode', 'grid')}
        >
          <LayoutGrid size={16} /> Grid
        </button>
      </div>

      <div className="preview-area">
        <div style={{
          display: mode,
          flexDirection: mode === 'flex' ? flexDirection : undefined,
          justifyContent: justifyContent,
          alignItems: alignItems,
          justifyItems: mode === 'grid' ? justifyContent : undefined,
          gridTemplateColumns: mode === 'grid' 
            ? (gridColumns > 0 ? `repeat(${gridColumns}, 1fr)` : `repeat(auto-fit, minmax(${itemWidth}${unit}, 1fr))`)
            : undefined,
          gap: `${gap}${unit}`,
          width: '100%',
          height: '100%',
          minHeight: '140px',
          background: 'var(--bg-color)',
          border: '1px dashed var(--border-color)',
          borderRadius: '8px',
          padding: '0.75rem',
          overflow: 'auto'
        }}>
          {Array.from({ length: Math.max(1, parseInt(itemCount)) }).map((_, i) => (
            <div 
              key={i} 
              className="playground-item"
              style={{
                width: parseFloat(itemWidth) > 0 ? `${itemWidth}${unit}` : 'auto',
                height: parseFloat(itemHeight) > 0 ? `${itemHeight}${unit}` : 'auto',
                minWidth: parseFloat(itemWidth) === 0 ? '60px' : undefined,
                minHeight: parseFloat(itemHeight) === 0 ? '30px' : undefined,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="playground-controls">
        <div className="controls-header">
           <label className="section-title">Dimensiones</label>
           <div className="unit-toggle">
              <button 
                className={unit === 'px' ? 'active' : ''} 
                onClick={() => updateState('unit', 'px')}
              >PX</button>
              <button 
                className={unit === 'rem' ? 'active' : ''} 
                onClick={() => updateState('unit', 'rem')}
              >REM</button>
           </div>
        </div>
        
        <div className="controls-grid">
           <div className="control-row">
              <label>Items</label>
              <input 
                type="number" 
                value={itemCount} 
                onChange={(e) => updateState('itemCount', e.target.value)} 
                min="1" 
                max="20"
              />
           </div>
            <div className="control-row">
               <label>Gap ({unit})</label>
               <input 
                 type="number" 
                 value={gap} 
                 onChange={(e) => updateState('gap', e.target.value)} 
                 step={unit === 'rem' ? '0.1' : '1'}
                 min="0"
               />
            </div>
            <div className="control-row">
               <label>Item W ({unit})</label>
               <input 
                 type="number" 
                 value={itemWidth} 
                 onChange={(e) => updateState('itemWidth', e.target.value)} 
                 step={unit === 'rem' ? '0.1' : '1'}
                 min="0"
               />
            </div>
            <div className="control-row">
               <label>Item H ({unit})</label>
               <input 
                 type="number" 
                 value={itemHeight} 
                 onChange={(e) => updateState('itemHeight', e.target.value)} 
                 step={unit === 'rem' ? '0.1' : '1'}
                 min="0"
               />
            </div>
        </div>

        <div className="select-controls">
          <div className="control-row">
             <label>Justify</label>
             <select value={justifyContent} onChange={(e) => updateState('justifyContent', e.target.value)}>
                <option value="flex-start">Start</option>
                <option value="center">Center</option>
                <option value="flex-end">End</option>
                <option value="space-between">Between</option>
                <option value="space-around">Around</option>
                <option value="space-evenly">Evenly</option>
             </select>
          </div>
          <div className="control-row">
             <label>Align</label>
             <select value={alignItems} onChange={(e) => updateState('alignItems', e.target.value)}>
                <option value="flex-start">Start</option>
                <option value="center">Center</option>
                <option value="flex-end">End</option>
                <option value="stretch">Stretch</option>
             </select>
          </div>
          {mode === 'flex' ? (
            <div className="control-row">
               <label>Direction</label>
               <select value={flexDirection} onChange={(e) => updateState('flexDirection', e.target.value)}>
                  <option value="row">Row</option>
                  <option value="column">Column</option>
               </select>
            </div>
          ) : (
            <div className="control-row">
              <label>Columns</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="number"
                  value={gridColumns}
                  onChange={(e) => updateState('gridColumns', parseInt(e.target.value) || 0)}
                  min="0"
                  max="12"
                  style={{ width: '50px' }}
                />
                <span style={{ fontSize: '0.65rem', opacity: 0.5, fontWeight: 500 }}>
                  {gridColumns === 0 ? 'AUTO (Resp.)' : 'FIXED'}
                </span>
              </div>
            </div>
          )}
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
          <code>{generateCSS()}</code>
        </div>
        <button className="copy-btn" onClick={copyCSS}>
          {copied ? <Check size={18} /> : <Copy size={18} />}
          <span>{copied ? 'Copiado' : 'Copiar Código'}</span>
        </button>
      </div>
    </>
  )

  return (
    <div className="card playground-card" data-col="12">
      <div className="widget-header">
        <h3 className="widget-title">Flex/Grid Playground</h3>
        <button className="maximize-btn" onClick={() => setIsModalOpen(true)}>
          <Maximize2 size={16} />
        </button>
      </div>

      {renderContent()}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Flexbox & Grid Playground">
         <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {renderContent()}
         </div>
      </Modal>

      <style jsx="true">{`
        .playground-card {
           display: flex;
           flex-direction: column;
        }
         .mode-toggle {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px;
            background: var(--hover-color);
            padding: 4px;
            border-radius: 8px;
            margin-bottom: 1rem;
         }
        .mode-toggle button {
           padding: 0.4rem !important;
           background: transparent;
           color: var(--text-color);
           font-size: 0.8rem;
           display: flex;
           align-items: center;
           justify-content: center;
           gap: 0.5rem;
           opacity: 0.6;
        }
        .mode-toggle button.active {
           background: var(--card-bg);
           opacity: 1;
           box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
         .preview-area {
            flex: 1;
            min-height: 140px;
            margin-bottom: 1rem;
         }
        .playground-item {
           width: 30px;
           height: 30px;
           background: var(--accent-color);
           color: white;
           border-radius: 6px;
           display: flex;
           align-items: center;
           justify-content: center;
           font-weight: 600;
           font-size: 0.8rem;
        }
        .controls-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 0.5rem;
           padding: 0 0.25rem;
        }
         .input-field label {
           font-size: 0.75rem;
           font-weight: 400;
           opacity: 0.7;
         }
        .section-title {
           font-size: 0.75rem;
           font-weight: 600;
           opacity: 0.8;
           text-transform: uppercase;
           letter-spacing: 0.05em;
        }
        .unit-toggle {
           display: flex;
           background: var(--hover-color);
           padding: 2px;
           border-radius: 6px;
        }
        .unit-toggle button {
           padding: 0.2rem 0.5rem;
           font-size: 0.65rem;
           background: none;
           color: var(--text-color);
           opacity: 0.6;
           border-radius: 4px;
           font-weight: 600;
        }
        .unit-toggle button.active {
           background: var(--card-bg);
           opacity: 1;
           box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .playground-controls {
           display: flex;
           flex-direction: column;
           gap: 1rem;
        }
        .controls-grid {
           display: grid;
           grid-template-columns: 1fr 1fr;
           gap: 0.25rem;
           background: var(--hover-color);
           padding: 0.75rem;
           border-radius: 8px;
        }
        .select-controls {
           display: flex;
           flex-direction: column;
           gap: 0.5rem;
        }
        .control-row {
           display: flex;
           align-items: center;
           justify-content: space-between;
           gap: 0.75rem;
        }
          .control-row label {
             font-size: 12px;
             font-weight: 400;
             opacity: 0.7;
             white-space: nowrap;
          }
         .control-row input[type="number"] {
            padding: 0.35rem;
            border-radius: 4px;
            background: var(--bg-color);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            font-size: 0.75rem;
            width: 60px;
            text-align: center;
         }
         .control-row select {
            padding: 0.35rem;
            border-radius: 4px;
            background: var(--bg-color);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            font-size: 0.75rem;
            width: 70px;
            text-align: center;
         }
         .result-area {
            margin-top: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
         }
         .result-box {
            background: var(--bg-color);
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            min-height: 4rem;
            display: flex;
            align-items: center;
            word-break: break-all;
            font-size: 0.75rem;
            color: var(--accent-color);
         }
         .result-box code {
            color: var(--accent-color);
            white-space: pre-wrap;
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
            border-width: 0;
            border-radius: 4px;
         }
         .format-toggle button.active {
            background: var(--card-bg);
            opacity: 1;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
         }
         .copy-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 0.25rem;
         }
      `}</style>
    </div>
  )
}

export default FlexboxGridPlayground
