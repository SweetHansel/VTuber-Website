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
  isExpanded: boolean

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
  setExpanded: (expanded: boolean) => void
  collapse: () => void
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  playbackPosition: 0,
  duration: 0,
  queue: [],
  queueIndex: -1,
  isExpanded: false,

  setTrack: (track) => {
    const { queue } = get()
    const existingIndex = queue.findIndex(t => t.id === track.id)

    if (existingIndex >= 0) {
      set({ currentTrack: track, queueIndex: existingIndex, playbackPosition: 0, isExpanded: true })
    } else {
      set({
        currentTrack: track,
        queue: [...queue, track],
        queueIndex: queue.length,
        playbackPosition: 0,
        isExpanded: true,
      })
    }
  },

  play: () => set({ isPlaying: true, isExpanded: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying, isExpanded: true })),

  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  setPlaybackPosition: (position) => set({ playbackPosition: position }),
  setDuration: (duration) => set({ duration }),

  addToQueue: (track) => set((state) => ({
    queue: [...state.queue, track],
    isExpanded: true,
  })),

  removeFromQueue: (index) => set((state) => {
    const newQueue = [...state.queue]
    newQueue.splice(index, 1)
    return {
      queue: newQueue,
      queueIndex: state.queueIndex > index ? state.queueIndex - 1 : state.queueIndex
    }
  }),

  clearQueue: () => set({ queue: [], queueIndex: -1, currentTrack: null, isExpanded: false }),

  playNext: () => {
    const { queue, queueIndex } = get()
    if (queueIndex < queue.length - 1) {
      const nextTrack = queue[queueIndex + 1]
      set({
        currentTrack: nextTrack,
        queueIndex: queueIndex + 1,
        playbackPosition: 0,
        isPlaying: true,
        isExpanded: true,
      })
    }
  },

  playPrevious: () => {
    const { queue, queueIndex, playbackPosition } = get()
    if (playbackPosition > 3) {
      set({ playbackPosition: 0, isExpanded: true })
    } else if (queueIndex > 0) {
      const prevTrack = queue[queueIndex - 1]
      set({
        currentTrack: prevTrack,
        queueIndex: queueIndex - 1,
        playbackPosition: 0,
        isPlaying: true,
        isExpanded: true,
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
        isPlaying: true,
        isExpanded: true,
      })
    }
  },

  setExpanded: (expanded) => set({ isExpanded: expanded }),
  collapse: () => set({ isExpanded: false }),
}))
