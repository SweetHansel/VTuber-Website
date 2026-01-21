import { create } from 'zustand'

export interface Track {
  id: string
  title: string
  artist?: string
  coverArt: string
  audioUrl: string
  duration: number
}

interface AudioState {
  currentTrack: Track | null
  isPlaying: boolean
  volume: number
  playbackPosition: number
  duration: number
  queue: Track[]
  queueIndex: number

  // Actions
  setTrack: (track: Track) => void
  play: () => void
  pause: () => void
  togglePlay: () => void
  setVolume: (volume: number) => void
  setPlaybackPosition: (position: number) => void
  setDuration: (duration: number) => void
  addToQueue: (track: Track) => void
  removeFromQueue: (index: number) => void
  clearQueue: () => void
  playNext: () => void
  playPrevious: () => void
  playTrackAt: (index: number) => void
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  playbackPosition: 0,
  duration: 0,
  queue: [],
  queueIndex: -1,

  setTrack: (track) => {
    const { queue } = get()
    const existingIndex = queue.findIndex(t => t.id === track.id)

    if (existingIndex >= 0) {
      set({ currentTrack: track, queueIndex: existingIndex, playbackPosition: 0 })
    } else {
      set({
        currentTrack: track,
        queue: [...queue, track],
        queueIndex: queue.length,
        playbackPosition: 0
      })
    }
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  setPlaybackPosition: (position) => set({ playbackPosition: position }),
  setDuration: (duration) => set({ duration }),

  addToQueue: (track) => set((state) => ({
    queue: [...state.queue, track]
  })),

  removeFromQueue: (index) => set((state) => {
    const newQueue = [...state.queue]
    newQueue.splice(index, 1)
    return {
      queue: newQueue,
      queueIndex: state.queueIndex > index ? state.queueIndex - 1 : state.queueIndex
    }
  }),

  clearQueue: () => set({ queue: [], queueIndex: -1, currentTrack: null }),

  playNext: () => {
    const { queue, queueIndex } = get()
    if (queueIndex < queue.length - 1) {
      const nextTrack = queue[queueIndex + 1]
      set({
        currentTrack: nextTrack,
        queueIndex: queueIndex + 1,
        playbackPosition: 0,
        isPlaying: true
      })
    }
  },

  playPrevious: () => {
    const { queue, queueIndex, playbackPosition } = get()
    if (playbackPosition > 3) {
      set({ playbackPosition: 0 })
    } else if (queueIndex > 0) {
      const prevTrack = queue[queueIndex - 1]
      set({
        currentTrack: prevTrack,
        queueIndex: queueIndex - 1,
        playbackPosition: 0,
        isPlaying: true
      })
    }
  },

  playTrackAt: (index) => {
    const { queue } = get()
    if (index >= 0 && index < queue.length) {
      set({
        currentTrack: queue[index],
        queueIndex: index,
        playbackPosition: 0,
        isPlaying: true
      })
    }
  },
}))
