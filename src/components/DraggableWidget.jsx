import React, { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Grip, Settings, X, Check } from 'lucide-react'

const DraggableWidget = ({ id, children, x, y, w, h, onUpdateSize }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({ id })

  const [showSettings, setShowSettings] = useState(false)
  const [tempW, setTempW] = useState(w)
  const [tempH, setTempH] = useState(h)

  const style = {
    // Durante el drag, aplicamos la transformación
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    gridColumnStart: x + 1,
    gridColumnEnd: `span ${w}`,
    gridRowStart: y + 1,
    gridRowEnd: `span ${h}`,
    zIndex: isDragging ? 100 : (showSettings ? 150 : 1),
    opacity: isDragging ? 0.3 : 1,
    position: 'relative'
  }

  const handleApply = () => {
     onUpdateSize(parseInt(tempW) || 1, parseInt(tempH) || 1)
     setShowSettings(false)
  }

  return (
    <div id={`widget-${id}`} ref={setNodeRef} style={style} className="widget-wrapper">
      <div
        className="drag-handle"
        {...attributes}
        {...listeners}
        style={{
          position: 'absolute',
          top: id === 'multiples' ? '2rem' : '1.55rem',
          left: '0.75rem',
          zIndex: 200,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <Grip size={16} className="size-16" />
      </div>

      <div 
        className="settings-handle"
        onClick={() => {
          setShowSettings(!showSettings)
          setTempW(w)
          setTempH(h)
        }}
        style={{
          position: 'absolute',
          top: id === 'multiples' ? '2rem' : '1.55rem',
          right: '3.5rem',
          zIndex: 200,
          cursor: 'pointer',
          opacity: 0.3,
          display: 'flex',
          padding: '0.25rem'
        }}
      >
        <Settings size={15} className="size-15" />
      </div>

      {showSettings && (
        <div className="widget-settings-panel" style={{
           position: 'absolute',
           top: '3.5rem',
           right: '1rem',
           background: 'var(--card-bg)',
           border: '1px solid var(--border-color)',
           borderRadius: '0.5rem' /* 8px */,
           padding: '1rem',
           zIndex: 1000,
           width: '11.25rem', /* 180px */
           boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)'
        }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Ajustes Widget</span>
              <X size={14} className="size-14" style={{ cursor: 'pointer', opacity: 0.5 }} onClick={() => setShowSettings(false)} />
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                 <label style={{ fontSize: '0.65rem', opacity: 0.6 }}>Ancho (columnas)</label>
                 <input 
                    type="number" 
                    value={tempW} 
                    onChange={e => setTempW(e.target.value)}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    min="1"
                    max="6"
                 />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                 <label style={{ fontSize: '0.65rem', opacity: 0.6 }}>Alto (filas)</label>
                 <input 
                    type="number" 
                    value={tempH} 
                    onChange={e => setTempH(e.target.value)}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    min="1"
                 />
              </div>
              <button 
                 onClick={handleApply}
                 style={{ 
                    marginTop: '0.5rem', 
                    padding: '0.4rem', 
                    background: 'var(--accent-color)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '0.25rem' /* 4px */,
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    cursor: 'pointer'
                 }}
              >
                  <Check size={14} className="size-14" /> Aplicar
              </button>
           </div>
        </div>
      )}

      {React.Children.map(children, child => 
        React.isValidElement(child) ? React.cloneElement(child, { height: h, width: w }) : child
      )}
    </div>
  )
}

export default DraggableWidget
