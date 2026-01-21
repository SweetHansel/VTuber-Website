import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AnimationPreferences {
  idleAnimationsEnabled: boolean
  reducedMotion: boolean
  animationSpeed: number
  parallaxEnabled: boolean

  // Actions
  setIdleAnimations: (enabled: boolean) => void
  setReducedMotion: (reduced: boolean) => void
  setAnimationSpeed: (speed: number) => void
  setParallaxEnabled: (enabled: boolean) => void
  resetToDefaults: () => void
}

const defaultPreferences = {
  idleAnimationsEnabled: true,
  reducedMotion: false,
  animationSpeed: 1,
  parallaxEnabled: true,
}

export const useAnimationStore = create<AnimationPreferences>()(
  persist(
    (set) => ({
      ...defaultPreferences,

      setIdleAnimations: (enabled) => set({ idleAnimationsEnabled: enabled }),
      setReducedMotion: (reduced) => set({
        reducedMotion: reduced,
        idleAnimationsEnabled: reduced ? false : true,
        parallaxEnabled: reduced ? false : true,
      }),
      setAnimationSpeed: (speed) => set({ animationSpeed: Math.max(0.5, Math.min(2, speed)) }),
      setParallaxEnabled: (enabled) => set({ parallaxEnabled: enabled }),
      resetToDefaults: () => set(defaultPreferences),
    }),
    {
      name: 'animation-preferences',
    }
  )
)
