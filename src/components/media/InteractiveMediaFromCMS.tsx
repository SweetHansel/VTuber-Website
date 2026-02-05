'use client'

import { useInteractiveMedia, getMedia, type InteractiveMedia as InteractiveMediaType } from '@/hooks/useCMS'
import { InteractiveMedia, type MediaState, type CursorEffect } from './InteractiveMedia'
import { cn } from '@/lib/utils'

interface InteractiveMediaFromCMSProps {
  location: string
  className?: string
  imageClass?: string
  showEmpty?: boolean
  onClick?: () => void
  onHoverStart?: () => void
  onHoverEnd?: () => void
}

function EmptySkeleton({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn('relative', className)}>
      <div className="h-full w-full rounded-lg bg-(--modal-primary)/60" />
    </div>
  )
}

function transformCMSData(data: InteractiveMediaType): {
  defaultMedia: MediaState
  hoverMedia?: MediaState
  clickMedia?: MediaState
  cursorEffect?: CursorEffect
} | null {
  const defaultMediaUrl = getMedia(data.defaultState?.media)?.url
  if (!defaultMediaUrl) return null

  const result: {
    defaultMedia: MediaState
    hoverMedia?: MediaState
    clickMedia?: MediaState
    cursorEffect?: CursorEffect
  } = {
    defaultMedia: {
      src: defaultMediaUrl,
      alt: data.defaultState?.alt ?? undefined,
      sound: getMedia(data.defaultState?.sound)?.url ?? undefined,
    },
  }

  const hoverMediaUrl = getMedia(data.hoverState?.media)?.url
  if (data.hoverState?.enabled && hoverMediaUrl) {
    result.hoverMedia = {
      src: hoverMediaUrl,
      alt: data.hoverState.alt ?? undefined,
      sound: getMedia(data.hoverState.sound)?.url ?? undefined,
    }
  }

  const clickMediaUrl = getMedia(data.clickState?.media)?.url
  if (data.clickState?.enabled && clickMediaUrl) {
    result.clickMedia = {
      src: clickMediaUrl,
      alt: data.clickState.alt ?? undefined,
      sound: getMedia(data.clickState.sound)?.url ?? undefined,
    }
  }

  const cursorMediaUrl = getMedia(data.cursorEffect?.media)?.url
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
  showEmpty,
  onClick,
  onHoverStart,
  onHoverEnd,
}: Readonly<InteractiveMediaFromCMSProps>) {
  const { data, loading, error } = useInteractiveMedia(location)

  // Still loading - show nothing to avoid flicker
  if (loading) return null

  // No data available
  if (error || !data || Array.isArray(data)) {
    return showEmpty ? <EmptySkeleton className={className} /> : null
  }

  const transformed = transformCMSData(data)
  if (!transformed) return null

  return (
    <InteractiveMedia
      className={className}
      imageClass={imageClass}
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
