// Artwork type constants - single source of truth
// Used in: Artworks collection, MasonryGallery, useCMS, seed route

/**
 * Artwork types as defined in the Artworks collection
 */
export const ARTWORK_TYPES = ['fanart', 'official', 'commissioned', 'other'] as const

export type ArtworkType = typeof ARTWORK_TYPES[number]

/**
 * Filter options for the gallery UI
 * Note: 'all' shows everything, individual types filter by artworkType
 */
export const ARTWORK_FILTER_OPTIONS = ['all', 'fanart', 'official', 'commissioned'] as const

export type ArtworkFilter = typeof ARTWORK_FILTER_OPTIONS[number]

/**
 * Color classes for artwork type badges in the gallery
 */
export const ARTWORK_TYPE_COLORS: Record<ArtworkType, string> = {
  official: 'bg-blue-500/80 text-white',
  fanart: 'bg-cyan-500/80 text-white',
  commissioned: 'bg-purple-500/80 text-white',
  other: 'bg-gray-500/80 text-white',
}
