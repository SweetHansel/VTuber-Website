'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { SongCard, type SongCardProps } from './SongCard'
import { useMusicTracks, type MusicTrack } from '@/hooks/useCMS'

interface SongGridProps {
  filter?: 'all' | 'covers' | 'originals'
}

function transformTrack(track: MusicTrack): SongCardProps {
  return {
    id: track.id,
    title: track.title,
    trackType: track.trackType === 'karaoke' ? 'cover' : track.trackType,
    coverArt: track.coverArt?.url || '/placeholder-cover-1.jpg',
    audioUrl: track.audioFile?.url,
    duration: track.duration,
    originalArtist: track.originalArtist,
    streamingLinks: track.streamingLinks,
  }
}

export function SongGrid({ filter = 'all' }: SongGridProps) {
  const { data: tracks, loading, error } = useMusicTracks(filter)

  // Use CMS data if available, otherwise use mock data
  const songs: SongCardProps[] = tracks && tracks.length > 0
    ? tracks.map(transformTrack)
    : []

  // Apply filter for fallback data (CMS data is already filtered)
  const filteredSongs = tracks && tracks.length > 0
    ? songs
    : songs.filter((song) => {
        if (filter === 'all') return true
        if (filter === 'covers') return song.trackType === 'cover'
        if (filter === 'originals') return song.trackType === 'original' || song.trackType === 'remix'
        return true
      })

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/40" />
      </div>
    )
  }

  if (error) {
    console.warn('Failed to fetch music tracks, using fallback data:', error)
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {filteredSongs.map((song, index) => (
        <motion.div
          key={song.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <SongCard {...song} />
        </motion.div>
      ))}

      {filteredSongs.length === 0 && (
        <div className="col-span-full py-12 text-center text-white/40">
          No songs found
        </div>
      )}
    </div>
  )
}
