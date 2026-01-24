"use client";

import { motion,  } from "framer-motion";
import { useLayoutStore, layoutConfig } from "@/stores/layoutStore";
import { SongSeekbar } from "@/components/audio/SongSeekbar";
import { LivestreamAlert } from "@/components/ui/LivestreamAlert";
import { Modal } from "@/components/content/Modal";
import { UpdatesPage } from "@/components/pages/UpdatesPage";
import { LeftBar } from "./LeftBar";
import { InteractiveMedia } from "./InteractiveMedia";
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
        aspectRatio={4 / 3}
        off={focusState != "default"}
        anchorX="center"
        anchorY="center"
      >
        <main
          className="flex h-full w-full gap-4 pt-4 px-4"
          onClick={() => setFocus("default")}
        >
          {/* Left Section */}
          <motion.div
            className="relative h-full overflow-visible "
            animate={{
              width: `${leftWidth}%`,
              opacity: leftWidth === 0 ? 0 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <AspectLock aspectRatio={7 / 11} anchorX="right" anchorY="bottom">
              <div
                className={cn(
                  "h-full w-full overflow-hidden z-10",
                  focusState == "default"
                    ? "transform-3d  rotate-x-18 rotate-z-5"
                    : "",
                )}
                onClick={(e) => {
                  if (focusState == "default") setFocus("left");
                  e.stopPropagation();
                }}
              >
                <InteractiveMedia
                  className="h-full w-full object-contain absolute bottom-0"
                  defaultMedia={{
                    src: "/placeholder-flipphone.png",
                    alt: "Character idle",
                  }}
                />
                <div
                  className="bg-blue-900/80 absolute top-[11.4%] left-[10%] h-[62%] w-[80.3%]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <UpdatesPage />
                </div>
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
              <AspectLock aspectRatio={1} anchorX="left" anchorY="bottom">
                <div
                  className="h-full w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <InteractiveMedia
                    className="h-full w-full"
                    defaultMedia={{
                      src: "/placeholder-idle.gif",
                      alt: "Character idle",
                    }}
                    hoverMedia={{
                      src: "/placeholder-hover.gif",
                      alt: "Character hover",
                    }}
                    clickMedia={{
                      src: "/placeholder-click.gif",
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
                  <div
                    className={cn(
                      "h-full w-full bg-blue-900/80 backdrop-blur-lg",
                      focusState == "default"
                        ? "transform-3d  rotate-x-12 -rotate-z-5 -translate-z-1"
                        : "",
                    )}
                    onClick={(e) => {
                      if (focusState == "default") setFocus("bottom-right");
                      e.stopPropagation();
                    }}
                  >
                    <BookLayout/>
                  </div>
              </AspectLock>
            </motion.div>
          </motion.div>
        </main>
      </AspectLock>

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
