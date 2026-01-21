'use client'

import { motion } from 'framer-motion'
import { useNavigationStore, sections, type Section } from '@/stores/navigationStore'
import { cn } from '@/lib/utils'

const sectionLabels: Record<Section, string> = {
  about: 'About',
  artworks: 'Gallery',
  discography: 'Music',
  'vtuber-models': 'Models',
}

interface ToCProps {
  className?: string
}

export function ToC({ className }: ToCProps) {
  const { currentSection, setSection, isTransitioning } = useNavigationStore()

  return (
    <nav className={cn('flex flex-col gap-3', className)}>
      {sections.map((section, index) => {
        const isActive = currentSection === section

        return (
          <button
            key={section}
            onClick={() => setSection(section)}
            disabled={isTransitioning}
            className="group relative flex items-center gap-2"
          >
            {/* Dot indicator */}
            <div className="relative flex h-3 w-3 items-center justify-center">
              <motion.div
                className={cn(
                  'h-2 w-2 rounded-full transition-colors',
                  isActive ? 'bg-white' : 'bg-white/40 group-hover:bg-white/70'
                )}
                animate={{
                  scale: isActive ? 1.2 : 1,
                }}
              />
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-white/30"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              )}
            </div>

            {/* Label */}
            <span
              className={cn(
                'whitespace-nowrap text-xs font-medium transition-all',
                isActive
                  ? 'text-white'
                  : 'text-white/0 group-hover:text-white/70'
              )}
            >
              {sectionLabels[section]}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
