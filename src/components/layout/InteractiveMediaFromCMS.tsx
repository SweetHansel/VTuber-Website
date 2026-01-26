'use client'

import { useInteractiveMedia, type InteractiveMediaData } from '@/hooks/useCMS'
import { InteractiveMedia, type MediaState, type CursorEffect } from './InteractiveMedia'
import { cn } from '@/lib/utils'

interface InteractiveMediaFromCMSProps {
  location: string
  className?: string
  fallback?: {
    defaultMedia: MediaState
    hoverMedia?: MediaState
    clickMedia?: MediaState
  }
  depth?: number
  showEmpty?: boolean
  onClick?: () => void
  onHoverStart?: () => void
  onHoverEnd?: () => void
}

function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('relative animate-pulse', className)}>
      <div className="h-full w-full rounded-lg bg-white/10" />
    </div>
  )
}

function EmptySkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <div className="h-full w-full rounded-lg bg-blue-950/60" />
    </div>
  )
}

function transformCMSData(data: InteractiveMediaData): {
  defaultMedia: MediaState
  hoverMedia?: MediaState
  clickMedia?: MediaState
  cursorEffect?: CursorEffect
  depth?: number
} | null {
  // If no media URL, return null - don't render anything
  if (!data.defaultState?.media?.url) {
    return null
  }

  const result: {
    defaultMedia: MediaState
    hoverMedia?: MediaState
    clickMedia?: MediaState
    cursorEffect?: CursorEffect
    depth?: number
  } = {
    defaultMedia: {
      src: data.defaultState.media.url,
      alt: data.defaultState?.alt,
      sound: data.defaultState?.sound?.url,
    },
    depth: data.depth,
  }

  if (data.hoverState?.enabled && data.hoverState.media?.url) {
    result.hoverMedia = {
      src: data.hoverState.media.url,
      alt: data.hoverState.alt,
      sound: data.hoverState.sound?.url,
    }
  }

  if (data.clickState?.enabled && data.clickState.media?.url) {
    result.clickMedia = {
      src: data.clickState.media.url,
      alt: data.clickState.alt,
      sound: data.clickState.sound?.url,
    }
  }

  if (data.cursorEffect?.enabled && data.cursorEffect.media?.url) {
    result.cursorEffect = {
      src: data.cursorEffect.media.url,
      duration: data.cursorEffect.duration,
      size: data.cursorEffect.size,
    }
  }

  return result
}

export function InteractiveMediaFromCMS({
  location,
  className,
  fallback,
  depth,
  showEmpty,
  onClick,
  onHoverStart,
  onHoverEnd,
}: InteractiveMediaFromCMSProps) {
  const { data, loading, error } = useInteractiveMedia(location)

  // Show loading skeleton
  if (loading) {
    return <LoadingSkeleton className={className} />
  }

  // If no CMS data, use fallback or show nothing
  if (error || !data || Array.isArray(data)) {
    if (fallback) {
      return (
        <InteractiveMedia
          className={className}
          depth={depth}
          defaultMedia={fallback.defaultMedia}
          hoverMedia={fallback.hoverMedia}
          clickMedia={fallback.clickMedia}
          onClick={onClick}
          onHoverStart={onHoverStart}
          onHoverEnd={onHoverEnd}
        />
      )
    }
    if (showEmpty) return <EmptySkeleton className={className}/>
    return
  }

  const transformed = transformCMSData(data)

  // No valid media to display
  if (!transformed) {
    return null
  }

  return (
    <InteractiveMedia
      className={className}
      depth={depth ?? transformed.depth}
      defaultMedia={transformed.defaultMedia}
      hoverMedia={transformed.hoverMedia}
      clickMedia={transformed.clickMedia}
      cursorEffect={transformed.cursorEffect}
      onClick={onClick}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    />
  )
}

// Alternative: Direct props version that accepts pre-fetched data
interface InteractiveMediaWithDataProps {
  data: InteractiveMediaData | null
  className?: string
  fallback?: {
    defaultMedia: MediaState
    hoverMedia?: MediaState
    clickMedia?: MediaState
  }
  depth?: number
  onClick?: () => void
  onHoverStart?: () => void
  onHoverEnd?: () => void
}

export function InteractiveMediaWithData({
  data,
  className,
  fallback,
  depth,
  onClick,
  onHoverStart,
  onHoverEnd,
}: InteractiveMediaWithDataProps) {
  if (!data) {
    if (fallback) {
      return (
        <InteractiveMedia
          className={className}
          depth={depth}
          defaultMedia={fallback.defaultMedia}
          hoverMedia={fallback.hoverMedia}
          clickMedia={fallback.clickMedia}
          onClick={onClick}
          onHoverStart={onHoverStart}
          onHoverEnd={onHoverEnd}
        />
      )
    }
    return null
  }

  const transformed = transformCMSData(data)

  // No valid media to display
  if (!transformed) {
    return null
  }

  return (
    <InteractiveMedia
      className={className}
      depth={depth ?? transformed.depth}
      defaultMedia={transformed.defaultMedia}
      hoverMedia={transformed.hoverMedia}
      clickMedia={transformed.clickMedia}
      cursorEffect={transformed.cursorEffect}
      onClick={onClick}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    />
  )
}
