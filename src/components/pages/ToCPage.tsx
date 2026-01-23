'use client'

import { motion } from 'framer-motion'
import { useNavigationStore, sections, type Section } from '@/stores/navigationStore'
import { cn } from '@/lib/utils'
import { User, Image, Music, Box, Home, LucideIcon } from 'lucide-react'

// Filter out 'toc' - we don't navigate to ourselves
const navSections = sections.filter((s) => s !== 'toc')

const sectionIcons: Record<Section, LucideIcon> = {
  toc: Home,
  about: User,
  artworks: Image,
  discography: Music,
  'vtuber-models': Box,
}

const sectionLabels: Record<Section, string> = {
  toc: 'Home',
  about: 'About Me',
  artworks: 'Gallery',
  discography: 'Discography',
  'vtuber-models': 'VTuber Models',
}

const sectionDescriptions: Record<Section, string> = {
  toc: 'Return to home',
  about: 'Learn more about me and my journey',
  artworks: 'Fan art and official illustrations',
  discography: 'Original songs and covers',
  'vtuber-models': 'Live2D and 3D model showcase',
}

export function ToCPage() {
  const { currentSection, setSection, isTransitioning } = useNavigationStore()

  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <h2 className="mb-8 text-2xl font-bold text-white">Navigate</h2>

      <div className="grid grid-cols-2 gap-4">
        {navSections.map((section) => {
          const Icon = sectionIcons[section]
          const isActive = currentSection === section

          return (
            <motion.button
              key={section}
              onClick={() => setSection(section)}
              disabled={isTransitioning}
              className={cn(
                'group relative flex flex-col items-center gap-3 rounded-xl p-6 transition-all',
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="tocActive"
                  className="absolute inset-0 rounded-xl border-2 border-white/30"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              <Icon className="h-8 w-8" />

              <div className="text-center">
                <h3 className="font-semibold">{sectionLabels[section]}</h3>
                <p className="mt-1 text-xs text-white/50">{sectionDescriptions[section]}</p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
