'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { SongCard, type SongCardProps } from './SongCard'
import { useMusicTracks, type MusicTrack, getMedia } from '@/hooks/useCMS'
import { useAudioStore, type Track } from '@/stores/audioStore'

interface SongGridProps {
  filter?: 'all' | 'covers' | 'originals'
  skip?: boolean
}

function transformTrack(track: MusicTrack): SongCardProps {
  const coverArt = getMedia(track.coverArt)
  const audioFile = getMedia(track.audioFile)
  return {
    id: String(track.id),
    title: track.title,
    trackType: track.trackType,
    coverArt: coverArt?.url || '/placeholder-cover-1.jpg',
    audioUrl: audioFile?.url ?? undefined,
    duration: track.duration ?? undefined,
    originalArtist: track.originalArtist ?? undefined,
    streamingLinks: track.streamingLinks?.map(link => ({
      platform: link.platform,
      url: link.url,
    })),
  }
}

export function SongGrid({ filter = 'all', skip = false }: SongGridProps) {
  const { data: tracks, loading, error } = useMusicTracks(filter, { skip })
  const { currentTrack, setTrack } = useAudioStore()
  const hasAutoSelected = useRef(false)

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

  // Auto-select a random track if no music is playing
  useEffect(() => {
    if (hasAutoSelected.current || currentTrack || loading || skip || filteredSongs.length === 0) return

    // Find songs with audio URLs
    const playableSongs = filteredSongs.filter(song => song.audioUrl)
    if (playableSongs.length === 0) return

    // Select a random song
    const randomIndex = Math.floor(Math.random() * playableSongs.length)
    const randomSong = playableSongs[randomIndex]

    const track: Track = {
      id: randomSong.id,
      title: randomSong.title,
      coverArt: randomSong.coverArt,
      audioUrl: randomSong.audioUrl!,
      duration: randomSong.duration || 0,
      artist: randomSong.originalArtist,
    }

    setTrack(track)
    hasAutoSelected.current = true
  }, [loading, skip, filteredSongs, currentTrack, setTrack])

  // Only show loading on first load (no cached data yet)
  if (!tracks && loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-(--page-text)/40" />
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
        <div className="col-span-full py-12 text-center text-(--page-text)/40">
          No songs found
        </div>
      )}
    </div>
  )
}
