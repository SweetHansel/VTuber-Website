'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useLayoutStore, layoutConfig } from '@/stores/layoutStore'
import { useNavigationStore, type Section } from '@/stores/navigationStore'
import { SongSeekbar } from '@/components/audio/SongSeekbar'
import { LivestreamAlert } from '@/components/ui/LivestreamAlert'
import { Modal } from '@/components/content/Modal'
import { UpdatesPage } from '@/components/pages/UpdatesPage'
import { ToCPage } from '@/components/pages/ToCPage'
import { AboutPage } from '@/components/pages/AboutPage'
import { ArtworksPage } from '@/components/pages/ArtworksPage'
import { DiscographyPage } from '@/components/pages/DiscographyPage'
import { VTuberModelsPage } from '@/components/pages/VTuberModelsPage'
import { pageVariants } from '@/animations'
import { LeftBar } from './LeftBar'
import { InteractiveMedia } from './InteractiveMedia'

interface MainLayoutProps {
  children?: ReactNode
}

// Page mapping for bottom-right container
const pages: Record<Section, React.ComponentType> = {
  toc: ToCPage,
  about: AboutPage,
  artworks: ArtworksPage,
  discography: DiscographyPage,
  'vtuber-models': VTuberModelsPage,
}

export function MainLayout({ children }: MainLayoutProps) {
  const { focusState, setFocus, goBack } = useLayoutStore()
  const { currentSection, scrollDirection, setTransitioning } = useNavigationStore()

  const CurrentPage = pages[currentSection]
  const config = layoutConfig[focusState]

  // Calculate dimensions
  const leftWidth = config.A
  const rightWidth = 100 - config.A
  const bottomRightHeight = config.B
  const topRightHeight = 100 - config.B

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Main Layout Container */}
      <main className="flex h-full w-full gap-4 p-4">
        {/* Left Section */}
        <motion.div
          className="h-full overflow-hidden rounded-2xl bg-black/30 backdrop-blur-lg"
          animate={{
            width: `${leftWidth}%`,
            opacity: leftWidth === 0 ? 0 : 1,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          onClick={() => focusState === 'default' && setFocus('left')}
          style={{ cursor: focusState === 'default' ? 'pointer' : 'default' }}
        >
          <UpdatesPage />
        </motion.div>

        {/* Right Section (container for top-right and bottom-right) */}
        <motion.div
          className="flex h-full flex-col gap-4"
          animate={{
            width: `${rightWidth}%`,
            opacity: rightWidth === 0 ? 0 : 1,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Top Right */}
          <motion.div
            className="w-full overflow-hidden rounded-2xl bg-black/30 backdrop-blur-lg"
            animate={{
              height: `${topRightHeight}%`,
              opacity: topRightHeight === 0 ? 0 : 1,
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            {/* Interactive media / character will go here */}
            <div className="flex h-full items-center justify-center">
              <InteractiveMedia
                defaultMedia={{
                  src: '/placeholder-idle.png',
                  alt: 'Character idle',
                }}
                hoverMedia={{
                  src: '/placeholder-hover.png',
                  alt: 'Character hover',
                }}
                clickMedia={{
                  src: '/placeholder-click.png',
                  alt: 'Character click',
                }}
              />
            </div>
          </motion.div>

          {/* Bottom Right - Main Content */}
          <motion.div
            className="w-full overflow-hidden rounded-2xl bg-black/30 backdrop-blur-lg"
            animate={{
              height: `${bottomRightHeight}%`,
              opacity: rightWidth === 0 ? 0 : 1,
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            onClick={() => focusState === 'default' && setFocus('bottom-right')}
            style={{ cursor: focusState === 'default' ? 'pointer' : 'default' }}
          >
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
                custom={scrollDirection || 'right'}
                className="h-full w-full"
              >
                <CurrentPage />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </main>

      {/* Floating Back Button */}
      <AnimatePresence>
        {focusState !== 'default' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={goBack}
            className="fixed bottom-8 left-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-lg transition-colors hover:bg-white/30"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <LeftBar/>

      {/* Global Audio Player */}
      <SongSeekbar />

      {/* Livestream Alert */}
      <LivestreamAlert />

      {/* Modal */}
      <Modal />
    </div>
  )
}
