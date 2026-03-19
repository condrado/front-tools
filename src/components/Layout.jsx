import React, { useEffect } from 'react'
import { Moon, Sun, Github, Lock, Unlock, Type } from 'lucide-react'
import { usePersistentState } from '../hooks/usePersistentState'

const Layout = ({ children }) => {
  const [themeState, setThemeState] = usePersistentState('app_theme', {
    mode: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const theme = themeState.mode

  const [widthState, setWidthState] = usePersistentState('app_width_lock', {
    isLocked: false,
    lockedWidth: 1200
  })

  const [fontSize, setFontSize] = usePersistentState('root_font_size', 16)

  const { isLocked, lockedWidth } = widthState

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`
    // Disparar evento para que App.jsx recalcule el grid cuando cambie la fuente
    window.dispatchEvent(new CustomEvent('width-lock-changed'))
  }, [fontSize])

  const toggleTheme = () => {
    setThemeState({ mode: theme === 'light' ? 'dark' : 'light' })
  }

  const toggleWidthLock = () => {
    const newState = !isLocked
    if (newState) {
      setWidthState({
        isLocked: true,
        lockedWidth: window.innerWidth
      })
    } else {
      setWidthState({
        isLocked: false,
        lockedWidth: lockedWidth
      })
    }
    // Disparar evento para que App.jsx recalcule el grid
    window.dispatchEvent(new CustomEvent('width-lock-changed'))
  }

  return (
    <div className="min-h-screen">
      <header className="sticky-nav">
        <div className="container header-content">
          <h1 className="logo">Front<span>Tools</span></h1>
          <div className="header-actions">
            <button 
              className={`width-lock-toggle ${isLocked ? 'active' : ''}`} 
              onClick={toggleWidthLock}
              title={isLocked ? "Desbloquear Ancho" : "Bloquear Ancho"}
            >
              {isLocked ? <Lock size={18} className="size-18" /> : <Unlock size={18} className="size-18" />}
            </button>
            <div className="font-size-control">
              <Type size={18} className="font-icon size-18" />
              <select 
                value={fontSize} 
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="font-select"
                title="Cambiar tamaño de fuente"
              >
                {[12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map(size => (
                  <option key={size} value={size}>{size}px</option>
                ))}
              </select>
            </div>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={20} className="size-20" /> : <Sun size={20} className="size-20" />}
            </button>
            <a href="https://github.com/condrado/front-tools" target="_blank" rel="noopener noreferrer" className="github-link">
              <Github size={20} className="size-20" />
            </a>
          </div>
        </div>
      </header>
      
      <main 
        className="main-content-wrapper" 
        style={isLocked ? { 
          minWidth: `${lockedWidth / 16}rem`, 
          width: `${lockedWidth / 16}rem`,
          margin: '0 auto'
        } : {}}
      >
        <div className="container main-content">
          {children}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} FrontTools - Hecho para desarrolladores</p>
        </div>
      </footer>

      <style jsx="true">{`
        .min-h-screen {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .main-content-wrapper {
          width: 100%;
          flex: 1;
        }
        .container {
          padding: 0 1rem;
          width: 100%;
        }
        .sticky-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(var(--bg-rgb, 255, 255, 255), 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          padding: 1rem 0;
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: 300;
          letter-spacing: -0.02em;
        }
        .logo span {
          color: var(--accent-color);
          font-weight: 600;
        }
        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .theme-toggle, .github-link, .width-lock-toggle {
          background: none;
          color: var(--text-color);
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
          cursor: pointer;
          border: none;
          opacity: 0.7;
        }
        .theme-toggle:hover, .github-link:hover, .width-lock-toggle:hover {
          background: var(--hover-color);
          opacity: 1;
        }
        .width-lock-toggle.active {
          color: var(--accent-color);
          background: rgba(var(--accent-color-rgb), 0.1);
          opacity: 1;
        }
        .font-size-control {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--hover-color);
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          opacity: 0.8;
          transition: var(--transition);
        }
        .font-size-control:hover {
          opacity: 1;
        }
        .font-icon {
          color: var(--text-color);
          opacity: 0.6;
        }
        .font-select {
          background: none;
          border: none;
          padding: 0.125rem;
          font-size: 0.875rem;
          color: var(--text-color);
          cursor: pointer;
          width: 4rem;
        }
        .font-select:focus {
          outline: none;
          box-shadow: none;
        }
        .main-content {
          flex: 1;
          padding-top: 1rem;
          padding-bottom: 1rem;
          margin: 0 auto;
        }
        .footer {
          padding: 2rem 0;
          border-top: 1px solid var(--border-color);
          text-align: center;
          font-size: 0.875rem;
          opacity: 0.6;
        }
      `}</style>
    </div>
  )
}

export default Layout
