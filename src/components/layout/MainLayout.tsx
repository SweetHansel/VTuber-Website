'use client'

import { ReactNode, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LeftBar } from './LeftBar'
import { Container2_5D } from './Container2_5D'
import { TransitionFrame } from './TransitionFrame'
import { InteractiveMedia } from './InteractiveMedia'
import { SongSeekbar } from '@/components/audio/SongSeekbar'
import { LivestreamAlert } from '@/components/ui/LivestreamAlert'
import { Modal } from '@/components/content/Modal'
import { UpdatesPage } from '@/components/pages/UpdatesPage'
import { ToCPage } from '@/components/pages/ToCPage'
import { AboutPage } from '@/components/pages/AboutPage'
import { ArtworksPage } from '@/components/pages/ArtworksPage'
import { DiscographyPage } from '@/components/pages/DiscographyPage'
import { VTuberModelsPage } from '@/components/pages/VTuberModelsPage'
import { useLayoutStore } from '@/stores/layoutStore'
import { useNavigationStore, type Section } from '@/stores/navigationStore'
import { pageVariants } from '@/animations'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children?: ReactNode
}

// Page mapping for right container
const pages: Record<Section, React.ComponentType> = {
  toc: ToCPage,
  about: AboutPage,
  artworks: ArtworksPage,
  discography: DiscographyPage,
  'vtuber-models': VTuberModelsPage,
}


export function MainLayout({ children }: MainLayoutProps) {
  const { focusTarget, setFocus, isTransitioning: layoutTransitioning } = useLayoutStore()
  const { currentSection, scrollDirection, setTransitioning } = useNavigationStore()

  const CurrentRightPage = pages[currentSection]

  // Handle click on containers to change focus
  const handleLeftClick = useCallback(() => {
    if (focusTarget !== 'left') {
      setFocus('left')
    }
  }, [focusTarget, setFocus])

  const handleRightClick = useCallback(() => {
    if (focusTarget !== 'right') {
      setFocus('right')
    }
  }, [focusTarget, setFocus])

  const isLeftFocused = focusTarget === 'left'
  const isRightFocused = focusTarget === 'right'

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Left Navigation Bar (floating, auto-hide) */}
      <LeftBar />

      {/* Main Content Area */}
      <main className="flex min-h-screen items-center justify-center gap-8 p-8">
        {/* Left Section - Updates */}
        <motion.div
          className={cn(
            'relative hidden lg:block',
            isLeftFocused ? 'z-20' : 'z-10'
          )}
          animate={{
            scale: isLeftFocused ? 1 : 0.2,
            opacity: isLeftFocused ? 1 : 0.6,
            x: isLeftFocused ? 0 : -20,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <Container2_5D
            className="w-80 xl:w-96"
            aspectRatio={{ width: 3, height: 4 }}
            rotateXRange={[-3, 3]}
            rotateYRange={[-3, 3]}
            isFocused={isLeftFocused}
            onClick={handleLeftClick}
          >
            <div className="h-full w-full rounded-2xl bg-black/30 backdrop-blur-lg">
              <TransitionFrame
                aspectRatio={{ width: 3, height: 4 }}
                anchor={{ x: 'center', y: 'center' }}
                transitionKey="updates"
                transitionType="fade"
                className="h-full w-full"
              >
                <UpdatesPage />
              </TransitionFrame>
            </div>
          </Container2_5D>
        </motion.div>

        {/* Right Section - Main Content + Interactive Media */}
        <div className='relative flex flex-col items-end gap-4'>
        <motion.div
          className={cn(
            'relative flex flex-col items-end gap-4',
            isRightFocused ? 'z-20' : 'z-10'
          )}
          animate={{
            scale: isRightFocused ? 0 : 1,
            opacity: isRightFocused ? 0.6 : 0.6,
            x: isRightFocused ? 0 : 20,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Interactive Media (top-right) */}
          <InteractiveMedia
            className="mr-8"
            width={180}
            height={180}
            defaultMedia={{
              src: '/placeholder-artwork.png',
              alt: 'Character idle',
            }}
            hoverMedia={{
              src: '/placeholder-artwork.png',
              alt: 'Character hover',
            }}
            clickMedia={{
              src: '/placeholder-artwork.png',
              alt: 'Character click',
            }}
          />
          </motion.div>
          
          <motion.div
          className={cn(
            'relative flex flex-col items-end gap-4',
            isRightFocused ? 'z-20' : 'z-10'
          )}
          animate={{
            scale: isRightFocused ? 1 : 0.2,
            opacity: isRightFocused ? 1 : 0.6,
            x: isRightFocused ? 0 : 20,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Main Page Container */}
          <Container2_5D
            className="h-[calc(100vh-16rem)] w-full max-w-4xl"
            aspectRatio={{ width: 16, height: 9 }}
            rotateXRange={[-4, 4]}
            rotateYRange={[-4, 4]}
            isFocused={isRightFocused}
            onClick={handleRightClick}
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
                  custom={scrollDirection || 'right'}
                  className="h-full w-full"
                >
                  <CurrentRightPage />
                </motion.div>
              </AnimatePresence>
            </div>
          </Container2_5D>
        </motion.div>
        </div>
      </main>

      {/* Global Audio Player */}
      <SongSeekbar />

      {/* Livestream Alert */}
      <LivestreamAlert />

      {/* Modal */}
      <Modal />
    </div>
  )
}
