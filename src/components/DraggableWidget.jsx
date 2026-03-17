import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Grip } from 'lucide-react'

const DraggableWidget = ({ id, children, x, y, w, h }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({ id })

  const style = {
    // Durante el drag, aplicamos la transformación
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    gridColumn: `span ${w}`,
    gridRow: `span ${h}`,
    gridColumnStart: x + 1,
    gridRowStart: y + 1,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.3 : 1,
    position: 'relative'
  }

  return (
    <div ref={setNodeRef} style={style} className="widget-wrapper">
      <div
        className="drag-handle"
        {...attributes}
        {...listeners}
        style={{
          position: 'absolute',
          top: '1.55rem',
          left: '0.75rem',
          zIndex: 200,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <Grip size={16} />
      </div>
      {children}
    </div>
  )
}

export default DraggableWidget
