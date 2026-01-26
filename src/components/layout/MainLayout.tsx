"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLayoutStore, layoutConfig } from "@/stores/layoutStore";
import { X } from "lucide-react";
import { SongSeekbar } from "@/components/audio/SongSeekbar";
import { LivestreamAlert } from "@/components/ui/LivestreamAlert";
import { Modal } from "@/components/content/Modal";
import { UpdatesPage } from "@/components/pages/UpdatesPage";
import { LeftBar } from "./LeftBar";
import { InteractiveMediaFromCMS } from "./InteractiveMediaFromCMS";
import { AspectLock } from "./AspectLock";
import { BookLayout } from "./BookLayout";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children: _children }: MainLayoutProps) {
  const { focusState, setFocus } = useLayoutStore();
  const config = layoutConfig[focusState];

  // Calculate dimensions
  const leftWidth = config.A;
  const rightWidth = 100 - config.A;
  const bottomRightHeight = config.B;
  const topRightHeight = 100 - config.B;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Main Layout Container */}
      <AspectLock
        aspectRatio={16 / 9}
        anchorX="center"
        anchorY="center"
        off={focusState != "default"}
      >
        <main
          className="flex h-full w-full"
          onClick={() => setFocus("default")}
        >
          {/* Left Section */}
          <motion.div
            className="relative h-full overflow-visible z-30"
            initial={false}
            animate={{
              width: `${leftWidth}%`,
              opacity: leftWidth === 0 ? 0 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <AspectLock
              aspectRatio={1 / 2}
              anchorX="right"
              anchorY="bottom"
              className="absolute perspective-1000"
            >
              <div
                className={cn(
                  "h-full w-full overflow-hidden z-10",
                  focusState == "default"
                    ? "transform-3d  rotate-x-11 rotate-z-5"
                    : "",
                )}
                onClick={(e) => {
                  if (focusState == "default") setFocus("left");
                  e.stopPropagation();
                }}
              >
                <InteractiveMediaFromCMS
                  showEmpty
                  location="landing-left"
                  className="h-full w-full object-contain absolute bottom-0"
                />
                <div
                  className="bg-blue-900 absolute top-[5%] left-[5%] h-[70%] w-[90%]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <UpdatesPage />
                </div>
              </div>
            </AspectLock>
          </motion.div>

          {/* Global Audio Player */}
          <SongSeekbar />

          {/* Right Section (container for top-right and bottom-right) */}
          <motion.div
            className="flex h-full flex-col z-0"
            initial={false}
            animate={{
              width: `${rightWidth}%`,
              opacity: rightWidth === 0 ? 0 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Top Right */}
            <motion.div
              className="relative w-full overflow-visible"
              initial={false}
              animate={{
                height: `${topRightHeight}%`,
                opacity: rightWidth === 0 || topRightHeight === 0 ? 0 : 1,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <AspectLock
                aspectRatio={1}
                anchorX="left"
                anchorY="bottom"
                className="absolute"
              >
                <InteractiveMediaFromCMS
                  location="main-character"
                  className="absolute h-[120%] w-[120%] top-0 right-0"
                />
                <div
                  className="absolute h-full w-full left-1/3  bg-blue-950/80 backdrop-blur-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              </AspectLock>
            </motion.div>

            {/* Bottom Right - Main Content */}
            <motion.div
              className="relative w-full overflow-visible"
              initial={false}
              animate={{
                height: `${bottomRightHeight}%`,
                opacity: rightWidth === 0 ? 0 : 1,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <AspectLock
                aspectRatio={16 / 9}
                anchorX="left"
                anchorY="top"
                className="absolute perspective-1000"
              >
                <div
                  className={cn(
                    "h-full w-full",
                    focusState == "default"
                      ? "transform-3d  rotate-x-12 -rotate-z-5 -translate-z-1"
                      : "",
                  )}
                  onClick={(e) => {
                    if (focusState == "default") setFocus("bottom-right");
                    e.stopPropagation();
                  }}
                >
                  <InteractiveMediaFromCMS
                    showEmpty
                    location="landing-bottom-right"
                    className="h-[105%] w-[105%] top-[-2.5%] left-[-5%] object-contain absolute bottom-0"
                  />
                  <div className="absolute h-[95%] w-[95%] top-[2.5%] left-0 ">
                    <BookLayout />
                  </div>
                </div>
              </AspectLock>
            </motion.div>
          </motion.div>
        </main>
      </AspectLock>

      <LeftBar />

      {/* Back to default button */}
      <AnimatePresence>
        {focusState !== "default" && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => setFocus("default")}
            className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/20 hover:text-white transition-colors"
            aria-label="Back to overview"
          >
            <X className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Livestream Alert */}
      <LivestreamAlert />

      {/* Modal */}
      <Modal />
    </div>
  );
}
