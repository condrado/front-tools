import React, { useState, useEffect, useRef } from 'react'
import { Type, Moon, Sun, Github, Settings, ChevronRight, Lock, Unlock, RotateCcw, Download, Upload } from 'lucide-react'
import { usePersistentState } from '../hooks/usePersistentState'

const Layout = ({ children, widgetsCatalog = [], activeWidgets = [], onToggleWidget }) => {
  const [fontSize, setFontSize] = usePersistentState('page_font_size_v1', 16)
  const [theme, setTheme] = usePersistentState('page_theme_v1', 'dark')
  const [isWidthLocked, setIsWidthLocked] = usePersistentState('page_width_lock_v1', false)
  const [lockedWidth, setLockedWidth] = usePersistentState('page_locked_width_v1', null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const settingsRef = useRef(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`
    // Notificar al grid que el tamaño de fuente cambió (recalc layout)
    window.dispatchEvent(new CustomEvent('width-lock-changed'))
  }, [fontSize])

  useEffect(() => {
    document.body.className = isWidthLocked ? 'width-locked' : ''
    window.dispatchEvent(new CustomEvent('width-lock-changed'))
  }, [isWidthLocked])

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="min-h-screen">
      <nav className="sticky-nav">
        <div className="nav-container">
          <div className="nav-left">
            <h1 className="logo">Front<span>Tools</span></h1>
          </div>
          
          <div className="nav-right">
            <button 
              className={`nav-icon-btn ${isWidthLocked ? 'active' : ''}`} 
              onClick={() => {
                if (!isWidthLocked) {
                  setLockedWidth(window.innerWidth)
                } else {
                  setLockedWidth(null)
                }
                setIsWidthLocked(!isWidthLocked)
              }}
              title={isWidthLocked ? "Desbloquear ancho" : "Bloquear ancho"}
            >
              {isWidthLocked ? <Lock size={20} className="size-20" /> : <Unlock size={20} className="size-20" />}
            </button>
            
            <div className="settings-wrapper" ref={settingsRef}>
              <button 
                className={`nav-icon-btn ${isSettingsOpen ? 'active' : ''}`} 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                title="Ajustes"
              >
                <Settings size={20} className="size-20" />
              </button>

              {isSettingsOpen && (
                <div className="settings-dropdown">
                  <div className="dropdown-section">
                    <h4 className="dropdown-title">Ajustes de Interfaz</h4>
                    
                    <div className="setting-item">
                      <div className="setting-row">
                        <div className="setting-label">
                          {theme === 'dark' ? <Moon size={14} className="size-14" /> : <Sun size={14} className="size-14" />}
                          <span className="label-text">Modo Oscuro</span>
                        </div>
                        <label className="switch">
                          <input 
                            type="checkbox" 
                            checked={theme === 'dark'}
                            onChange={toggleTheme}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="setting-col" style={{ marginTop: '0.8rem' }}>
                        <div className="setting-label">
                          <Type size={14} className="size-14" />
                          <span className="label-text">Tamaño fuente</span>
                        </div>
                        <div className="font-size-controls">
                          <button onClick={() => setFontSize(Math.max(12, fontSize - 1))}>-</button>
                          <span className="current-size">{fontSize}px</span>
                          <button onClick={() => setFontSize(Math.min(24, fontSize + 1))}>+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <div className="dropdown-section">
                    <h4 className="dropdown-title">Visibilidad de Widgets</h4>
                    <div className="widgets-selector-list">
                      {widgetsCatalog.map(widget => (
                        <div key={widget.id} className="widget-toggle-item">
                          <span className="label-text" style={{ fontSize: '0.875rem', opacity: 1, fontWeight: 500 }}>{widget.name}</span>
                          <label className="switch">
                            <input 
                              type="checkbox" 
                              checked={activeWidgets.includes(widget.id)}
                              onChange={() => onToggleWidget(widget.id)}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <div className="dropdown-section">
                    <h4 className="dropdown-title">Configuración</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button 
                        className="action-btn"
                        title="Exportar configuración"
                        onClick={() => {
                          const data = JSON.stringify(localStorage, null, 2);
                          const blob = new Blob([data], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `front-tools-config-${new Date().toISOString().split('T')[0]}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <Download size={14} className="size-14" />
                        <span>Exportar</span>
                      </button>
                      <button 
                        className="action-btn"
                        title="Importar configuración"
                        onClick={() => document.getElementById('import-config').click()}
                      >
                        <Upload size={14} className="size-14" />
                        <span>Importar</span>
                      </button>
                      <input 
                        id="import-config"
                        type="file"
                        accept=".json"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const config = JSON.parse(event.target.result);
                              if (confirm('Esto sobreescribirá tu configuración actual. ¿Continuar?')) {
                                Object.keys(config).forEach(key => {
                                  localStorage.setItem(key, config[key]);
                                });
                                window.location.reload();
                              }
                            } catch (err) {
                              alert('Error al importar el archivo JSON.');
                            }
                          };
                          reader.readAsText(file);
                        }}
                      />
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <div className="dropdown-section">
                    <h4 className="dropdown-title">Sistema</h4>
                    <button 
                      className="reset-btn"
                      onClick={() => {
                        if (confirm('¿Estás seguro de que quieres resetear toda la configuración?')) {
                           localStorage.clear();
                           window.location.reload();
                        }
                      }}
                    >
                      <RotateCcw size={14} className="size-14" />
                      <span>Limpiar Datos</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <a href="https://github.com/condrado/front-tools" target="_blank" rel="noopener noreferrer" className="nav-icon-btn" title="GitHub">
              <Github size={20} className="size-20" />
            </a>
          </div>
        </div>
      </nav>

      <main className="main-content-wrapper">
        <div 
          className="page-container" 
          style={isWidthLocked && lockedWidth ? { 
            width: `${lockedWidth}px`, 
            maxWidth: `${lockedWidth}px`,
            margin: '0 auto',
            overflowX: 'hidden'
          } : {}}>
          {children}
        </div>
      </main>

      <style jsx="true">{`
        .min-h-screen {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .sticky-nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(var(--bg-rgb, 255, 255, 255), 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          padding: 0.75rem 0;
        }
        .nav-container {
          padding: 0 1.5rem;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0;
          color: var(--text-color);
        }
        .logo span {
          color: var(--accent-color);
          font-weight: 600;
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .nav-icon-btn {
          background: none;
          border: none;
          color: var(--text-color);
          padding: 0.5rem;
          cursor: pointer;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
          opacity: 0.7;
        }
        .nav-icon-btn:hover, .nav-icon-btn.active {
          background: var(--hover-color);
          opacity: 1;
        }
        
        /* Dropdown Styles */
        .settings-wrapper {
          position: relative;
        }
        .settings-dropdown {
          position: absolute;
          top: calc(100% + 0.75rem);
          right: 0;
          width: 250px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 1rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
          padding: 1.25rem;
          animation: slideUp 0.15s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-title {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          opacity: 0.4;
          margin: 0 0 1rem 0;
          letter-spacing: 0.05em;
        }
        .dropdown-divider {
          height: 1px;
          background: var(--border-color);
          margin: 1.25rem -1.25rem;
        }
        
        .setting-item {
          display: flex;
          flex-direction: column;
        }
        .setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.1rem 0;
        }
        .setting-col {
          display: flex;
          flex-direction: column;
        }
        .setting-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.4rem;
        }
        .label-text {
          font-size: 0.75rem;
          font-weight: 400;
          opacity: 0.7;
          white-space: nowrap;
        }
        
        .font-size-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          background: var(--hover-color);
          padding: 0.3rem;
          border-radius: 0.5rem;
        }
        .font-size-controls button {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          color: var(--text-color);
          width: 1.7rem;
          height: 1.7rem;
          border-radius: 0.35rem;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .font-size-controls button:hover {
          background: var(--accent-color);
          color: white;
          border-color: var(--accent-color);
          transform: translateY(-1px);
        }
        .current-size {
          font-size: 0.85rem;
          font-weight: 600;
          min-width: 3rem;
          text-align: center;
        }
        
        /* Widgets List */
        .widgets-selector-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          max-height: 200px;
          overflow-y: auto;
          padding-right: 0.5rem;
          margin-right: -0.5rem;
        }
        
        /* Custom Scrollbar for Widgets List */
        .widgets-selector-list::-webkit-scrollbar {
          width: 4px;
        }
        .widgets-selector-list::-webkit-scrollbar-track {
          background: transparent;
        }
        .widgets-selector-list::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 10px;
        }
        .widgets-selector-list::-webkit-scrollbar-thumb:hover {
          background: var(--accent-color);
        }
        
        .widget-toggle-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.15rem 0;
        }

        .reset-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem;
          background: var(--hover-color);
          color: var(--text-color);
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.75rem;
          font-weight: 500;
          opacity: 0.8;
        }

        .reset-btn:hover {
          background: #fee2e2;
          color: #ef4444;
          border-color: #fecaca;
          opacity: 1;
        }

        [data-theme='dark'] .reset-btn:hover {
           background: #450a0a;
           color: #f87171;
           border-color: #7f1d1d;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.6rem;
          background: var(--hover-color);
          color: var(--text-color);
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .action-btn:hover {
           background: var(--card-bg);
           color: var(--accent-color);
           border-color: var(--accent-color);
           box-shadow: 0 4px 6px -1px rgba(var(--accent-color-rgb), 0.1);
        }
        
        /* Switch Styles */
        .switch {
          position: relative;
          display: inline-block;
          width: 2.2rem;
          height: 1.2rem;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--border-color);
          transition: .3s;
          border-radius: 1.25rem;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 0.85rem;
          width: 0.85rem;
          left: 0.175rem;
          bottom: 0.175rem;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: var(--accent-color);
        }
        input:checked + .slider:before {
          transform: translateX(1rem);
        }

        .main-content-wrapper {
          flex: 1;
          background: var(--bg-color);
        }
        :global(body.width-locked) .page-container,
        :global(body.width-locked) .nav-container {
          margin: 0 auto;
        }
        .page-container {
        }
        }
      `}</style>
    </div>
  )
}

export default Layout
