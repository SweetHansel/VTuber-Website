'use client'

import { useState, useEffect, useCallback } from 'react'
import { CACHE_DURATION_MS } from '@/constants/config'
import { useCMSStore } from '@/stores/cmsStore'

// Import types from payload-types.ts (single source of truth)
import type {
  Tag,
  Social,
  Person,
  Model,
  MusicTrack,
  Album,
  Artwork,
  Post,
  Video,
  Media,
  InteractiveMedia,
  Profile,
  Theme,
  SiteSetting,
  LivestreamSetting,
} from '@/payload-types'

// Re-export types for consumers
export type {
  Tag,
  Social,
  Person,
  Model,
  MusicTrack,
  Album,
  Artwork,
  Post,
  Video,
  Media,
  InteractiveMedia,
  Profile,
  Theme,
  SiteSetting,
  LivestreamSetting,
}

// ============================================
// Type Helpers for Payload Union Types
// ============================================
// Payload generates union types like `number | Media` for relations.
// When fetching with depth > 0, we get objects, but TypeScript doesn't know that.

/**
 * Extract Media object from Payload union type
 * Returns undefined if the value is a number (unpopulated ID) or null/undefined
 */
export function getMedia(media: number | Media | null | undefined): Media | undefined {
  if (!media || typeof media === 'number') return undefined
  return media
}

/**
 * Extract Person object from Payload union type
 */
export function getPerson(person: number | Person | null | undefined): Person | undefined {
  if (!person || typeof person === 'number') return undefined
  return person
}

/**
 * Extract Model object from Payload union type
 */
export function getModel(model: number | Model | null | undefined): Model | undefined {
  if (!model || typeof model === 'number') return undefined
  return model
}

/**
 * Extract Tag object from Payload union type
 */
export function getTag(tag: number | Tag | null | undefined): Tag | undefined {
  if (!tag || typeof tag === 'number') return undefined
  return tag
}

/**
 * Extract Album object from Payload union type
 */
export function getAlbum(album: number | Album | null | undefined): Album | undefined {
  if (!album || typeof album === 'number') return undefined
  return album
}

/**
 * Extract Social object from Payload union type
 */
export function getSocial(social: number | Social | null | undefined): Social | undefined {
  if (!social || typeof social === 'number') return undefined
  return social
}

/**
 * Convert null to undefined (Payload uses null, but many React patterns prefer undefined)
 */
export function nullToUndefined<T>(value: T | null | undefined): T | undefined {
  return value ?? undefined
}

// Generic fetch hook with caching (for hooks not using Zustand store)
const cache = new Map<string, { data: unknown; timestamp: number }>()

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

interface UseFetchOptions {
  skip?: boolean
}

function useFetch<T>(url: string, options?: UseFetchOptions): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(!options?.skip)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    if (options?.skip) return

    // Check cache
    const cached = cache.get(url)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
      setData(cached.data as T)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      const result = await response.json()
      const fetchedData = result.data as T

      // Update cache
      cache.set(url, { data: fetchedData, timestamp: Date.now() })

      setData(fetchedData)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [url, options?.skip])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// Types are already imported and re-exported at the top of this file

// ============================================
// Collection Hooks (Using Zustand Store)
// ============================================

interface UseHookOptions {
  skip?: boolean
}

export function useTags() {
  return useFetch<Tag[]>('/api/cms/tags')
}

export function usePeople() {
  return useFetch<Person[]>('/api/cms/people')
}

export function useModels(type?: '2d' | '3d', options?: UseHookOptions) {
  const models = useCMSStore((s) => s.models)
  const loading = useCMSStore((s) => s.loading.models)
  const fetchModels = useCMSStore((s) => s.fetchModels)

  useEffect(() => {
    if (options?.skip) return
    if (!models && !loading) {
      fetchModels()
    }
  }, [models, loading, fetchModels, options?.skip])

  // Filter by type if specified (client-side filtering)
  const filteredModels = models
    ? type
      ? models.filter((m) => {
          if (type === '2d') return ['live2d', 'png', 'other-2d'].includes(m.modelType)
          if (type === '3d') return ['vrm', 'vsfavatar', 'mmd', 'other-3d'].includes(m.modelType)
          return true
        })
      : models
    : null

  return {
    data: filteredModels,
    loading: options?.skip ? false : loading,
    error: null,
    refetch: fetchModels,
  }
}

