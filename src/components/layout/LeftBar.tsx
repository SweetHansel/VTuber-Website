'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useNavigationStore, sections, type Section } from '@/stores/navigationStore'
import { cn } from '@/lib/utils'
import { User, Image, Music, Box, LucideIcon } from 'lucide-react'

const sectionIcons: Record<Section, LucideIcon> = {
  about: User,
  artworks: Image,
  discography: Music,
  'vtuber-models': Box,
}

const sectionLabels: Record<Section, string> = {
  about: 'About',
  artworks: 'Artworks',
  discography: 'Discography',
  'vtuber-models': 'Models',
}

export function LeftBar() {
  const { currentSection, setSection, isTransitioning } = useNavigationStore()

  return (
    <nav className="fixed left-0 top-0 z-50 flex h-full w-16 flex-col items-center justify-center gap-2 bg-black/20 backdrop-blur-md md:w-20">
      <div className="flex flex-col gap-1">
        {sections.map((section) => {
          const Icon = sectionIcons[section]
          const isActive = currentSection === section

          return (
            <button
              key={section}
              onClick={() => setSection(section)}
              disabled={isTransitioning}
              className={cn(
                'group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 md:h-14 md:w-14',
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              )}
              aria-label={sectionLabels[section]}
            >
              <Icon className="h-5 w-5 md:h-6 md:w-6" />

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute -left-1 h-8 w-1 rounded-full bg-white"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              {/* Tooltip */}
              <span className="absolute left-full ml-3 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {sectionLabels[section]}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
