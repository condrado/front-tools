import React from 'react'
import { useDroppable } from '@dnd-kit/core'

const GridCell = ({ id, x, y }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `cell-${x}-${y}`,
    data: { x, y }
  })

  const style = {
    gridColumnStart: x + 1,
    gridRowStart: y + 1,
    width: '100%',
    height: '100%',
    pointerEvents: 'auto'
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`grid-cell ${isOver ? 'over' : ''}`}
    />
  )
}

export default GridCell
