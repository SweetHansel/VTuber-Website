'use client'

import { motion } from 'framer-motion'
import { useParallax } from '@/animations'
import { cn } from '@/lib/utils'
import { useAnimationStore } from '@/stores/animationStore'
import { ReactNode, forwardRef } from 'react'

export interface AspectRatio {
  width: number
  height: number
}

interface Container2_5DProps {
  children: ReactNode
  className?: string
  depth?: number
  rotateXRange?: [number, number]
  rotateYRange?: [number, number]
  perspective?: number
  disabled?: boolean
  aspectRatio?: AspectRatio
  isFocused?: boolean
  onClick?: () => void
}

export const Container2_5D = forwardRef<HTMLDivElement, Container2_5DProps>(
  function Container2_5D(
    {
      children,
      className,
      depth = 0,
      rotateXRange = [-5, 5],
      rotateYRange = [-5, 5],
      perspective = 1000,
      disabled = false,
      aspectRatio,
      isFocused = true,
      onClick,
    },
    ref
  ) {
    const { parallaxEnabled } = useAnimationStore()
    const { containerRef, values, style } = useParallax({
      rotateXRange,
      rotateYRange,
      perspective,
    })

    const isEnabled = parallaxEnabled && !disabled

    const aspectRatioStyle = aspectRatio
      ? { aspectRatio: `${aspectRatio.width} / ${aspectRatio.height}` }
      : undefined

    return (
      <div
        ref={ref || (containerRef as React.RefObject<HTMLDivElement>)}
        className={cn(
          'relative transition-all duration-500',
          !isFocused && 'scale-95 opacity-70',
          onClick && 'cursor-pointer',
          className
        )}
        style={{ ...aspectRatioStyle, ...(isEnabled ? style : undefined) }}
        onClick={onClick}
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
)

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
