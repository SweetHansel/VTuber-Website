'use client'

import { useMemo, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { SongCard } from './SongCard'
import { type MusicTrack, getMedia } from '@/hooks/useCMS'
import { useAudioStore, type Track } from '@/stores/audioStore'

type MusicFilter = 'all' | 'covers' | 'originals'

interface SongGridProps {
  tracks: MusicTrack[]
  filter?: MusicFilter
}

export function SongGrid({
  tracks,
  filter = 'all',
}: Readonly<SongGridProps>) {
  const { currentTrack, setTrack } = useAudioStore()
  const hasAutoSelected = useRef(false)

  // Client-side filtering
  const filteredTracks = useMemo(() => {
    if (filter === 'all') return tracks
    if (filter === 'covers') return tracks.filter(t => t.trackType === 'cover')
    if (filter === 'originals') return tracks.filter(t => t.trackType === 'original' || t.trackType === 'remix')
    return tracks
  }, [tracks, filter])

  // Auto-select a random track if no music is playing
  useEffect(() => {
    if (hasAutoSelected.current || currentTrack || filteredTracks.length === 0) return

    // Find tracks with audio files
    const playableTracks = filteredTracks.filter(t => {
      const audioFile = getMedia(t.audioFile)
      return !!audioFile?.url
    })
    if (playableTracks.length === 0) return

    // Select a random track
    const randomIndex = Math.floor(Math.random() * playableTracks.length)
    const randomTrack = playableTracks[randomIndex]
    const coverArt = getMedia(randomTrack.coverArt)
    const audioFile = getMedia(randomTrack.audioFile)

    const track: Track = {
      id: String(randomTrack.id),
      title: randomTrack.title,
      coverArt: coverArt?.url || '/placeholder-cover-1.jpg',
      audioUrl: audioFile!.url!,
      duration: randomTrack.duration || 0,
      artist: randomTrack.originalArtist ?? undefined,
    }

    setTrack(track)
    hasAutoSelected.current = true
  }, [filteredTracks, currentTrack, setTrack])

  return (
    <div className="grid gap-4 grid-cols-4">
      {Array(5).fill(filteredTracks).flat().map((track, index) => (
        <motion.div
          key={index +"_"+track.id}
        >
          <SongCard track={track} />
        </motion.div>
      ))}

      {filteredTracks.length === 0 && (
        <div className="col-span-full py-12 text-center text-(--page-text)/40">
          No songs found
        </div>
      )}
    </div>
  )
}
