// Artwork type constants
// Used in: Artworks collection, MasonryGallery, useCMS, seed route

import type { Artwork } from '@/payload-types'

export type ArtworkType = Artwork['artworkType']

/**
 * Filter options for the gallery UI
 * Note: 'all' shows everything, individual types filter by artworkType
 */
export const ARTWORK_FILTER_OPTIONS = ['all', 'fanart', 'official', 'commissioned'] as const

export type ArtworkFilter = typeof ARTWORK_FILTER_OPTIONS[number]

/**
 * Color classes for artwork type badges
 */
export const ARTWORK_TYPE_COLORS: Record<ArtworkType, string> = {
  official: 'bg-blue-500 text-white',
  fanart: 'bg-cyan-500 text-white',
  commissioned: 'bg-purple-500 text-white',
  other: 'bg-gray-500 text-white',
}
