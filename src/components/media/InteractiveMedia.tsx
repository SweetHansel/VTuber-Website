'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useState, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface MediaState {
  src: string
  alt?: string
  sound?: string
}

export interface CursorEffect {
  src: string
  duration?: number
  size?: number
}

interface InteractiveMediaProps {
  className?: string
  imageClass?: string
  defaultMedia: MediaState
  hoverMedia?: MediaState
  clickMedia?: MediaState
  cursorEffect?: CursorEffect
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

function isAnimatedImage(src: string): boolean {
  return src.toLowerCase().endsWith('.gif')
}

export function InteractiveMedia({
  className,
  imageClass,
  defaultMedia,
  hoverMedia,
  clickMedia,
  cursorEffect,
  onClick,
  onHoverStart,
  onHoverEnd,
}: InteractiveMediaProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [cursorSpawns, setCursorSpawns] = useState<CursorSpawn[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const spawnIdRef = useRef(0)

  const currentMedia = isClicked && clickMedia
    ? clickMedia
    : isHovered && hoverMedia
    ? hoverMedia
    : defaultMedia

  const playSound = useCallback((soundUrl?: string) => {
    if (!soundUrl) return

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    audioRef.current = new Audio(soundUrl)
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {})
  }, [])

  const spawnCursorEffect = useCallback((e: React.MouseEvent) => {
    if (!cursorEffect || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = spawnIdRef.current++
    const size = cursorEffect.size || 40

    setCursorSpawns((prev) => [...prev, { id, x, y, src: cursorEffect.src, size }])

    setTimeout(() => {
      setCursorSpawns((prev) => prev.filter((spawn) => spawn.id !== id))
    }, cursorEffect.duration || 1000)
  }, [cursorEffect])

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

  const handleClick = useCallback((e: React.MouseEvent) => {
    setIsClicked(true)
    if (clickMedia?.sound) playSound(clickMedia.sound)
    spawnCursorEffect(e)
    onClick?.()

    setTimeout(() => setIsClicked(false), 300)
  }, [clickMedia, playSound, spawnCursorEffect, onClick])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isClicked && cursorEffect) {
      if (Math.random() > 0.7) {
        spawnCursorEffect(e)
      }
    }
  }, [isClicked, cursorEffect, spawnCursorEffect])

  return (
    <div
      ref={containerRef}
      className={cn('relative select-none', className)}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
    >
      <Image
        src={currentMedia.src}
        alt={currentMedia.alt || 'Interactive media'}
        fill
        priority
        className={imageClass ?? "object-contain"}
        unoptimized={isAnimatedImage(currentMedia.src)}
      />

      <AnimatePresence>
        {cursorSpawns.map((spawn) => (
          <motion.div
            key={spawn.id}
            initial={{ opacity: 1, scale: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="pointer-events-none absolute"
            animate={{
              left: spawn.x - spawn.size / 2,
              top: spawn.y - spawn.size / 2,
              width: spawn.size,
              height: spawn.size,
              opacity: 1, scale: 1 
            }}
          >
            <Image
              src={spawn.src}
              alt=""
              width={spawn.size}
              height={spawn.size}
              className="h-full w-full object-contain"
              unoptimized={isAnimatedImage(spawn.src)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
