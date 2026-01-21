'use client'

import { motion, MotionValue } from 'framer-motion'
import { useParallax } from '@/animations'
import { cn } from '@/lib/utils'
import { useAnimationStore } from '@/stores/animationStore'
import { ReactNode } from 'react'

interface Container2_5DProps {
  children: ReactNode
  className?: string
  depth?: number
  rotateXRange?: [number, number]
  rotateYRange?: [number, number]
  perspective?: number
  disabled?: boolean
}

export function Container2_5D({
  children,
  className,
  depth = 0,
  rotateXRange = [-5, 5],
  rotateYRange = [-5, 5],
  perspective = 1000,
  disabled = false,
}: Container2_5DProps) {
  const { parallaxEnabled } = useAnimationStore()
  const { containerRef, values, style } = useParallax({
    rotateXRange,
    rotateYRange,
    perspective,
  })

  const isEnabled = parallaxEnabled && !disabled

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={cn('relative', className)}
      style={isEnabled ? style : undefined}
    >
      <motion.div
        style={
          isEnabled
            ? {
                rotateX: values.rotateX,
                rotateY: values.rotateY,
                transformStyle: 'preserve-3d',
              }
            : undefined
        }
        className="h-full w-full"
      >
        <div
          style={{
            transform: depth !== 0 ? `translateZ(${depth}px)` : undefined,
            transformStyle: 'preserve-3d',
          }}
          className="h-full w-full"
        >
          {children}
        </div>
      </motion.div>
    </div>
  )
}

// Layer component for adding depth to children within a 2.5D container
interface LayerProps {
  children: ReactNode
  depth: number
  className?: string
}

export function Layer({ children, depth, className }: LayerProps) {
  return (
    <div
      className={className}
      style={{
        transform: `translateZ(${depth}px)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  )
}
