"use client";

import { motion } from "framer-motion";
import { useLayoutStore } from "@/stores/layoutStore";
import {
  useComponentTransform,
  sceneSpring,
} from "@/hooks/useComponentTransform";
import { X } from "lucide-react";
import { SongSeekbar } from "@/components/audio/SongSeekbar";
import { LivestreamAlert } from "@/components/ui/LivestreamAlert";
import { Modal } from "@/components/content/Modal";
import { LeftBar } from "./LeftBar";
import { InteractiveMediaFromCMS } from "@/components/media";
import { BookLayout } from "./BookLayout";
import { PhoneLayout } from "./PhoneLayout";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AspectLock } from "./AspectLock";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children: _children }: Readonly<MainLayoutProps>) {
  const { focusState, setFocus } = useLayoutStore();
  const bookTransform = useComponentTransform("book");
  const phoneTransform = useComponentTransform("phone");
  const mediaTransform = useComponentTransform("media");

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-(--modal-bg) flex justify-center items-center"
      onClick={() => setFocus("default")}
    >
      <InteractiveMediaFromCMS
        showEmpty
        location="landing-bg"
        className="absolute h-full w-full"
        imageClass="object-cover"
        onClick={() => setFocus("default")}
      />

      <AspectLock
        aspectRatio={4 / 3}
        off={focusState != "default"}
        className="relative"
      >
        <motion.div
          key={"book-position"}
          className={cn(
            "z-0 absolute h-full w-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex pointer-events-none items-center perspective-1000 justify-center",
          )}
          animate={bookTransform.position}
          transition={sceneSpring}
        >
          <motion.div
            key={"book-rotation"}
            className="absolute h-full w-full"
            animate={bookTransform.rotation}
            transition={sceneSpring}
          >
            <BookLayout />
          </motion.div>
        </motion.div>

        <motion.div
          key={"media-position"}
          className="z-0 absolute h-full w-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none perspective-1000"
          animate={mediaTransform.position}
          transition={sceneSpring}
        >
          <motion.div
            key={"media-rotation"}
            className="absolute h-full w-full"
            animate={mediaTransform.rotation}
            transition={sceneSpring}
          >
            <InteractiveMediaFromCMS
              location="main-character"
              className="h-full w-full pointer-events-auto"
            />
          </motion.div>
        </motion.div>

        <SongSeekbar />

        <motion.div
          key={"phone-position"}
          className="z-0 absolute h-full w-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none perspective-1000"
          animate={phoneTransform.position}
          transition={sceneSpring}
        >
          <motion.div
            key={"phone-rotation"}
            className="absolute h-full w-full"
            animate={phoneTransform.rotation}
            transition={sceneSpring}
          >
            <PhoneLayout />
          </motion.div>
        </motion.div>
        
        {focusState == "default" && <LeftBar />}

        {focusState !== "default" && (
          <button
            key="exit-button"
            onClick={() => setFocus("default")}
            className="fixed top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <LivestreamAlert />

        <Modal />
      </AspectLock>
    </div>
  );
}
