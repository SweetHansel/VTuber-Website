"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useLayoutStore, layoutConfig } from "@/stores/layoutStore";
import { useNavigationStore, type Section } from "@/stores/navigationStore";
import { SongSeekbar } from "@/components/audio/SongSeekbar";
import { LivestreamAlert } from "@/components/ui/LivestreamAlert";
import { Modal } from "@/components/content/Modal";
import { UpdatesPage } from "@/components/pages/UpdatesPage";
import { ToCPage } from "@/components/pages/ToCPage";
import { AboutPage } from "@/components/pages/AboutPage";
import { ArtworksPage } from "@/components/pages/ArtworksPage";
import { DiscographyPage } from "@/components/pages/DiscographyPage";
import { VTuberModelsPage } from "@/components/pages/VTuberModelsPage";
import { pageVariants } from "@/animations";
import { LeftBar } from "./LeftBar";
import { InteractiveMedia } from "./InteractiveMedia";
import { AspectLock } from "./AspectLock";

interface MainLayoutProps {
  children?: ReactNode;
}

// Page mapping for bottom-right container
const pages: Record<Section, React.ComponentType> = {
  toc: ToCPage,
  about: AboutPage,
  artworks: ArtworksPage,
  discography: DiscographyPage,
  "vtuber-models": VTuberModelsPage,
};

export function MainLayout({ children }: MainLayoutProps) {
  const { focusState, setFocus, goBack } = useLayoutStore();
  const { currentSection, scrollDirection, setTransitioning } =
    useNavigationStore();

  const CurrentPage = pages[currentSection];
  const config = layoutConfig[focusState];

  // Calculate dimensions
  const leftWidth = config.A;
  const rightWidth = 100 - config.A;
  const bottomRightHeight = config.B;
  const topRightHeight = 100 - config.B;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Main Layout Container */}
      <AspectLock aspectRatio={4 / 3} off={focusState!="default"} anchorX="center" anchorY="center">
        <main className="bg-red-600 flex h-full w-full gap-4 p-4">
          {/* Left Section */}
          <motion.div
            className="relative h-full overflow-visible"
            animate={{
              width: `${leftWidth}%`,
              opacity: leftWidth === 0 ? 0 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <AspectLock aspectRatio={3 / 4} anchorX="right" anchorY="center">
              <div className="rounded-2xl bg-black/30 backdrop-blur-lg h-full w-full overflow-hidden">
                {/* Click Overlay - only visible in default state */}
                <AnimatePresence>
                  {focusState === "default" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-0 z-30 cursor-pointer rounded-2xl h-full w-full"
                      onClick={() => setFocus("left")}
                    />
                  )}
                </AnimatePresence>
                <UpdatesPage />
              </div>
            </AspectLock>
          </motion.div>

          {/* Right Section (container for top-right and bottom-right) */}
          <motion.div
            className="flex h-full flex-col gap-4"
            animate={{
              width: `${rightWidth}%`,
              opacity: rightWidth === 0 ? 0 : 1,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Top Right */}
            <motion.div
              className="relative w-full overflow-visible"
              animate={{
                height: `${topRightHeight}%`,
                opacity: topRightHeight === 0 ? 0 : 1,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <AspectLock aspectRatio={1} anchorX="center" anchorY="bottom">
                <div className="rounded-2xl  bg-black/30 backdrop-blur-lg h-full w-full">
                  <InteractiveMedia
                    defaultMedia={{
                      src: "/placeholder-idle.png",
                      alt: "Character idle",
                    }}
                    hoverMedia={{
                      src: "/placeholder-hover.png",
                      alt: "Character hover",
                    }}
                    clickMedia={{
                      src: "/placeholder-click.png",
                      alt: "Character click",
                    }}
                  />
                </div>
              </AspectLock>
            </motion.div>

            {/* Bottom Right - Main Content */}
            <motion.div
              className="relative w-full overflow-visible"
              animate={{
                height: `${bottomRightHeight}%`,
                opacity: rightWidth === 0 ? 0 : 1,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <AspectLock aspectRatio={16 / 9} anchorX="left" anchorY="top">
                <AnimatePresence
                  mode="wait"
                  initial={false}
                  onExitComplete={() => setTransitioning(false)}
                >
                  <div className="h-full w-full rounded-2xl  bg-black/30 backdrop-blur-lg overflow-hidden">
                    <AnimatePresence>
                      {/* Bottom-right overlay */}
                      {focusState === "default" && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-0 left-0 z-30 cursor-pointer h-full w-full"
                          onClick={() => setFocus("bottom-right")}
                        />
                      )}
                    </AnimatePresence>
                    <motion.div
                      key={currentSection}
                      variants={pageVariants}
                      initial="initial"
                      animate="enter"
                      exit="exit"
                      custom={scrollDirection || "right"}
                      className="h-full w-full"
                    >
                      <CurrentPage />
                    </motion.div>
                  </div>
                </AnimatePresence>
              </AspectLock>
            </motion.div>
          </motion.div>
        </main>
      </AspectLock>

      {/* Floating Back Button */}
      <AnimatePresence>
        {focusState !== "default" && (
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

      <LeftBar />

      {/* Global Audio Player */}
      <SongSeekbar />

      {/* Livestream Alert */}
      <LivestreamAlert />

      {/* Modal */}
      <Modal />
    </div>
  );
}
