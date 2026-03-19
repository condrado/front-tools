import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export function SortableWidget({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative'
  };

  return (
    <div ref={setNodeRef} style={style} className="grid-cell-container">
      <div 
        {...attributes} 
        {...listeners} 
        className="drag-handle-vertical"
        style={{
          position: 'absolute',
          top: '0.75rem',
          left: '0.25rem',
          cursor: 'grab',
          zIndex: 10,
          opacity: 0.3,
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <GripVertical size={14} className="size-14" />
      </div>
      {children}
    </div>
  );
}
