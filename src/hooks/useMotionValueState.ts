import { useState, useEffect } from 'react'
import { type MotionValue } from 'framer-motion'

/**
 * Hook to subscribe to a MotionValue and convert it to React state.
 * Useful for triggering re-renders based on MotionValue changes,
 * such as determining page visibility in a book layout.
 */
export function useMotionValueState(value: MotionValue<number>) {
  const [state, setState] = useState(value.get())

  useEffect(() => {
    // Subscribe to changes
    const unsubscribe = value.on('change', setState)
    return unsubscribe
  }, [value])

  return state
}
