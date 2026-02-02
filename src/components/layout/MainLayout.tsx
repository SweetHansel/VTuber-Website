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
import { PhoneLayout } from "./PhoneLayout";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children: _children }: Readonly<MainLayoutProps>) {
  const { focusState, setFocus } = useLayoutStore();
  const config = layoutConfig[focusState];

  // Calculate dimensions
  const leftWidth = config.A;
  const rightWidth = 100 - config.A;
  const bottomRightHeight = config.B;
  const topRightHeight = 100 - config.B;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white">
      {/* Main Layout Container */}

      <InteractiveMediaFromCMS
        showEmpty
        location="landing-bg"
        className="h-full w-full absolute bottom-0"
        imageClass="object-cover"
      />
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
            className="relative h-full z-30"
            initial={false}
            animate={{
              width: `${leftWidth}%`,
              opacity: leftWidth === 0 ? 0 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <PhoneLayout/>
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
              className="relative w-full z-10"
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
                  className="absolute h-full w-full left-[20%] top-0"
                />
              </AspectLock>
            </motion.div>

            {/* Bottom Right - Main Content */}
            <motion.div
              className="relative w-full"
              initial={false}
              animate={{
                height: `${bottomRightHeight}%`,
                opacity: rightWidth === 0 ? 0 : 1,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <BookLayout/>
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
