import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { clamp } from '@/lib/utils'

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
      setAnimationSpeed: (speed) => set({ animationSpeed: clamp(speed, 0.5, 2) }),
      setParallaxEnabled: (enabled) => set({ parallaxEnabled: enabled }),
      resetToDefaults: () => set(defaultPreferences),
    }),
    {
      name: 'animation-preferences',
    }
  )
)
