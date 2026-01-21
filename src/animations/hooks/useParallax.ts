'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useSpring, useTransform, MotionValue } from 'framer-motion'
import { useAnimationStore } from '@/stores/animationStore'

interface ParallaxConfig {
  rotateXRange?: [number, number]
  rotateYRange?: [number, number]
  scaleRange?: [number, number]
  perspective?: number
  springConfig?: {
    stiffness?: number
    damping?: number
    mass?: number
  }
}

interface ParallaxValues {
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
  scale: MotionValue<number>
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}

const defaultConfig: Required<ParallaxConfig> = {
  rotateXRange: [-8, 8],
  rotateYRange: [-8, 8],
  scaleRange: [1, 1.02],
  perspective: 1000,
  springConfig: {
    stiffness: 150,
    damping: 20,
    mass: 0.5,
  },
}

export function useParallax(config: ParallaxConfig = {}): {
  containerRef: React.RefObject<HTMLDivElement | null>
  values: ParallaxValues
  style: {
    perspective: number
    transformStyle: 'preserve-3d'
  }
} {
  const containerRef = useRef<HTMLDivElement>(null)
  const { parallaxEnabled } = useAnimationStore()

  const mergedConfig = { ...defaultConfig, ...config }
  const { rotateXRange, rotateYRange, scaleRange, perspective, springConfig } = mergedConfig

  // Mouse position as motion values (normalized -1 to 1)
  const mouseX = useSpring(0, springConfig)
  const mouseY = useSpring(0, springConfig)

  // Transform mouse position to rotation
  const rotateX = useTransform(mouseY, [-1, 1], rotateXRange)
  const rotateY = useTransform(mouseX, [-1, 1], rotateYRange)
  const scale = useTransform(
    mouseX,
    [-1, 0, 1],
    [scaleRange[0], scaleRange[1], scaleRange[0]]
  )

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current || !parallaxEnabled) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Normalize mouse position relative to container center (-1 to 1)
    const normalizedX = (e.clientX - centerX) / (rect.width / 2)
    const normalizedY = (e.clientY - centerY) / (rect.height / 2)

    mouseX.set(normalizedX)
    mouseY.set(normalizedY)
  }, [mouseX, mouseY, parallaxEnabled])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  return {
    containerRef,
    values: {
      rotateX,
      rotateY,
      scale,
      mouseX,
      mouseY,
    },
    style: {
      perspective,
      transformStyle: 'preserve-3d' as const,
    },
  }
}
