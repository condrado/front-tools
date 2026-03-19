import React, { useState, useEffect } from 'react'
import { Info, Maximize2, Monitor, Smartphone, Tablet, HelpCircle } from 'lucide-react'
import Modal from '../Modal'

const BreakpointsInfo = ({ height, width }) => {
   const [windowWidth, setWindowWidth] = useState(window.innerWidth)
   const [isModalOpen, setIsModalOpen] = useState(false)

   useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth)
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
   }, [])

   const breakpoints = [
      { name: 'xs', range: '0 - 480', device: <Smartphone size={14} className="size-14" />, desc: 'Móviles antiguos' },
      { name: 'sm', range: '481 - 768', device: <Smartphone size={14} className="size-14" />, desc: 'Móviles modernos' },
      { name: 'md', range: '769 - 1024', device: <Tablet size={14} className="size-14" />, desc: 'Tablets' },
      { name: 'lg', range: '1025 - 1280', device: <Monitor size={14} className="size-14" />, desc: 'Portátiles' },
      { name: 'xl', range: '1281 - 1536', device: <Monitor size={14} className="size-14" />, desc: 'Desktops' },
      { name: '2xl', range: '1537+', device: <HelpCircle size={14} className="size-14" />, desc: 'Monitores 4K' },
   ]

   const getCurrentBreakpoint = () => {
      if (windowWidth <= 480) return 'xs'
      if (windowWidth <= 768) return 'sm'
      if (windowWidth <= 1024) return 'md'
      if (windowWidth <= 1280) return 'lg'
      if (windowWidth <= 1536) return 'xl'
      return '2xl'
   }

   const renderContent = () => (
      <div className="breakpoints-container">
         <div className="current-width-info">
            <div className="stat">
               <span className="val">{windowWidth}px</span>
               <span className="lab">Ancho Actual</span>
            </div>
            <div className="stat">
               <span className="val">{getCurrentBreakpoint().toUpperCase()}</span>
               <span className="lab">Breakpoint</span>
            </div>
         </div>

         <div className="breakpoints-list">
            {breakpoints.map((bp) => (
               <div
                  key={bp.name}
                  className={`bp-item ${getCurrentBreakpoint() === bp.name ? 'active' : ''}`}
               >
                  <span className="bp-name">{bp.name.toUpperCase()}</span>
                  <div className="bp-desc">
                     {bp.device}
                     <span>{bp.desc}</span>
                  </div>
                  <span className="bp-range">{bp.range}px</span>
               </div>
            ))}
         </div>

         <div className="custom-info">
            <Info size={14} className="size-14" />
            <p>Valores basados en estándares comunes como TailwindCSS y Bootstrap.</p>
         </div>
      </div>
   )

   return (
      <div className="card breakpoints-card" data-h={height} data-col={width}>
         <div className="widget-header">
            <h3 className="widget-title">Breakpoints Guide</h3>
            <button className="maximize-btn" onClick={() => setIsModalOpen(true)}>
               <Maximize2 size={16} className="size-16" />
            </button>
         </div>

         {renderContent()}

         <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Guía de Breakpoints Comunes">
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
               {renderContent()}
            </div>
         </Modal>

         <style jsx="true">{`
        .breakpoints-card {
           display: flex;
           flex-direction: column;
        }
        .current-width-info {
           display: grid;
           grid-template-columns: 1fr 1fr;
           gap: 0.5rem;
           background: var(--hover-color);
           padding: 0.75rem;
           border-radius: 0.5rem; /* 8px */
           margin-bottom: 0.5rem;
        }
        .stat {
           display: flex;
           flex-direction: column;
           align-items: center;
        }
        .val {
           font-size: 1rem;
           font-weight: 700;
           color: var(--accent-color);
        }
        .lab {
           font-size: 0.6rem;
           opacity: 0.5;
           text-transform: uppercase;
           letter-spacing: 0.05em;
        }
        .breakpoints-list {
           display: flex;
           flex-direction: column;
           gap: 0.25rem;
        }
        .bp-item {
           display: flex;
           align-items: center;
           gap: 0.75rem;
           padding: 0.5rem 0.75rem;
           border-radius: 0.375rem; /* 6px */
           border: 1px solid transparent;
           opacity: 0.5;
           transition: var(--transition);
        }
        .bp-item.active {
           opacity: 1;
           background: var(--card-bg);
           border-color: var(--accent-color);
           box-shadow: 0 4px 6px -1px rgba(var(--accent-color-rgb), 0.1);
        }
        .bp-name {
           font-size: 0.75rem;
           font-weight: 700;
           width: 1.875rem; /* 30px */
        }
        .bp-desc {
           display: flex;
           align-items: center;
           gap: 0.4rem;
           font-size: 0.65rem;
           flex: 1;
        }
        .bp-range {
           font-size: 0.7rem;
           opacity: 0.6;
           text-align: right;
        }
        .custom-info {
           display: flex;
           gap: 0.5rem;
           padding-top: 0.5rem;
           border-top: 1px solid var(--border-color);
           margin-top: auto;
           opacity: 0.4;
        }
        .custom-info p {
           font-size: 0.65rem;
           line-height: normal;
        }
      `}</style>
      </div>
   )
}

export default BreakpointsInfo
