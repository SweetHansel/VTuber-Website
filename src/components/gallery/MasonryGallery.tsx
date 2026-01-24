'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Loader2, ExternalLink } from 'lucide-react'
import { useModalStore } from '@/stores/modalStore'
import { useArtworks, type Artwork as CMSArtwork } from '@/hooks/useCMS'
import { cn } from '@/lib/utils'

interface Artwork {
  id: string
  title?: string
  image: string
  artworkType: 'fanart' | 'official' | 'meme' | 'commissioned' | 'other'
  artistName?: string
  sourceUrl?: string
  isFeatured?: boolean
}

// Fallback mock data
const mockArtworks: Artwork[] = [
  {
    id: '1',
    image: '/placeholder-art-1.jpg',
    artworkType: 'fanart',
    artistName: '@artist1',
    sourceUrl: 'https://twitter.com/artist1',
  },
  {
    id: '2',
    image: '/placeholder-art-2.jpg',
    artworkType: 'official',
    title: 'Official Key Visual',
    isFeatured: true,
  },
  {
    id: '3',
    image: '/placeholder-art-3.jpg',
    artworkType: 'fanart',
    artistName: '@artist2',
  },
  {
    id: '4',
    image: '/placeholder-art-4.jpg',
    artworkType: 'meme',
    title: 'Funny moment',
  },
  {
    id: '5',
    image: '/placeholder-art-5.jpg',
    artworkType: 'fanart',
    artistName: '@artist3',
  },
  {
    id: '6',
    image: '/placeholder-art-6.jpg',
    artworkType: 'official',
    title: 'Anniversary Art',
  },
]

function transformArtwork(art: CMSArtwork): Artwork {
  // Get artist name from credits array
  const artistCredit = art.credits?.find(c => c.role === 'artist' || c.role === 'illustrator')
  const artistName = artistCredit?.person?.name || artistCredit?.name

  return {
    id: art.id,
    title: art.title,
    image: art.image?.url || '/placeholder-art-1.jpg',
    artworkType: art.artworkType === 'other' ? 'other' : art.artworkType,
    artistName: artistName ? `@${artistName.replace('@', '')}` : undefined,
    sourceUrl: art.sourceUrl,
    isFeatured: art.isFeatured,
  }
}

interface MasonryGalleryProps {
  filter?: 'all' | 'fanart' | 'official' | 'meme'
}

export function MasonryGallery({ filter = 'all' }: MasonryGalleryProps) {
  const openModal = useModalStore((state) => state.openModal)
  const { data: cmsArtworks, loading, error } = useArtworks(filter)

  // Transform CMS data or use fallback
  const artworks: Artwork[] = cmsArtworks && cmsArtworks.length > 0
    ? cmsArtworks.map(transformArtwork)
    : mockArtworks

  // Apply filter for fallback data (CMS data is already filtered)
  const filteredArtworks = cmsArtworks && cmsArtworks.length > 0
    ? artworks
    : artworks.filter((art) => {
        if (filter === 'all') return true
        return art.artworkType === filter
      })

  const handleClick = (artwork: Artwork) => {
    openModal('artwork', artwork.id, artwork as unknown as Record<string, unknown>)
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/40" />
      </div>
    )
  }

  if (error) {
    console.warn('Failed to fetch artworks, using fallback data:', error)
  }

  return (
    <div className="columns-2 gap-3 md:columns-3">
      {filteredArtworks.map((artwork, index) => (
        <motion.div
          key={artwork.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="mb-3 break-inside-avoid"
        >
          <div
            onClick={() => handleClick(artwork)}
            className={cn(
              'group relative cursor-pointer overflow-hidden rounded-xl bg-white/5',
              artwork.isFeatured && 'ring-2 ring-yellow-500/50'
            )}
          >
            {/* Image */}
            <div className="relative aspect-[3/4]">
              <Image
                src={artwork.image}
                alt={artwork.title || 'Artwork'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  {artwork.title && (
                    <h3 className="mb-1 font-medium text-white">
                      {artwork.title}
                    </h3>
                  )}
                  {artwork.artistName && (
                    <p className="text-sm text-white/70">{artwork.artistName}</p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="absolute right-2 top-2 flex gap-1">
                  {artwork.sourceUrl && (
                    <a
                      href={artwork.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-full bg-black/50 p-2 text-white/80 transition-colors hover:bg-black/70 hover:text-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Type badge */}
              <div className="absolute left-2 top-2">
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                    artwork.artworkType === 'official'
                      ? 'bg-blue-500/80 text-white'
                      : artwork.artworkType === 'fanart'
                      ? 'bg-cyan-500/80 text-white'
                      : 'bg-gray-500/80 text-white'
                  )}
                >
                  {artwork.artworkType}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {filteredArtworks.length === 0 && (
        <div className="col-span-full py-12 text-center text-white/40">
          No artworks found
        </div>
      )}
    </div>
  )
}
