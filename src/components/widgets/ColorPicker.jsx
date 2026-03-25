import React, { useState, useEffect, useRef } from 'react'
import { Copy, Check, Share2, Maximize2 } from 'lucide-react'
import Modal from '../Modal'
import { usePersistentState } from '../../hooks/usePersistentState'

const ColorPicker = ({ height, width }) => {
  const [state, setState] = usePersistentState('color_picker_v2', {
    h: 136,
    s: 62,
    v: 49,
    hex: '#2f7d44'
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copied, setCopied] = useState(null)
  const saturationRef = useRef(null)
  const isDragging = useRef(false)

  const { h, s, v, hex } = state

  const hsvToRgb = (h, s, v) => {
    s /= 100; v /= 100
    const i = Math.floor(h / 60)
    const f = h / 60 - i
    const p = v * (1 - s)
    const q = v * (1 - f * s)
    const t = v * (1 - (1 - f) * s)
    let r, g, b
    switch (i % 6) {
      case 0: r = v, g = t, b = p; break
      case 1: r = q, g = v, b = p; break
      case 2: r = p, g = v, b = t; break
      case 3: r = p, g = q, b = v; break
      case 4: r = t, g = p, b = v; break
      case 5: r = v, g = p, b = q; break
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
  }

  const rgbToCmyk = (r, g, b) => {
    let c = 1 - r / 255, m = 1 - g / 255, y = 1 - b / 255, k = Math.min(c, m, y)
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 }
    c = Math.round((c - k) / (1 - k) * 100)
    m = Math.round((m - k) / (1 - k) * 100)
    y = Math.round((y - k) / (1 - k) * 100)
    return { c, m, y, k: Math.round(k * 100) }
  }

  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2
    if (max === min) h = s = 0
    else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')

  const rgb = hsvToRgb(h, s, v)
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

  const handleSaturationChange = (e) => {
    if (!saturationRef.current) return
    const rect = saturationRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    const nextS = Math.round(x * 100)
    const nextV = Math.round((1 - y) * 100)
    const nextRgb = hsvToRgb(h, nextS, nextV)
    setState(prev => ({ ...prev, s: nextS, v: nextV, hex: rgbToHex(nextRgb.r, nextRgb.g, nextRgb.b) }))
  }

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const renderContent = () => (
    <div className="picker-container">
      <div className="preview-row">
        <div className="color-preview" style={{ backgroundColor: hex }} />
        <div 
          className="saturation-field" 
          ref={saturationRef}
          onMouseDown={(e) => { isDragging.current = true; handleSaturationChange(e) }}
          style={{ backgroundColor: `hsl(${h}, 100%, 50%)` }}
        >
          <div className="white-grad" />
          <div className="black-grad" />
          <div className="picker-cursor" style={{ left: `${s}%`, bottom: `${v}%` }} />
        </div>
      </div>

      <div className="hue-slider-container">
        <input 
          type="range" min="0" max="360" value={h} 
          onChange={(e) => {
            const nextH = parseInt(e.target.value)
            const nextRgb = hsvToRgb(nextH, s, v)
            setState(prev => ({ ...prev, h: nextH, hex: rgbToHex(nextRgb.r, nextRgb.g, nextRgb.b) }))
          }}
          className="hue-slider"
        />
      </div>

      <div className="hex-input-section">
        <div className="hex-field">
          <span className="hex-label">HEX</span>
          <code>{hex.toUpperCase()}</code>
          <button className="copy-icon-btn" onClick={() => copyToClipboard(hex.toUpperCase(), 'hex')}>
            {copied === 'hex' ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      <div className="values-grid">
        <div className="value-box" onClick={() => copyToClipboard(`${rgb.r}, ${rgb.g}, ${rgb.b}`, 'rgb')}>
          <span className="box-label">RGB</span>
          <code>{rgb.r}, {rgb.g}, {rgb.b}</code>
        </div>
        <div className="value-box" onClick={() => copyToClipboard(`${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`, 'cmyk')}>
          <span className="box-label">CMYK</span>
          <code>{cmyk.c}%, {cmyk.m}%, {cmyk.y}%, {cmyk.k}%</code>
        </div>
        <div className="value-box" onClick={() => copyToClipboard(`${h}°, ${s}%, ${v}%`, 'hsv')}>
          <span className="box-label">HSV</span>
          <code>{h}°, {s}%, {v}%</code>
        </div>
        <div className="value-box" onClick={() => copyToClipboard(`${hsl.h}°, ${hsl.s}%, ${hsl.l}%`, 'hsl')}>
          <span className="box-label">HSL</span>
          <code>{hsl.h}°, {hsl.s}%, {hsl.l}%</code>
        </div>
      </div>

      <style jsx="true">{`
        .picker-container { display: flex; flex-direction: column; gap: 1rem; }
        .preview-row { display: grid; grid-template-columns: 80px 1fr; gap: 0; height: 160px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color); }
        .color-preview { height: 100%; border-right: 1px solid rgba(0,0,0,0.1); }
        .saturation-field { position: relative; cursor: crosshair; }
        .white-grad { position: absolute; inset: 0; background: linear-gradient(to right, #fff, transparent); }
        .black-grad { position: absolute; inset: 0; background: linear-gradient(to top, #000, transparent); }
        .picker-cursor { position: absolute; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%; transform: translate(-50%, 50%); box-shadow: 0 0 4px rgba(0,0,0,0.5); pointer-events: none; }
        
        .hue-slider-container { margin: 0.5rem 0; }
        .hue-slider { -webkit-appearance: none; width: 100%; height: 10px; border-radius: 5px; background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%); outline: none; }
        .hue-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: white; border: 3px solid #fff; box-shadow: 0 0 0 1px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.2); cursor: pointer; }

        .hex-input-section { margin-top: 0.5rem; }
        .hex-field { position: relative; background: var(--hover-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 1rem; display: flex; justify-content: center; align-items: center; }
        .hex-label { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: var(--card-bg); padding: 0 8px; font-size: 0.65rem; font-weight: 700; color: var(--text-color); opacity: 0.6; }
        .hex-field code { font-size: 1.1rem; letter-spacing: 0.05em; font-family: 'JetBrains Mono', monospace; color: var(--text-color); }
        .copy-icon-btn { position: absolute; right: 12px; background: none; border: none; color: var(--text-color); opacity: 0.5; cursor: pointer; padding: 4px; border-radius: 4px; }
        .copy-icon-btn:hover { opacity: 1; background: var(--border-color); }

        .values-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
        .value-box { background: var(--hover-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.6rem; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; gap: 4px; }
        .value-box:hover { border-color: var(--accent-color); }
        .box-label { font-size: 0.6rem; font-weight: 700; opacity: 0.5; text-transform: uppercase; }
        .value-box code { font-size: 0.75rem; font-family: 'JetBrains Mono', monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      `}</style>
    </div>
  )

  useEffect(() => {
    const handleUp = () => { isDragging.current = false }
    const handleMove = (e) => { if (isDragging.current) handleSaturationChange(e) }
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('mousemove', handleMove)
    return () => { window.removeEventListener('mouseup', handleUp); window.removeEventListener('mousemove', handleMove) }
  }, [h, s, v])

  return (
    <div className="card color-card" data-h={height} data-col={width}>
      <div className="widget-header">
        <h3 className="widget-title">Selector de color</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="maximize-btn" style={{ opacity: 0.5 }}><Share2 size={16} /></button>
          <button className="maximize-btn" onClick={() => setIsModalOpen(true)}>
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
      {renderContent()}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Selector de color">
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>{renderContent()}</div>
      </Modal>
    </div>
  )
}

export default ColorPicker
