import { useState, useEffect } from 'react'

/**
 * Hook para persistir el estado de un widget en localStorage
 * @param {string} widgetId - Identificador único del widget
 * @param {Object} initialState - Estado inicial si no hay nada guardado
 * @returns {[Object, Function]} - El estado actual y la función para actualizarlo
 */
export const usePersistentState = (widgetId, initialState) => {
  // Inicializar estado leyendo de localStorage
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(`widget_state_${widgetId}`)
      return saved ? JSON.parse(saved) : initialState
    } catch (error) {
      console.warn(`Error reading state for widget ${widgetId}:`, error)
      return initialState
    }
  })

  // Guardar en localStorage cada vez que el estado cambie
  useEffect(() => {
    try {
      localStorage.setItem(`widget_state_${widgetId}`, JSON.stringify(state))
    } catch (error) {
      console.error(`Error saving state for widget ${widgetId}:`, error)
    }
  }, [widgetId, state])

  return [state, setState]
}
