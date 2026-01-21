import type { Variants } from 'framer-motion'

// Page transition variants
export const pageVariants: Variants = {
  initial: (direction: 'up' | 'down') => ({
    y: direction === 'down' ? '100%' : '-100%',
    opacity: 0,
    rotateX: direction === 'down' ? -15 : 15,
  }),
  enter: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: (direction: 'up' | 'down') => ({
    y: direction === 'down' ? '-100%' : '100%',
    opacity: 0,
    rotateX: direction === 'down' ? 15 : -15,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

// Slide variants for simpler transitions
export const slideVariants: Variants = {
  initial: (direction: 'up' | 'down' | 'left' | 'right') => {
    const offset = 50
    return {
      x: direction === 'left' ? offset : direction === 'right' ? -offset : 0,
      y: direction === 'up' ? offset : direction === 'down' ? -offset : 0,
      opacity: 0,
    }
  },
  enter: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: (direction: 'up' | 'down' | 'left' | 'right') => {
    const offset = 50
    return {
      x: direction === 'left' ? -offset : direction === 'right' ? offset : 0,
      y: direction === 'up' ? -offset : direction === 'down' ? offset : 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    }
  },
}

// Fade variants
export const fadeVariants: Variants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
}

// Scale fade variants
export const scaleFadeVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
}

// Stagger children variants
export const staggerContainerVariants: Variants = {
  initial: {},
  enter: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

export const staggerItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
}
