import { create } from 'zustand'
import type { LiveStream } from '@/constants/livestream'

export type { LiveStream }

interface LivestreamState {
  streams: LiveStream[]
  isChecking: boolean
  lastChecked: Date | null
  showAlert: boolean
  dismissedStreams: string[]

  // Actions
  setStreams: (streams: LiveStream[]) => void
  setIsChecking: (isChecking: boolean) => void
  setLastChecked: (date: Date) => void
  showAlertBanner: () => void
  hideAlertBanner: () => void
  dismissStream: (streamId: string) => void
  clearDismissed: () => void
}

export const useLivestreamStore = create<LivestreamState>((set, get) => ({
  streams: [],
  isChecking: false,
  lastChecked: null,
  showAlert: false,
  dismissedStreams: [],

  setStreams: (streams) => {
    const { dismissedStreams } = get()
    const activeStreams = streams.filter(s => !dismissedStreams.includes(s.channelId))
    set({
      streams,
      showAlert: activeStreams.length > 0
    })
  },

  setIsChecking: (isChecking) => set({ isChecking }),
  setLastChecked: (date) => set({ lastChecked: date }),

  showAlertBanner: () => set({ showAlert: true }),
  hideAlertBanner: () => set({ showAlert: false }),

  dismissStream: (streamId) => set((state) => ({
    dismissedStreams: [...state.dismissedStreams, streamId],
    showAlert: state.streams.filter(
      s => !state.dismissedStreams.includes(s.channelId) && s.channelId !== streamId
    ).length > 0
  })),

  clearDismissed: () => set({ dismissedStreams: [] }),
}))

// Helper to get the primary stream (highest priority owner stream, or highest priority friend)
export const getPrimaryStream = (streams: LiveStream[]): LiveStream | null => {
  const ownerStreams = streams.filter(s => s.isOwner).sort((a, b) => b.priority - a.priority)
  if (ownerStreams.length > 0) return ownerStreams[0]

  const friendStreams = streams.sort((a, b) => b.priority - a.priority)
  return friendStreams[0] || null
}
