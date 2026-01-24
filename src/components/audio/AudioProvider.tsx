'use client'

import { useEffect, useRef } from 'react'
import { useAudioStore } from '@/stores/audioStore'

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const {
    currentTrack,
    isPlaying,
    volume,
    // playbackPosition,
    setPlaybackPosition,
    setDuration,
    playNext,
  } = useAudioStore()

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.preload = 'metadata'
    }

    const audio = audioRef.current

    // Event handlers
    const handleTimeUpdate = () => {
      setPlaybackPosition(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      playNext()
    }

    const handleError = (e: Event) => {
      console.error('Audio error:', e)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [setPlaybackPosition, setDuration, playNext])

  // Handle track changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return

    const audio = audioRef.current

    if (audio.src !== currentTrack.audioUrl) {
      audio.src = currentTrack.audioUrl
      audio.load()
    }
  }, [currentTrack])

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return

    const audio = audioRef.current

    if (isPlaying) {
      audio.play().catch((e) => {
        console.error('Failed to play:', e)
      })
    } else {
      audio.pause()
    }
  }, [isPlaying])

  // Handle volume changes
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = volume
  }, [volume])

  // Expose seek function
  useEffect(() => {
    const handleSeek = (e: CustomEvent<number>) => {
      if (!audioRef.current) return
      audioRef.current.currentTime = e.detail
    }

    window.addEventListener('audio-seek', handleSeek as EventListener)
    return () => {
      window.removeEventListener('audio-seek', handleSeek as EventListener)
    }
  }, [])

  return <>{children}</>
}

// Utility function to seek (can be called from anywhere)
export function seekAudio(time: number) {
  window.dispatchEvent(new CustomEvent('audio-seek', { detail: time }))
}
