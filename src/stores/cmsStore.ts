import { create } from 'zustand'
import { CACHE_DURATION_MS } from '@/constants/config'

import type {
  Profile,
  Theme,
  Model,
  Artwork,
  MusicTrack,
} from '@/payload-types'

interface CMSStore {
  // Data - single cache for all items
  profile: Profile | null
  themes: Theme | null
  models: Model[] | null
  artworks: Artwork[] | null
  musicTracks: MusicTrack[] | null

  // Loading states
  loading: {
    profile: boolean
    themes: boolean
    models: boolean
    artworks: boolean
    musicTracks: boolean
  }

  // Timestamps for cache invalidation
  timestamps: {
    profile: number
    themes: number
    models: number
    artworks: number
    musicTracks: number
  }

  // Actions
  fetchProfile: () => Promise<void>
  fetchThemes: () => Promise<void>
  fetchModels: () => Promise<void>
  fetchArtworks: () => Promise<void>
  fetchMusicTracks: () => Promise<void>

  // Prefetch critical data
  prefetchCritical: () => Promise<void>

  // Clear cache
  clearCache: () => void
}

// Helper to check if cache is still valid
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION_MS
}

export const useCMSStore = create<CMSStore>((set, get) => ({
  // Initial state
  profile: null,
  themes: null,
  models: null,
  artworks: null,
  musicTracks: null,

  loading: {
    profile: false,
    themes: false,
    models: false,
    artworks: false,
    musicTracks: false,
  },

  timestamps: {
    profile: 0,
    themes: 0,
    models: 0,
    artworks: 0,
    musicTracks: 0,
  },

  fetchProfile: async () => {
    const state = get()

    // Skip if already loading or cache is valid
    if (state.loading.profile) return
    if (state.profile && isCacheValid(state.timestamps.profile)) return

    set((s) => ({
      loading: { ...s.loading, profile: true },
    }))

    try {
      const response = await fetch('/api/cms/profile')
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
      const result = await response.json()

      set((s) => ({
        profile: result.data as Profile,
        loading: { ...s.loading, profile: false },
        timestamps: { ...s.timestamps, profile: Date.now() },
      }))
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      set((s) => ({
        loading: { ...s.loading, profile: false },
      }))
    }
  },

  fetchThemes: async () => {
    const state = get()

    if (state.loading.themes) return
    if (state.themes && isCacheValid(state.timestamps.themes)) return

    set((s) => ({
      loading: { ...s.loading, themes: true },
    }))

    try {
      const response = await fetch('/api/cms/themes')
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
      const result = await response.json()

      set((s) => ({
        themes: result.data as Theme,
        loading: { ...s.loading, themes: false },
        timestamps: { ...s.timestamps, themes: Date.now() },
      }))
    } catch (error) {
      console.error('Failed to fetch themes:', error)
      set((s) => ({
        loading: { ...s.loading, themes: false },
      }))
    }
  },

  fetchModels: async () => {
    const state = get()

    if (state.loading.models) return
    if (state.models && isCacheValid(state.timestamps.models)) return

    set((s) => ({
      loading: { ...s.loading, models: true },
    }))

    try {
      const response = await fetch('/api/cms/models')
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
      const result = await response.json()

      set((s) => ({
        models: result.data as Model[],
        loading: { ...s.loading, models: false },
        timestamps: { ...s.timestamps, models: Date.now() },
      }))
    } catch (error) {
      console.error('Failed to fetch models:', error)
      set((s) => ({
        loading: { ...s.loading, models: false },
      }))
    }
  },

  fetchArtworks: async () => {
    const state = get()

    if (state.loading.artworks) return
    if (state.artworks && isCacheValid(state.timestamps.artworks)) return

    set((s) => ({
      loading: { ...s.loading, artworks: true },
    }))

    try {
      const response = await fetch('/api/cms/artworks')
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
      const result = await response.json()

      set((s) => ({
        artworks: result.data as Artwork[],
        loading: { ...s.loading, artworks: false },
        timestamps: { ...s.timestamps, artworks: Date.now() },
      }))
    } catch (error) {
      console.error('Failed to fetch artworks:', error)
      set((s) => ({
        loading: { ...s.loading, artworks: false },
      }))
    }
  },

  fetchMusicTracks: async () => {
    const state = get()

    if (state.loading.musicTracks) return
    if (state.musicTracks && isCacheValid(state.timestamps.musicTracks)) return

    set((s) => ({
      loading: { ...s.loading, musicTracks: true },
    }))

    try {
      const response = await fetch('/api/cms/music-tracks')
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
      const result = await response.json()

      set((s) => ({
        musicTracks: result.data as MusicTrack[],
        loading: { ...s.loading, musicTracks: false },
        timestamps: { ...s.timestamps, musicTracks: Date.now() },
      }))
    } catch (error) {
      console.error('Failed to fetch music tracks:', error)
      set((s) => ({
        loading: { ...s.loading, musicTracks: false },
      }))
    }
  },

  prefetchCritical: async () => {
    const { fetchThemes, fetchProfile } = get()
    // Fetch themes and profile in parallel
    await Promise.all([fetchThemes(), fetchProfile()])
  },

  clearCache: () => {
    set({
      profile: null,
      themes: null,
      models: null,
      artworks: null,
      musicTracks: null,
      timestamps: {
        profile: 0,
        themes: 0,
        models: 0,
        artworks: 0,
        musicTracks: 0,
      },
    })
  },
}))
