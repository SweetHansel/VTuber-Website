'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useAudioStore, type Track } from '@/stores/audioStore'
import { useModalStore } from '@/stores/modalStore'
import { cn } from '@/lib/utils'
import { formatDuration } from '@/lib/utils'
import { Play, Pause, Music, ExternalLink } from 'lucide-react'

export interface SongCardProps {
  id: string
  title: string
  trackType: 'cover' | 'original' | 'remix' | 'karaoke' | 'other'
  coverArt: string
  audioUrl?: string
  duration?: number
  originalArtist?: string
  streamingLinks?: { platform: string; url: string }[]
}

export function SongCard({
  id,
  title,
  trackType,
  coverArt,
  audioUrl,
  duration,
  originalArtist,
  streamingLinks,
}: SongCardProps) {
  const { currentTrack, isPlaying, setTrack, play, pause } = useAudioStore()
  const openModal = useModalStore((state) => state.openModal)

  const isCurrentTrack = currentTrack?.id === id
  const isCurrentlyPlaying = isCurrentTrack && isPlaying

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!audioUrl) return

    if (isCurrentTrack) {
      isPlaying ? pause() : play()
    } else {
      const track: Track = {
        id,
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

  const handleCardClick = () => {
    openModal('song', id, {
      title,
      trackType,
      coverArt,
      audioUrl,
      duration,
      originalArtist,
      streamingLinks,
    })
  }

  return (
    <motion.div
      onClick={handleCardClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'group cursor-pointer overflow-hidden rounded-xl bg-white/5 transition-colors hover:bg-white/10',
        isCurrentTrack && 'ring-2 ring-[var(--primary)]'
      )}
    >
      {/* Cover Art */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={coverArt}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          {audioUrl ? (
            <button
              onClick={handlePlayClick}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-110"
            >
              {isCurrentlyPlaying ? (
                <Pause className="h-6 w-6" fill="currentColor" />
              ) : (
                <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
              )}
            </button>
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white">
              <Music className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Type badge */}
        <div className="absolute left-2 top-2">
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
              trackType === 'original'
                ? 'bg-green-500/80 text-white'
                : trackType === 'cover' || trackType === 'karaoke'
                ? 'bg-blue-500/80 text-white'
                : trackType === 'remix'
                ? 'bg-purple-500/80 text-white'
                : 'bg-gray-500/80 text-white'
            )}
          >
            {trackType}
          </span>
        </div>

        {/* Currently playing indicator */}
        {isCurrentlyPlaying && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            <span className="flex gap-0.5">
              {[1, 2, 3].map((bar) => (
                <motion.span
                  key={bar}
                  className="w-1 rounded-full bg-[var(--primary)]"
                  animate={{
                    height: [4, 12, 4],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: bar * 0.1,
                  }}
                />
              ))}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="line-clamp-1 font-medium text-white">{title}</h3>
        {originalArtist && (
          <p className="line-clamp-1 text-sm text-white/60">
            Original: {originalArtist}
          </p>
        )}
        {duration && (
          <p className="mt-1 text-xs text-white/40">
            {formatDuration(duration)}
          </p>
        )}

        {/* Streaming links */}
        {streamingLinks && streamingLinks.length > 0 && (
          <div className="mt-2 flex gap-1">
            {streamingLinks.slice(0, 3).map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="rounded-full bg-white/10 p-1.5 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
