"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLayoutStore, SCENE, BOOK, PHONE } from "@/stores/layoutStore";
import { useComponentTransform } from "@/hooks/useComponentTransform";
import { sceneSpring } from "@/constants/animations";
import { X } from "lucide-react";
import { SongSeekbar } from "@/components/audio/SongSeekbar";
import { LivestreamAlert } from "@/components/ui/LivestreamAlert";
import { Modal } from "@/components/content/Modal";
import { LeftBar } from "./LeftBar";
import { InteractiveMediaFromCMS } from "@/components/media";
import { BookLayout } from "./BookLayout";
import { PhoneLayout } from "./PhoneLayout";
import { useEffect, useRef } from "react";
import { fadeVariants } from "@/constants/animations";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children: _children }: Readonly<MainLayoutProps>) {
  const { focusState, setFocus, scaleFactor, setRootDimension } =
    useLayoutStore();
  const bookTransform = useComponentTransform("book");
  const phoneTransform = useComponentTransform("phone");
  const mediaTransform = useComponentTransform("media");

  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sceneRef.current?.parentElement;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setRootDimension(entry.contentRect);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [setRootDimension]);

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-(--modal-bg)"
      onClick={() => setFocus("default")}
    >
      <InteractiveMediaFromCMS
        showEmpty
        location="landing-bg"
        className="absolute h-full w-full"
        imageClass="object-cover"
        onClick={() => setFocus("default")}
      />

      {/* Scaled scene */}
      <div
        ref={sceneRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          className="absolute pointer-events-auto perspective-distant"
          style={{
            width: SCENE.width,
            height: SCENE.height,
            transform: `scale(${scaleFactor})`,
            transformOrigin: "center",
          }}
        >
          <motion.div
            key={"book"}
            style={{ width: BOOK.width, height: BOOK.height }}
            className="z-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            animate={bookTransform}
            transition={sceneSpring}
          >
            <BookLayout />
          </motion.div>

          <motion.div
            key={"media-position"}
            style={{ width: 1000, height: 1000 }}
            className="z-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            animate={mediaTransform}
            transition={sceneSpring}
          >
            <InteractiveMediaFromCMS
              location="main-character"
              className="h-full w-full pointer-events-auto"
            />
          </motion.div>

          <motion.div
            key={"phone"}
            style={{ width: PHONE.width, height: PHONE.height }}
            className="z-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            animate={phoneTransform}
            transition={sceneSpring}
          >
            <PhoneLayout />
          </motion.div>
        </div>
      </div>

      <SongSeekbar />

      <AnimatePresence>
        {focusState == "default" && (
          <motion.div
            variants={fadeVariants}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            <LeftBar />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {focusState !== "default" && (
          <motion.button
            variants={fadeVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            key="exit-button"
            onClick={() => setFocus("default")}
            className="fixed top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <LivestreamAlert />

      <Modal />
    </div>
  );
}
