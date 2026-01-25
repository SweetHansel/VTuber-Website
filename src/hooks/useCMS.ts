'use client'

import { useState, useEffect, useCallback } from 'react'

// Generic fetch hook with caching
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_DURATION = 60000 // 1 minute

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
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
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

// Profile hook
export interface ProfileData {
  name?: string
  japaneseName?: string
  tagline?: string
  avatar?: { url?: string }
  shortBio?: string
  birthday?: string
  height?: string
  traits?: Array<{
    category: string
    icon?: string
    color?: string
    items?: Array<{ value: string }>
  }>
  hashtags?: {
    general?: string
    fanart?: string
    stream?: string
    fanName?: string
  }
  socialLinks?: Array<{
    platform: string
    url: string
    label?: string
  }>
}

export function useProfile() {
  return useFetch<ProfileData>('/api/cms/profile')
}

// Music tracks hook
export interface MusicTrack {
  id: string
  title: string
  trackType: 'cover' | 'original' | 'remix' | 'karaoke'
  coverArt?: { url?: string }
  audioFile?: { url?: string }
  duration?: number
  originalArtist?: string
  streamingLinks?: Array<{
    platform: string
    url: string
  }>
  releaseDate?: string
}

export function useMusicTracks(filter?: 'all' | 'covers' | 'originals') {
  const queryParam = filter && filter !== 'all' ? `?type=${filter}` : ''
  return useFetch<MusicTrack[]>(`/api/cms/music-tracks${queryParam}`)
}

// Artworks hook
export interface Artwork {
  id: string
  title?: string
  image?: { url?: string }
  artworkType: 'fanart' | 'official' | 'commissioned' | 'other'
  credits?: Array<{
    role: string
    person?: { name?: string }
    name?: string
  }>
  sourceUrl?: string
  isFeatured?: boolean
}

export function useArtworks(filter?: 'all' | 'fanart' | 'official' | 'meme') {
  const queryParam = filter && filter !== 'all' ? `?type=${filter}` : ''
  return useFetch<Artwork[]>(`/api/cms/artworks${queryParam}`)
}

// Updates hook (announcements + blog posts)
export interface UpdateItem {
  id: string
  type: 'announcement' | 'blog-post'
  title: string
  excerpt?: string
  image?: string
  date?: string
  eventDate?: string
  location?: string
  announcementType?: string
  isPinned?: boolean
  externalLink?: string
}

export function useUpdates(filter?: 'all' | 'announcements' | 'blogs') {
  const queryParam = filter && filter !== 'all' ? `?filter=${filter}` : ''
  return useFetch<UpdateItem[]>(`/api/cms/updates${queryParam}`)
}

// Models hook
export interface Live2DModel {
  id: string
  name: string
  version?: string
  thumbnail?: { url?: string }
  isActive?: boolean
  debutDate?: string
}

export interface ThreeDModel {
  id: string
  name: string
  modelType?: string
  thumbnail?: { url?: string }
  isActive?: boolean
  technicalSpecs?: {
    polyCount?: number
    blendshapes?: number
  }
}

export interface ModelsData {
  live2d: Live2DModel[]
  '3d': ThreeDModel[]
}

export function useModels(type?: 'live2d' | '3d') {
  const queryParam = type ? `?type=${type}` : ''
  return useFetch<ModelsData>(`/api/cms/models${queryParam}`)
}

// Interactive media hook
export interface InteractiveMediaData {
  id: string
  name: string
  location: string
  defaultState: {
    media?: { url?: string }
    alt?: string
    sound?: { url?: string }
  }
  hoverState?: {
    enabled?: boolean
    media?: { url?: string }
    alt?: string
    sound?: { url?: string }
  }
  clickState?: {
    enabled?: boolean
    media?: { url?: string }
    alt?: string
    sound?: { url?: string }
  }
  cursorEffect?: {
    enabled?: boolean
    media?: { url?: string }
    duration?: number
    size?: number
  }
  depth?: number
}

export function useInteractiveMedia(location?: string) {
  const url = location
    ? `/api/cms/interactive-media?location=${encodeURIComponent(location)}`
    : '/api/cms/interactive-media'
  return useFetch<InteractiveMediaData | InteractiveMediaData[]>(url, { skip: !location && false })
}

// Themes hook
export interface ThemesData {
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  interactiveMedia?: Array<{
    slot: string
    configuration?: InteractiveMediaData
  }>
}

export function useThemes() {
  return useFetch<ThemesData>('/api/cms/themes')
}

// Helper to clear cache (useful for admin refresh)
export function clearCMSCache() {
  cache.clear()
}
