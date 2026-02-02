'use client'

import { useState, useEffect, useCallback } from 'react'
import { CACHE_DURATION_MS } from '@/constants/config'

// Import types from payload-types.ts (single source of truth)
import type {
  Tag,
  Social,
  Person,
  Model,
  MusicTrack,
  Album,
  Artwork,
  Announcement,
  BlogPost,
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
  Announcement,
  BlogPost,
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
export function getModel(model: number | Model | null | undefined): Model | null {
  if (!model || typeof model === 'number') return null
  return model
}

/**
 * Convert null to undefined (Payload uses null, but many React patterns prefer undefined)
 */
export function nullToUndefined<T>(value: T | null | undefined): T | undefined {
  return value ?? undefined
}

// Generic fetch hook with caching
const cache = new Map<string, { data: unknown; timestamp: number }>()

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

function useFetch<T>(url: string, options?: { skip?: boolean }): UseFetchResult<T> {
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
// Collection Hooks
// ============================================

export function useTags() {
  return useFetch<Tag[]>('/api/cms/tags')
}

export function usePeople() {
  return useFetch<Person[]>('/api/cms/people')
}

export function useModels(type?: '2d' | '3d') {
  const queryParam = type ? `?type=${type}` : ''
  return useFetch<Model[]>(`/api/cms/models${queryParam}`)
}

export function useMusicTracks(filter?: 'all' | 'covers' | 'originals') {
  const queryParam = filter && filter !== 'all' ? `?type=${filter}` : ''
  return useFetch<MusicTrack[]>(`/api/cms/music-tracks${queryParam}`)
}

export function useAlbums() {
  return useFetch<Album[]>('/api/cms/albums')
}

export function useArtworks(filter?: 'all' | 'fanart' | 'official' | 'commissioned') {
  const queryParam = filter && filter !== 'all' ? `?type=${filter}` : ''
  return useFetch<Artwork[]>(`/api/cms/artworks${queryParam}`)
}

export function useAnnouncements() {
  return useFetch<Announcement[]>('/api/cms/announcements')
}

export function useBlogPosts(status?: 'all' | 'published' | 'draft') {
  const queryParam = status && status !== 'all' ? `?status=${status}` : ''
  return useFetch<BlogPost[]>(`/api/cms/blog-posts${queryParam}`)
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
// Global Hooks
// ============================================

export function useProfile() {
  return useFetch<Profile>('/api/cms/profile')
}

export function useThemes() {
  return useFetch<Theme>('/api/cms/themes')
}

// ============================================
// Combined/Transformed Types (for API endpoints that transform data)
// ============================================

// Re-export UpdateItem from constants (single source of truth)
export type { UpdateItem } from '@/constants/content'
import type { UpdateItem } from '@/constants/content'

export function useUpdates(filter?: 'all' | 'announcements' | 'blogs') {
  const queryParam = filter && filter !== 'all' ? `?filter=${filter}` : ''
  return useFetch<UpdateItem[]>(`/api/cms/updates${queryParam}`)
}

// ============================================
// Cache Utilities
// ============================================

export function clearCMSCache() {
  cache.clear()
}
