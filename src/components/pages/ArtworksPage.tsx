'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MasonryGallery } from '@/components/gallery/MasonryGallery'
import { AnimatedArtwork } from '@/components/layout/AnimatedArtwork'
import { staggerContainerVariants, staggerItemVariants } from '@/animations'
import { cn } from '@/lib/utils'

type ArtworkFilter = 'all' | 'fanart' | 'official' | 'meme'

const filters: { label: string; value: ArtworkFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Fan Art', value: 'fanart' },
  { label: 'Official', value: 'official' },
  { label: 'Memes', value: 'meme' },
]

export function ArtworksPage() {
  const [filter, setFilter] = useState<ArtworkFilter>('all')

  return (
    <div className="relative flex h-full">
      {/* Background animated artwork */}
      <AnimatedArtwork
        position="artworks-left"
        className="absolute -left-20 top-1/2 -translate-y-1/2 opacity-30"
        animationType="sway"
        width={300}
        height={400}
        depth={-50}
      />

      {/* Main content */}
      <motion.div
        variants={staggerContainerVariants}
        initial="initial"
        animate="enter"
        className="relative z-10 flex h-full w-full flex-col p-6"
      >
        {/* Header */}
        <motion.div
          variants={staggerItemVariants}
          className="mb-4 flex items-center justify-between"
        >
          <h1 className="text-2xl font-bold text-white">Artworks</h1>

          {/* Filters */}
          <div className="flex gap-1 rounded-lg bg-white/5 p-1">
            {filters.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  filter === value
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:text-white'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Gallery */}
        <motion.div
          variants={staggerItemVariants}
          className="flex-1 overflow-y-auto"
        >
          <MasonryGallery filter={filter} />
        </motion.div>
      </motion.div>
    </div>
  )
}
