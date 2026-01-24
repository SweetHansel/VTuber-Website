'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { getIdleVariant } from '@/animations'
import { useAnimationStore } from '@/stores/animationStore'
import { cn } from '@/lib/utils'

interface AnimatedArtworkProps {
  position: 'right-upper' | 'artworks-left' | 'discography-right'
  className?: string
  src?: string
  alt?: string
  width?: number
  height?: number
  animationType?: 'float' | 'bounce' | 'sway' | 'pulse' | 'none'
  animationConfig?: {
    duration?: number
    delay?: number
    amplitude?: number
  }
  depth?: number
}

export function AnimatedArtwork({
  position,
  className,
  src = '/placeholder-artwork.png',
  alt = 'Animated artwork',
  width = 200,
  height = 200,
  animationType = 'float',
  animationConfig = {},
  depth = -20,
}: AnimatedArtworkProps) {
  const { idleAnimationsEnabled, animationSpeed } = useAnimationStore()

  const variants = getIdleVariant(animationType)
  const isAnimating = idleAnimationsEnabled && animationType !== 'none'

  const custom = {
    ...animationConfig,
    duration: (animationConfig.duration || 4) / animationSpeed,
  }

  return (
    <motion.div
      className={cn('pointer-events-none select-none', className)}
      variants={variants}
      initial="static"
      animate={isAnimating ? 'idle' : 'static'}
      custom={custom}
      style={{
        transform: `translateZ(${depth}px)`,
        width,
        height,
      }}
    >
      {src && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-full w-full object-contain opacity-80"
          priority={position === 'right-upper'}
        />
      )}
    </motion.div>
  )
}
