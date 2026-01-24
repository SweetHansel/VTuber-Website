import type { Variants, Transition } from 'framer-motion'

// Base transition for idle animations
const idleTransition = (duration: number, delay = 0): Transition => ({
  duration,
  delay,
  repeat: Infinity,
  repeatType: 'reverse',
  ease: 'easeInOut',
})

// Float animation - gentle up/down movement
export const floatVariants: Variants = {
  idle: (custom: { amplitude?: number; duration?: number; delay?: number } = {}) => ({
    y: [0, -(custom.amplitude || 8), 0],
    transition: {
      duration: custom.duration || 4,
      delay: custom.delay || 0,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }),
  static: {
    y: 0,
  },
}

// Bounce animation - playful bouncing
export const bounceVariants: Variants = {
  idle: (custom: { amplitude?: number; duration?: number } = {}) => ({
    y: [0, -(custom.amplitude || 12), 0],
    scale: [1, 1.02, 1],
    transition: {
      duration: custom.duration || 2,
      repeat: Infinity,
      ease: [0.45, 0, 0.55, 1],
    },
  }),
  static: {
    y: 0,
    scale: 1,
  },
}

// Sway animation - side to side
export const swayVariants: Variants = {
  idle: (custom: { amplitude?: number; duration?: number; rotation?: number } = {}) => ({
    x: [0, custom.amplitude || 6, 0, -(custom.amplitude || 6), 0],
    rotate: [0, custom.rotation || 2, 0, -(custom.rotation || 2), 0],
    transition: {
      duration: custom.duration || 5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }),
  static: {
    x: 0,
    rotate: 0,
  },
}

// Pulse animation - subtle scale breathing
export const pulseVariants: Variants = {
  idle: (custom: { scale?: number; duration?: number } = {}) => ({
    scale: [1, custom.scale || 1.03, 1],
    opacity: [1, 0.95, 1],
    transition: {
      duration: custom.duration || 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }),
  static: {
    scale: 1,
    opacity: 1,
  },
}

// Rotate animation - slow spin
export const rotateVariants: Variants = {
  idle: (custom: { duration?: number } = {}) => ({
    rotate: [0, 360],
    transition: {
      duration: custom.duration || 20,
      repeat: Infinity,
      ease: 'linear',
    },
  }),
  static: {
    rotate: 0,
  },
}

// Combined float with slight rotation
export const floatRotateVariants: Variants = {
  idle: (custom: { amplitude?: number; duration?: number; rotation?: number } = {}) => ({
    y: [0, -(custom.amplitude || 10), 0],
    rotate: [-(custom.rotation || 1), custom.rotation || 1, -(custom.rotation || 1)],
    transition: {
      duration: custom.duration || 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }),
  static: {
    y: 0,
    rotate: 0,
  },
}

// Get variant by name
export const getIdleVariant = (type: string): Variants => {
  const variants: Record<string, Variants> = {
    float: floatVariants,
    bounce: bounceVariants,
    sway: swayVariants,
    pulse: pulseVariants,
    rotate: rotateVariants,
    'float-rotate': floatRotateVariants,
  }
  return variants[type] || floatVariants
}
