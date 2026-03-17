import React, { useEffect } from 'react'
import { Moon, Sun, Github } from 'lucide-react'
import { usePersistentState } from '../hooks/usePersistentState'

const Layout = ({ children }) => {
  const [themeState, setThemeState] = usePersistentState('app_theme', {
    mode: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const theme = themeState.mode

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setThemeState({ mode: theme === 'light' ? 'dark' : 'light' })
  }

  return (
    <div className="min-h-screen">
      <header className="sticky-nav">
        <div className="container header-content">
          <h1 className="logo">Front<span>Tools</span></h1>
          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <a href="#" className="github-link">
              <Github size={20} />
            </a>
          </div>
        </div>
      </header>
      
      <main className="container main-content">
        {children}
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
        .theme-toggle, .github-link {
          background: none;
          color: var(--text-color);
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, opacity 0.2s;
        }
        .theme-toggle:hover, .github-link:hover {
          background: var(--hover-color);
          transform: none;
          opacity: 1;
        }
        .github-link {
          opacity: 0.7;
        }
        .main-content {
          flex: 1;
          padding-top: 1rem;
          padding-bottom: 1rem;
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
