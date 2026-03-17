import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

const SortableWidget = ({ id, children, className }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 0 : 1,
    opacity: isDragging ? 0.3 : 1,
    position: 'relative'
  }

  return (
    <div ref={setNodeRef} style={style} className={className}>
      <div 
        className="drag-handle" 
        {...attributes} 
        {...listeners}
        style={{ 
          position: 'absolute', 
          top: '1.4rem', 
          left: '0.6rem', 
          zIndex: 20,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        title="Arrastrar para reordenar"
      >
        <GripVertical size={14} />
      </div>
      {children}
    </div>
  )
}

export default SortableWidget
