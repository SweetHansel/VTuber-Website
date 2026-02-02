'use client'

import { useInteractiveMedia, type InteractiveMedia as InteractiveMediaType, type Media } from '@/hooks/useCMS'

// Helper to get Media object from union type (handles depth=0 vs depth>0)
function getMediaUrl(media: number | Media | null | undefined): string | undefined {
  if (!media || typeof media === 'number') return undefined
  return media.url ?? undefined
}
import { InteractiveMedia, type MediaState, type CursorEffect } from './InteractiveMedia'
import { cn } from '@/lib/utils'

interface InteractiveMediaFromCMSProps {
  location: string
  className?: string
  imageClass?: string
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

function LoadingSkeleton({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn('relative animate-pulse', className)}>
      <div className="h-full w-full rounded-lg bg-white/10" />
    </div>
  )
}

function EmptySkeleton({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn('relative', className)}>
      <div className="h-full w-full rounded-lg bg-(--primary)/60" />
    </div>
  )
}

function transformCMSData(data: InteractiveMediaType): {
  defaultMedia: MediaState
  hoverMedia?: MediaState
  clickMedia?: MediaState
  cursorEffect?: CursorEffect
  depth?: number
} | null {
  // If no media URL, return null - don't render anything
  const defaultMediaUrl = getMediaUrl(data.defaultState?.media)
  if (!defaultMediaUrl) {
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
      src: defaultMediaUrl,
      alt: data.defaultState?.alt ?? undefined,
      sound: getMediaUrl(data.defaultState?.sound),
    },
    depth: data.depth ?? undefined,
  }

  const hoverMediaUrl = getMediaUrl(data.hoverState?.media)
  if (data.hoverState?.enabled && hoverMediaUrl) {
    result.hoverMedia = {
      src: hoverMediaUrl,
      alt: data.hoverState.alt ?? undefined,
      sound: getMediaUrl(data.hoverState.sound),
    }
  }

  const clickMediaUrl = getMediaUrl(data.clickState?.media)
  if (data.clickState?.enabled && clickMediaUrl) {
    result.clickMedia = {
      src: clickMediaUrl,
      alt: data.clickState.alt ?? undefined,
      sound: getMediaUrl(data.clickState.sound),
    }
  }

  const cursorMediaUrl = getMediaUrl(data.cursorEffect?.media)
  if (data.cursorEffect?.enabled && cursorMediaUrl) {
    result.cursorEffect = {
      src: cursorMediaUrl,
      duration: data.cursorEffect.duration ?? undefined,
      size: data.cursorEffect.size ?? undefined,
    }
  }

  return result
}

export function InteractiveMediaFromCMS({
  location,
  className,
  imageClass,
  fallback,
  depth,
  showEmpty,
  onClick,
  onHoverStart,
  onHoverEnd,
}: Readonly<InteractiveMediaFromCMSProps>) {
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
      imageClass={imageClass}
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
  data: InteractiveMediaType | null
  className?: string
  imageClass?: string
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
  imageClass,
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
      imageClass={imageClass}
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
      imageClass={imageClass}
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
