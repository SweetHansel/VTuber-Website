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
  // Data
  profile: Profile | null
  themes: Theme | null
  models: Model[] | null
  artworks: Record<string, Artwork[] | null> // keyed by filter
  musicTracks: Record<string, MusicTrack[] | null> // keyed by filter

  // Loading states (per-resource)
  loading: {
    profile: boolean
    themes: boolean
    models: boolean
    artworks: Record<string, boolean>
    musicTracks: Record<string, boolean>
  }

  // Timestamps for cache invalidation
  timestamps: {
    profile: number
    themes: number
    models: number
    artworks: Record<string, number>
    musicTracks: Record<string, number>
  }

  // Actions
  fetchProfile: () => Promise<void>
  fetchThemes: () => Promise<void>
  fetchModels: () => Promise<void>
  fetchArtworks: (filter?: string) => Promise<void>
  fetchMusicTracks: (filter?: string) => Promise<void>

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
  artworks: {},
  musicTracks: {},

  loading: {
    profile: false,
    themes: false,
    models: false,
    artworks: {},
    musicTracks: {},
  },

  timestamps: {
    profile: 0,
    themes: 0,
    models: 0,
    artworks: {},
    musicTracks: {},
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

  fetchArtworks: async (filter = 'all') => {
    const state = get()
    const cacheKey = filter

    if (state.loading.artworks[cacheKey]) return
    if (state.artworks[cacheKey] && isCacheValid(state.timestamps.artworks[cacheKey] || 0)) return

    set((s) => ({
      loading: {
        ...s.loading,
        artworks: { ...s.loading.artworks, [cacheKey]: true },
      },
    }))

    try {
      const queryParam = filter && filter !== 'all' ? `?type=${filter}` : ''
      const response = await fetch(`/api/cms/artworks${queryParam}`)
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
      const result = await response.json()

      set((s) => ({
        artworks: { ...s.artworks, [cacheKey]: result.data as Artwork[] },
        loading: {
          ...s.loading,
          artworks: { ...s.loading.artworks, [cacheKey]: false },
        },
        timestamps: {
          ...s.timestamps,
          artworks: { ...s.timestamps.artworks, [cacheKey]: Date.now() },
        },
      }))
    } catch (error) {
      console.error('Failed to fetch artworks:', error)
      set((s) => ({
        loading: {
          ...s.loading,
          artworks: { ...s.loading.artworks, [cacheKey]: false },
        },
      }))
    }
  },

  fetchMusicTracks: async (filter = 'all') => {
    const state = get()
    const cacheKey = filter

    if (state.loading.musicTracks[cacheKey]) return
    if (state.musicTracks[cacheKey] && isCacheValid(state.timestamps.musicTracks[cacheKey] || 0)) return

    set((s) => ({
      loading: {
        ...s.loading,
        musicTracks: { ...s.loading.musicTracks, [cacheKey]: true },
      },
    }))

    try {
      const queryParam = filter && filter !== 'all' ? `?type=${filter}` : ''
      const response = await fetch(`/api/cms/music-tracks${queryParam}`)
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
      const result = await response.json()

      set((s) => ({
        musicTracks: { ...s.musicTracks, [cacheKey]: result.data as MusicTrack[] },
        loading: {
          ...s.loading,
          musicTracks: { ...s.loading.musicTracks, [cacheKey]: false },
        },
        timestamps: {
          ...s.timestamps,
          musicTracks: { ...s.timestamps.musicTracks, [cacheKey]: Date.now() },
        },
      }))
    } catch (error) {
      console.error('Failed to fetch music tracks:', error)
      set((s) => ({
        loading: {
          ...s.loading,
          musicTracks: { ...s.loading.musicTracks, [cacheKey]: false },
        },
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
      artworks: {},
      musicTracks: {},
      timestamps: {
        profile: 0,
        themes: 0,
        models: 0,
        artworks: {},
        musicTracks: {},
      },
    })
  },
}))
