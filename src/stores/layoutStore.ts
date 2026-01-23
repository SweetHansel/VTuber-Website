import { create } from 'zustand'

export type FocusTarget = 'left' | 'right' | null

export interface AspectRatioConfig {
  container: { width: number; height: number } // e.g., 8:4
  frame: { width: number; height: number } // e.g., 4:3
  anchor: { x: 'left' | 'center' | 'right'; y: 'top' | 'center' | 'bottom' }
}

interface LayoutState {
  // Focus management
  focusTarget: FocusTarget
  isTransitioning: boolean

  // Aspect ratio configs
  leftConfig: AspectRatioConfig
  rightConfig: AspectRatioConfig

  // Actions
  setFocus: (target: FocusTarget) => void
  setTransitioning: (isTransitioning: boolean) => void
  setLeftConfig: (config: Partial<AspectRatioConfig>) => void
  setRightConfig: (config: Partial<AspectRatioConfig>) => void
}

const defaultLeftConfig: AspectRatioConfig = {
  container: { width: 16, height: 9 },
  frame: { width: 4, height: 3 },
  anchor: { x: 'center', y: 'center' },
}

const defaultRightConfig: AspectRatioConfig = {
  container: { width: 16, height: 9 },
  frame: { width: 4, height: 3 },
  anchor: { x: 'center', y: 'center' },
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
  focusTarget: 'right', // Default focus on main content
  isTransitioning: false,
  leftConfig: defaultLeftConfig,
  rightConfig: defaultRightConfig,

  setFocus: (target) => {
    const { focusTarget, isTransitioning } = get()
    if (target === focusTarget || isTransitioning) return

    set({
      focusTarget: target,
      isTransitioning: true,
    })

    // Auto-complete transition after animation
    setTimeout(() => {
      set({ isTransitioning: false })
    }, 500)
  },

  setTransitioning: (isTransitioning) => set({ isTransitioning }),

  setLeftConfig: (config) =>
    set((state) => ({
      leftConfig: { ...state.leftConfig, ...config },
    })),

  setRightConfig: (config) =>
    set((state) => ({
      rightConfig: { ...state.rightConfig, ...config },
    })),
}))
