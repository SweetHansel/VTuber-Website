'use client'

import { motion, AnimatePresence, Variants } from 'framer-motion'
import { ReactNode, useMemo } from 'react'
import { cn } from '@/lib/utils'

export interface FrameAspectRatio {
  width: number
  height: number
}

export interface AnchorPosition {
  x: 'left' | 'center' | 'right'
  y: 'top' | 'center' | 'bottom'
}

interface TransitionFrameProps {
  children: ReactNode
  className?: string
  aspectRatio?: FrameAspectRatio
  anchor?: AnchorPosition
  isActive?: boolean
  transitionKey?: string
  transitionType?: 'fade' | 'slide' | 'scale' | 'flip'
  transitionDuration?: number
}

const getTransitionVariants = (type: string): Variants => {
  switch (type) {
    case 'slide':
      return {
        initial: { x: 50, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -50, opacity: 0 },
      }
    case 'scale':
      return {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.9, opacity: 0 },
      }
    case 'flip':
      return {
        initial: { rotateY: 90, opacity: 0 },
        animate: { rotateY: 0, opacity: 1 },
        exit: { rotateY: -90, opacity: 0 },
      }
    case 'fade':
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
  }
}

const getAnchorStyles = (anchor: AnchorPosition) => {
  const xMap = { left: 'left-0', center: 'left-1/2 -translate-x-1/2', right: 'right-0' }
  const yMap = { top: 'top-0', center: 'top-1/2 -translate-y-1/2', bottom: 'bottom-0' }
  return `${xMap[anchor.x]} ${yMap[anchor.y]}`
}

export function TransitionFrame({
  children,
  className,
  aspectRatio = { width: 4, height: 3 },
  anchor = { x: 'center', y: 'center' },
  isActive = true,
  transitionKey,
  transitionType = 'fade',
  transitionDuration = 0.3,
}: TransitionFrameProps) {
  const variants = useMemo(() => getTransitionVariants(transitionType), [transitionType])
  const anchorClasses = useMemo(() => getAnchorStyles(anchor), [anchor])

  const aspectRatioValue = `${aspectRatio.width} / ${aspectRatio.height}`

  return (
    <div
      className={cn('absolute', anchorClasses, className)}
      style={{ aspectRatio: aspectRatioValue }}
    >
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            key={transitionKey}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: transitionDuration, ease: 'easeInOut' }}
            className="h-full w-full"
            style={{ aspectRatio: aspectRatioValue }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
