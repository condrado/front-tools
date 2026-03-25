import React, { useState, useEffect, useRef } from 'react'
import {
  DndContext,
  pointerWithin,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import { Grip } from 'lucide-react'
import Layout from './components/Layout'
import MultiplesOf8 from './components/widgets/MultiplesOf8'
import PxRemConverter from './components/widgets/PxRemConverter'
import ClampCalculator from './components/widgets/ClampCalculator'
import ShadowGenerator from './components/widgets/ShadowGenerator'
import AspectRatioCalculator from './components/widgets/AspectRatioCalculator'
import FlexboxGridPlayground from './components/widgets/FlexboxGridPlayground'
import BreakpointsInfo from './components/widgets/BreakpointsInfo'
import ColorPicker from './components/widgets/ColorPicker'
import DraggableWidget from './components/DraggableWidget'
import GridCell from './components/GridCell'
import { usePersistentState } from './hooks/usePersistentState'

const WIDGET_COMPONENTS = {
  multiples: MultiplesOf8,
  converter: PxRemConverter,
  clamp: ClampCalculator,
  shadow: ShadowGenerator,
  aspect: AspectRatioCalculator,
  flex: FlexboxGridPlayground,
  breakpoints: BreakpointsInfo,
  color: ColorPicker,
}

const WIDGET_HEIGHTS = {
  multiples: 7,
  converter: 4,
  clamp: 5,
  shadow: 9,
  aspect: 6,
  flex: 12,
  breakpoints: 6,
  color: 8,
}

const WIDGET_CATALOG = [
  { id: 'multiples', name: 'Múltiplos' },
  { id: 'converter', name: 'Conversor Px/REM' },
  { id: 'clamp', name: 'Calculadora Clamp' },
  { id: 'aspect', name: 'Ratio de Aspecto' },
  { id: 'breakpoints', name: 'Info Breakpoints' },
  { id: 'shadow', name: 'Generador de Sombras' },
  { id: 'flex', name: 'Playground Flex/Grid' },
  { id: 'color', name: 'Selector de Color' },
]

const ROWS = 40

function App() {
  const [widgets, setWidgets] = usePersistentState('dashboard_layout_v12', [
    { id: 'multiples', x: 0, y: 0, w: 1 },
    { id: 'converter', x: 1, y: 0, w: 1 },
    { id: 'clamp', x: 2, y: 0, w: 1 },
    { id: 'aspect', x: 0, y: 7, w: 1 },
    { id: 'breakpoints', x: 1, y: 5, w: 1 },
    { id: 'shadow', x: 2, y: 6, w: 1 },
    { id: 'flex', x: 0, y: 14, w: 1 },
  ])

  // Migración automática de altura para el Color Picker
  useEffect(() => {
    const needsMigration = widgets.some(w => w.id === 'color' && w.h === 12)
    if (needsMigration) {
      setWidgets(prev => prev.map(w => 
        (w.id === 'color' && w.h === 12) ? { ...w, h: 8 } : w
      ))
    }
  }, [widgets, setWidgets])

  const [dynamicCols, setDynamicCols] = useState(0) // 0 significa "no medido aún"
  const gridRef = useRef(null)

  const updateCols = () => {
    if (gridRef.current) {
      const width = gridRef.current.offsetWidth
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      const gap = rootFontSize // 1rem
      const minColWidth = rootFontSize * 23.125 // 370px en base 16px

      const cols = Math.floor((width + gap) / (minColWidth + gap))
      const finalCols = Math.max(1, cols)

      setDynamicCols(finalCols)
    }
  }

  useEffect(() => {
    const handleWidthLockChange = () => {
      // Pequeño delay para que el DOM se actualice con los nuevos estilos de Layout
      setTimeout(updateCols, 50)
    }

    updateCols()
    window.addEventListener('resize', updateCols)
    window.addEventListener('width-lock-changed', handleWidthLockChange)

    return () => {
      window.removeEventListener('resize', updateCols)
      window.removeEventListener('width-lock-changed', handleWidthLockChange)
    }
  }, [])

  const resolveBentoLayout = (items, cols) => {
    const occupied = new Set()
    const result = []

    const isAreaFree = (x, y, w, h) => {
      if (x + w > cols) return false
      for (let i = x; i < x + w; i++) {
        for (let j = y; j < y + h; j++) {
          if (occupied.has(`${i},${j}`)) return false
        }
      }
      return true
    }

    const markOccupied = (x, y, w, h) => {
      for (let i = x; i < x + w; i++) {
        for (let j = y; j < y + h; j++) {
          occupied.add(`${i},${j}`)
        }
      }
    }

    // Ordenamos por y, x para mantener flujo natural
    const sorted = [...items].sort((a, b) => {
      if (a.y !== b.y) return a.y - b.y
      return a.x - b.x
    })

    for (const widget of sorted) {
      let { x, y, w } = widget
      const h = widget.h || WIDGET_HEIGHTS[widget.id]

      // Si está fuera de rango o colisiona, buscamos sitio
      if (x + w > cols || !isAreaFree(x, y, w, h)) {
        let found = false
        // Buscamos el primer hueco desde arriba
        for (let r = 0; r < 200 && !found; r++) {
          for (let c = 0; c <= cols - w; c++) {
            if (isAreaFree(c, r, w, h)) {
              x = c
              y = r
              found = true
              break
            }
          }
        }
      }

      markOccupied(x, y, w, h)
      result.push({ ...widget, x, y, h })
    }
    return result
  }

  // Recolocar widgets cuando cambian las columnas, pero solo si ya se ha medido el grid
  useEffect(() => {
    if (dynamicCols > 0) {
      setWidgets((prev) => resolveBentoLayout(prev, dynamicCols))
    }
  }, [dynamicCols])

  const [activeWidth, setActiveWidth] = useState(null)
  const [activeId, setActiveId] = useState(null)
  const [activeH, setActiveH] = useState(1)
  const [activeW, setActiveW] = useState(1)

  const updateWidgetSize = (id, newW, newH) => {
    setWidgets((prev) => {
      const updated = prev.map(w => w.id === id ? { ...w, w: newW, h: newH } : w)
      return resolveBentoLayout(updated, dynamicCols)
    })
  }

  const handleToggleWidget = (id) => {
    setWidgets((prev) => {
      const exists = prev.find(w => w.id === id)
      if (exists) {
        // Desactivar: Filtramos para eliminarlo (pierde sesión)
        return prev.filter(w => w.id !== id)
      } else {
        // Activar: Lo añadimos y el layout resolver lo colocará en el primer hueco
        const newWidget = { id, x: 0, y: 0, w: 1 }
        return resolveBentoLayout([...prev, newWidget], dynamicCols)
      }
    })
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = (event) => {
    const id = event.active.id
    setActiveId(id)
    const widget = widgets.find(w => w.id === id)
    if (widget) {
      setActiveH(widget.h)
      setActiveW(widget.w)
    }
    const node = document.getElementById(`widget-${id}`)
    if (node) {
      setActiveWidth(node.offsetWidth)
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && over.data.current) {
      const { x, y } = over.data.current
      setWidgets((prev) => {
        const updated = prev.map(w => w.id === active.id ? { ...w, x, y } : w)
        return resolveBentoLayout(updated, dynamicCols)
      })
    }

    setActiveId(null)
    setActiveWidth(null)
  }

  // Generar celdas de fondo basadas en las columnas dinámicas
  const gridCells = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < dynamicCols; c++) {
      gridCells.push(<GridCell key={`${c}-${r}`} x={c} y={r} />)
    }
  }

  const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  }

  return (
    <Layout
      widgetsCatalog={WIDGET_CATALOG}
      activeWidgets={widgets.map(w => w.id)}
      onToggleWidget={handleToggleWidget}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div
          ref={gridRef}
          className={`dashboard-grid ${activeId ? 'dragging' : ''}`}
          style={{ '--cols': dynamicCols }}
        >
          {/* Capa de celdas de fondo */}
          {gridCells}

          {/* Widgets */}
          {widgets.map((widget) => {
            const WidgetComponent = WIDGET_COMPONENTS[widget.id]
            if (!WidgetComponent) {
              console.warn(`Widget no encontrado: ${widget.id}. Es posible que necesites limpiar el localStorage o revisar las IDs.`)
              return null
            }
            return (
              <DraggableWidget
                key={widget.id}
                id={widget.id}
                x={widget.x}
                y={widget.y}
                w={widget.w}
                h={widget.h}
                onUpdateSize={(newW, newH) => updateWidgetSize(widget.id, newW, newH)}
              >
                {React.createElement(WidgetComponent)}
              </DraggableWidget>
            )
          })}
        </div>

        <DragOverlay dropAnimation={dropAnimationConfig}>
          {activeId ? (
            <div
              style={{
                cursor: 'grabbing',
                width: activeWidth ? `${activeWidth}px` : '100%',
                position: 'relative'
              }}
            >
              <div
                className="drag-handle"
                style={{
                  position: 'absolute',
                  top: '1.6rem',
                  left: '0.75rem',
                  zIndex: 200
                }}
              >
                <Grip size={14} className="size-14" />
              </div>
              {(() => {
                const ActiveComponent = WIDGET_COMPONENTS[activeId]
                return ActiveComponent ? (
                  React.createElement(ActiveComponent, { height: activeH, width: activeW })
                ) : null
              })()}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Layout>
  )
}

export default App
