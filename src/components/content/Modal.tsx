'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useModalStore, type ModalType } from '@/stores/modalStore'
import { useAudioStore, type Track } from '@/stores/audioStore'
import { X, Play, Pause, ExternalLink, Calendar, MapPin, User, Box } from 'lucide-react'
import { scaleFadeVariants } from '@/animations'
import { formatDuration, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { is3DModelType } from '@/constants/models'
import { ANNOUNCEMENT_TYPE_COLORS, type ContentType } from '@/constants/content'

export function Modal() {
  const { isOpen, modalType, contentId, contentData, closeModal } = useModalStore()

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [closeModal])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div
            variants={scaleFadeVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div className="relative rounded-2xl bg-slate-900 p-6 shadow-2xl">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Content based on type */}
              <ModalContent
                type={modalType}
                id={contentId}
                data={contentData}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface ModalContentProps {
  type: ModalType
  id: string | null
  data: Record<string, unknown> | null
}

function ModalContent({ type, id, data }: ModalContentProps) {
  if (!data) {
    return (
      <div className="py-8 text-center text-white/60">Loading...</div>
    )
  }

  switch (type) {
    case 'announcement':
    case 'blog-post':
      return <ContentModalContent type={type} data={data} />

    case 'artwork':
      return <ArtworkModalContent data={data} />

    case 'song':
      return <SongModalContent id={id} data={data} />

    case 'model':
      return <ModelModalContent data={data} />

    default:
      return (
        <div className="py-8 text-center text-white/60">
          Content not available
        </div>
      )
  }
}

function ContentModalContent({ type, data }: { type: ContentType; data: Record<string, unknown> }) {
  const title = String(data.title || '')
  const excerpt = data.excerpt ? String(data.excerpt) : undefined
  const image = data.image ? String(data.image) : undefined
  const date = data.date ? String(data.date) : undefined
  const eventDate = data.eventDate ? String(data.eventDate) : undefined
  const location = data.location ? String(data.location) : undefined
  const announcementType = data.announcementType ? String(data.announcementType) : undefined

  return (
    <div>
      {/* Image */}
      {image && (
        <div className="relative -mx-6 -mt-6 mb-6 aspect-video overflow-hidden rounded-t-2xl">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Type badge */}
      {type === 'announcement' && announcementType && (
        <span
          className={cn(
            'mb-3 inline-block rounded-full px-3 py-1 text-sm font-medium capitalize',
            ANNOUNCEMENT_TYPE_COLORS[announcementType] || ANNOUNCEMENT_TYPE_COLORS.general
          )}
        >
          {announcementType}
        </span>
      )}

      {type === 'blog-post' && (
        <span className="mb-3 inline-block rounded-full bg-indigo-500/20 px-3 py-1 text-sm font-medium text-indigo-300">
          Blog Post
        </span>
      )}

      {/* Title */}
      <h2 className="mb-3 text-2xl font-bold text-white">{title}</h2>

      {/* Meta info */}
      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-white/60">
        {eventDate && (
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(eventDate, { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        )}
        {location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {location}
          </span>
        )}
        {date && !eventDate && (
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(date, { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        )}
      </div>

      {/* Content */}
      {excerpt && (
        <p className="text-white/70 leading-relaxed">{excerpt}</p>
      )}
    </div>
  )
}

function ArtworkModalContent({ data }: { data: Record<string, unknown> }) {
  const title = data.title ? String(data.title) : undefined
  const image = String(data.image || '/placeholder-art.jpg')
  const artworkType = String(data.artworkType || 'fanart')
  const artistName = data.artistName ? String(data.artistName) : undefined
  const sourceUrl = data.sourceUrl ? String(data.sourceUrl) : undefined

  return (
    <div>
      {/* Image */}
      <div className="relative -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-2xl">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={image}
            alt={title || 'Artwork'}
            fill
            className="object-contain bg-black/50"
          />
        </div>
      </div>

      {/* Type badge */}
      <span
        className={cn(
          'mb-3 inline-block rounded-full px-3 py-1 text-sm font-medium capitalize',
          artworkType === 'official'
            ? 'bg-blue-500/20 text-blue-300'
            : artworkType === 'fanart'
            ? 'bg-cyan-500/20 text-cyan-300'
            : artworkType === 'commissioned'
            ? 'bg-purple-500/20 text-purple-300'
            : 'bg-gray-500/20 text-gray-300'
        )}
      >
        {artworkType}
      </span>

      {/* Title */}
      {title && (
        <h2 className="mb-2 text-2xl font-bold text-white">{title}</h2>
      )}

      {/* Artist */}
      {artistName && (
        <p className="mb-4 text-white/60">by {artistName}</p>
      )}

      {/* Source link */}
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        >
          View Original
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  )
}

function SongModalContent({ id, data }: { id: string | null; data: Record<string, unknown> }) {
  const { currentTrack, isPlaying, setTrack, play, pause } = useAudioStore()

  const trackId = id || ''
  const title = String(data.title || 'Unknown Title')
  const trackType = String(data.trackType || 'cover')
  const coverArt = String(data.coverArt || '/placeholder-cover.jpg')
  const audioUrl = data.audioUrl ? String(data.audioUrl) : undefined
  const duration = typeof data.duration === 'number' ? data.duration : undefined
  const originalArtist = data.originalArtist ? String(data.originalArtist) : undefined
  const streamingLinks = Array.isArray(data.streamingLinks) ? data.streamingLinks : []

  const isCurrentTrack = currentTrack?.id === trackId
  const isCurrentlyPlaying = isCurrentTrack && isPlaying

  const handlePlayClick = () => {
    if (!audioUrl) return

    if (isCurrentTrack) {
      isPlaying ? pause() : play()
    } else {
      const track: Track = {
        id: trackId,
        title,
        coverArt,
        audioUrl,
        duration: duration || 0,
        artist: originalArtist,
      }
      setTrack(track)
      play()
    }
  }

  return (
    <div className="flex gap-6">
      {/* Cover Art */}
      <div className="relative h-48 w-48 flex-shrink-0 overflow-hidden rounded-xl">
        <Image
          src={coverArt}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col">
        <span className="mb-2 w-fit rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium capitalize text-blue-400">
          {trackType}
        </span>

        <h2 className="mb-1 text-2xl font-bold text-white">{title}</h2>

        {originalArtist && (
          <p className="mb-2 text-white/60">Original by {originalArtist}</p>
        )}

        {duration && (
          <p className="mb-4 text-sm text-white/40">{formatDuration(duration)}</p>
        )}

        {/* Play Button */}
        {audioUrl && (
          <button
            onClick={handlePlayClick}
            className="mb-4 flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-black transition-transform hover:scale-105"
          >
            {isCurrentlyPlaying ? (
              <>
                <Pause className="h-5 w-5" fill="currentColor" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" />
                Play
              </>
            )}
          </button>
        )}

        {/* Streaming Links */}
        {streamingLinks.length > 0 && (
          <div className="mt-auto">
            <p className="mb-2 text-sm text-white/40">Listen on</p>
            <div className="flex flex-wrap gap-2">
              {streamingLinks.map((link: { platform: string; url: string }) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                >
                  {link.platform}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ModelModalContent({ data }: { data: Record<string, unknown> }) {
  const name = String(data.name || 'Unknown Model')
  const version = data.version ? String(data.version) : undefined
  const modelType = String(data.modelType || 'live2d')
  const isActive = Boolean(data.isActive)
  const debutDate = data.debutDate ? String(data.debutDate) : undefined
  const showcase = Array.isArray(data.showcase) ? data.showcase : []
  const credits = Array.isArray(data.credits) ? data.credits : []
  const technicalSpecs = data.technicalSpecs as Record<string, unknown> | undefined

  // Get first showcase image as thumbnail
  const thumbnail = showcase[0]?.media?.url || '/placeholder-model.png'

  // Determine if 2D or 3D
  const is3D = is3DModelType(modelType)

  return (
    <div className="flex gap-6">
      {/* Thumbnail */}
      <div className="relative h-64 w-48 flex-shrink-0 overflow-hidden rounded-xl">
        <Image
          src={thumbnail}
          alt={name}
          fill
          className="object-cover"
        />
        {isActive && (
          <div className="absolute right-2 top-2 rounded-full bg-green-500/90 px-2 py-0.5 text-xs font-medium text-white">
            Active
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col">
        {/* Type badge */}
        <div className="mb-3 flex items-center gap-2">
          <span className={cn(
            'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium uppercase',
            is3D ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
          )}>
            {is3D ? <Box className="h-3 w-3" /> : <User className="h-3 w-3" />}
            {modelType}
          </span>
        </div>

        {/* Name & Version */}
        <h2 className="mb-1 text-2xl font-bold text-white">{name}</h2>
        {version && (
          <p className="mb-3 text-white/60">Version {version}</p>
        )}

        {/* Debut date */}
        {debutDate && (
          <p className="mb-4 flex items-center gap-1.5 text-sm text-white/40">
            <Calendar className="h-4 w-4" />
            Debut: {formatDate(debutDate, { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        )}

        {/* Technical specs (for 3D models) */}
        {technicalSpecs && is3D && (
          <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
            {!!technicalSpecs.polyCount && (
              <div className="rounded-lg bg-white/5 px-3 py-2">
                <p className="text-white/40">Polygons</p>
                <p className="font-medium text-white">{Number(technicalSpecs.polyCount).toLocaleString()}</p>
              </div>
            )}
            {!!technicalSpecs.blendshapes && (
              <div className="rounded-lg bg-white/5 px-3 py-2">
                <p className="text-white/40">Blendshapes</p>
                <p className="font-medium text-white">{String(technicalSpecs.blendshapes)}</p>
              </div>
            )}
            {!!technicalSpecs.boneCount && (
              <div className="rounded-lg bg-white/5 px-3 py-2">
                <p className="text-white/40">Bones</p>
                <p className="font-medium text-white">{String(technicalSpecs.boneCount)}</p>
              </div>
            )}
            {!!technicalSpecs.textureResolution && (
              <div className="rounded-lg bg-white/5 px-3 py-2">
                <p className="text-white/40">Texture</p>
                <p className="font-medium text-white">{String(technicalSpecs.textureResolution)}</p>
              </div>
            )}
          </div>
        )}

        {/* Credits */}
        {credits.length > 0 && (
          <div className="mt-auto">
            <p className="mb-2 text-sm text-white/40">Credits</p>
            <div className="flex flex-wrap gap-2">
              {credits.map((credit: { role?: string; artist?: { name?: string }; name?: string }, index: number) => (
                <div
                  key={index}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-sm"
                >
                  <span className="text-white/50">{credit.role}: </span>
                  <span className="text-white">{credit.artist?.name || credit.name || 'Unknown'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
