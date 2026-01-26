import { create } from 'zustand'

export type FocusState = 'default' | 'left' | 'bottom-right'

interface LayoutState {
  focusState: FocusState
  isTransitioning: boolean

  // Actions
  setFocus: (state: FocusState) => void
  setTransitioning: (isTransitioning: boolean) => void
  goBack: () => void
}

// Layout percentages based on focus state
export const layoutConfig = {
  default: { A: 40, B: 55 },      // A=left width%, B=bottom-right height%
  left: { A: 100, B: 55 },
  'bottom-right': { A: 0, B: 100 },
} as const

export const useLayoutStore = create<LayoutState>((set, get) => ({
  focusState: 'default',
  isTransitioning: false,

  setFocus: (state) => {
    const { focusState, isTransitioning } = get()
    if (state === focusState || isTransitioning) return

    set({
      focusState: state,
      isTransitioning: true,
    })

    // Auto-complete transition after animation
    setTimeout(() => {
      set({ isTransitioning: false })
    }, 500)
  },

  setTransitioning: (isTransitioning) => set({ isTransitioning }),

  goBack: () => {
    const { focusState, isTransitioning } = get()
    if (focusState === 'default' || isTransitioning) return

    set({
      focusState: 'default',
      isTransitioning: true,
    })

    setTimeout(() => {
      set({ isTransitioning: false })
    }, 500)
  },
}))