/**
 * Fetch all music tracks. Returns all data - filter client-side with useMemo.
 */
export function useMusicTracks(options?: UseHookOptions) {
  const musicTracks = useCMSStore((s) => s.musicTracks)
  const loading = useCMSStore((s) => s.loading.musicTracks)
  const fetchMusicTracks = useCMSStore((s) => s.fetchMusicTracks)

  useEffect(() => {
    if (options?.skip) return
    if (!musicTracks && !loading) {
      fetchMusicTracks()
    }
  }, [musicTracks, loading, fetchMusicTracks, options?.skip])

  return {
    data: musicTracks,
    loading: options?.skip ? false : loading,
    error: null,
    refetch: fetchMusicTracks,
  }
}

export function useAlbums() {
  return useFetch<Album[]>('/api/cms/albums')
}

/**
 * Fetch all artworks. Returns all data - filter client-side with useMemo.
 */
export function useArtworks(options?: UseHookOptions) {
  const artworks = useCMSStore((s) => s.artworks)
  const loading = useCMSStore((s) => s.loading.artworks)
  const fetchArtworks = useCMSStore((s) => s.fetchArtworks)

  useEffect(() => {
    if (options?.skip) return
    if (!artworks && !loading) {
      fetchArtworks()
    }
  }, [artworks, loading, fetchArtworks, options?.skip])

  return {
    data: artworks,
    loading: options?.skip ? false : loading,
    error: null,
    refetch: fetchArtworks,
  }
}

export function usePosts(options?: {
  status?: 'all' | 'published' | 'draft'
  postType?: 'blog' | 'stream' | 'event' | 'release' | 'collab' | 'general'
}) {
  const params = new URLSearchParams()
  if (options?.status) params.set('status', options.status)
  if (options?.postType) params.set('postType', options.postType)
  const queryString = params.toString()
  const url = queryString ? `/api/cms/posts?${queryString}` : '/api/cms/posts'
  return useFetch<Post[]>(url)
}

export function useVideos(type?: 'all' | 'music-video' | 'stream-archive' | 'clip' | 'short') {
  const queryParam = type && type !== 'all' ? `?type=${type}` : ''
  return useFetch<Video[]>(`/api/cms/videos${queryParam}`)
}

export function useInteractiveMedia(location?: string) {
  const url = location
    ? `/api/cms/interactive-media?location=${encodeURIComponent(location)}`
    : '/api/cms/interactive-media'
  return useFetch<InteractiveMedia | InteractiveMedia[]>(url, { skip: !location && false })
}

// ============================================
// Global Hooks (Using Zustand Store)
// ============================================

export function useProfile(options?: UseHookOptions) {
  const profile = useCMSStore((s) => s.profile)
  const loading = useCMSStore((s) => s.loading.profile)
  const fetchProfile = useCMSStore((s) => s.fetchProfile)

  useEffect(() => {
    if (options?.skip) return
    if (!profile && !loading) {
      fetchProfile()
    }
  }, [profile, loading, fetchProfile, options?.skip])

  return {
    data: profile,
    loading: options?.skip ? false : loading,
    error: null,
    refetch: fetchProfile,
  }
}

export function useThemes(options?: UseHookOptions) {
  const themes = useCMSStore((s) => s.themes)
  const loading = useCMSStore((s) => s.loading.themes)
  const fetchThemes = useCMSStore((s) => s.fetchThemes)

  useEffect(() => {
    if (options?.skip) return
    if (!themes && !loading) {
      fetchThemes()
    }
  }, [themes, loading, fetchThemes, options?.skip])

  return {
    data: themes,
    loading: options?.skip ? false : loading,
    error: null,
    refetch: fetchThemes,
  }
}

// ============================================
// Cache Utilities
// ============================================

export function clearCMSCache() {
  cache.clear()
  useCMSStore.getState().clearCache()
}
