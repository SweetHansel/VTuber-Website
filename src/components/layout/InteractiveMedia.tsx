'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useState, useCallback, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useAnimationStore } from '@/stores/animationStore'

export interface MediaState {
  src: string
  alt?: string
  sound?: string // Audio file to play
}

export interface CursorEffect {
  src: string // GIF or image to spawn at cursor
  duration?: number // How long to show (ms)
  size?: number
}

interface InteractiveMediaProps {
  className?: string
  width?: number
  height?: number
  depth?: number

  // Media states
  defaultMedia: MediaState
  hoverMedia?: MediaState
  clickMedia?: MediaState

  // Cursor effects
  cursorEffect?: CursorEffect

  // Callbacks
  onClick?: () => void
  onHoverStart?: () => void
  onHoverEnd?: () => void
}

interface CursorSpawn {
  id: number
  x: number
  y: number
  src: string
  size: number
}

export function InteractiveMedia({
  className,
  width = 200,
  height = 200,
  depth = -20,
  defaultMedia,
  hoverMedia,
  clickMedia,
  cursorEffect,
  onClick,
  onHoverStart,
  onHoverEnd,
}: InteractiveMediaProps) {
  const { idleAnimationsEnabled } = useAnimationStore()
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [cursorSpawns, setCursorSpawns] = useState<CursorSpawn[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const spawnIdRef = useRef(0)

  // Determine current media based on state
  const currentMedia = isClicked && clickMedia
    ? clickMedia
    : isHovered && hoverMedia
    ? hoverMedia
    : defaultMedia

  // Play sound effect
  const playSound = useCallback((soundUrl?: string) => {
    if (!soundUrl) return

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    audioRef.current = new Audio(soundUrl)
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {
      // Ignore autoplay restrictions
    })
  }, [])

  // Handle cursor effect spawn
  const spawnCursorEffect = useCallback((e: React.MouseEvent) => {
    if (!cursorEffect || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = spawnIdRef.current++
    const size = cursorEffect.size || 40

    setCursorSpawns((prev) => [...prev, { id, x, y, src: cursorEffect.src, size }])

    // Remove after duration
    setTimeout(() => {
      setCursorSpawns((prev) => prev.filter((spawn) => spawn.id !== id))
    }, cursorEffect.duration || 1000)
  }, [cursorEffect])

  // Hover handlers
  const handleHoverStart = useCallback(() => {
    setIsHovered(true)
    if (hoverMedia?.sound) playSound(hoverMedia.sound)
    onHoverStart?.()
  }, [hoverMedia, playSound, onHoverStart])

  const handleHoverEnd = useCallback(() => {
    setIsHovered(false)
    setIsClicked(false)
    onHoverEnd?.()
  }, [onHoverEnd])

  // Click handler
  const handleClick = useCallback((e: React.MouseEvent) => {
    setIsClicked(true)
    if (clickMedia?.sound) playSound(clickMedia.sound)
    spawnCursorEffect(e)
    onClick?.()

    // Reset click state after animation
    setTimeout(() => setIsClicked(false), 300)
  }, [clickMedia, playSound, spawnCursorEffect, onClick])

  // Handle cursor movement for continuous effects
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isClicked && cursorEffect) {
      // Throttle spawning
      if (Math.random() > 0.7) {
        spawnCursorEffect(e)
      }
    }
  }, [isClicked, cursorEffect, spawnCursorEffect])

  return (
    <motion.div
      ref={containerRef}
      className={cn('relative select-none', className)}
      style={{
        transform: `translateZ(${depth}px)`,
        width,
        height,
      }}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Main media */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMedia.src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full w-full"
        >
          <Image
            src={currentMedia.src}
            alt={currentMedia.alt || 'Interactive media'}
            width={width}
            height={height}
            className="h-full w-full object-contain"
            unoptimized // Allow GIFs to animate
          />
        </motion.div>
      </AnimatePresence>

      {/* Cursor effect spawns */}
      <AnimatePresence>
        {cursorSpawns.map((spawn) => (
          <motion.div
            key={spawn.id}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute"
            style={{
              left: spawn.x - spawn.size / 2,
              top: spawn.y - spawn.size / 2,
              width: spawn.size,
              height: spawn.size,
            }}
          >
            <Image
              src={spawn.src}
              alt=""
              width={spawn.size}
              height={spawn.size}
              className="h-full w-full object-contain"
              unoptimized
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
