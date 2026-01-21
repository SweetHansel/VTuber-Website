'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useNavigationStore, type Section } from '@/stores/navigationStore'
import { Container2_5D } from '@/components/layout/Container2_5D'
import { AboutPage } from './AboutPage'
import { ArtworksPage } from './ArtworksPage'
import { DiscographyPage } from './DiscographyPage'
import { VTuberModelsPage } from './VTuberModelsPage'
import { pageVariants } from '@/animations'
import { useEffect, useCallback } from 'react'

const pages: Record<Section, React.ComponentType> = {
  about: AboutPage,
  artworks: ArtworksPage,
  discography: DiscographyPage,
  'vtuber-models': VTuberModelsPage,
}

export function PageContainer() {
  const { currentSection, scrollDirection, setSection, setTransitioning, isTransitioning } =
    useNavigationStore()

  const CurrentPage = pages[currentSection]

  // Handle wheel scrolling for page navigation
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (isTransitioning) return

      const sections: Section[] = ['about', 'artworks', 'discography', 'vtuber-models']
      const currentIndex = sections.indexOf(currentSection)

      if (e.deltaY > 50 && currentIndex < sections.length - 1) {
        setSection(sections[currentIndex + 1])
      } else if (e.deltaY < -50 && currentIndex > 0) {
        setSection(sections[currentIndex - 1])
      }
    },
    [currentSection, isTransitioning, setSection]
  )

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  return (
    <Container2_5D
      className="h-[calc(100vh-8rem)] w-full max-w-4xl"
      rotateXRange={[-4, 4]}
      rotateYRange={[-4, 4]}
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-black/30 backdrop-blur-lg">
        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={() => setTransitioning(false)}
        >
          <motion.div
            key={currentSection}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            custom={scrollDirection || 'down'}
            className="h-full w-full"
          >
            <CurrentPage />
          </motion.div>
        </AnimatePresence>
      </div>
    </Container2_5D>
  )
}
