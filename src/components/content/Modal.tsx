"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useModalStore, type ModalDataMap } from "@/stores/modalStore";
import { X } from "lucide-react";
import { scaleFadeVariants } from "@/animations";
import { ArtworkModalContent } from "./modals/ArtworkModal";
import { PostModalContent } from "./modals/PostModal";
import { ModelModalContent } from "./modals/ModelModal";
import { PersonModalContent } from "./modals/PersonModal";
import { SongModalContent } from "./modals/SongModal";
import type { Artwork, Post, MusicTrack, Model, Person } from "@/payload-types";

export function Modal() {
  const { isOpen, modalType, contentId, contentData, closeModal } =
    useModalStore();

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeModal]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="modal-backdrop"
            onClick={closeModal}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Modal content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="modal-content"
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div className="relative rounded-2xl bg-(--modal-bg) p-6 shadow-2xl">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 rounded-full p-2 text-(--modal-text)/60 transition-colors hover:bg-(--modal-surface)/10 hover:text-(--modal-text)"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Content based on type */}
              <ModalContent
                type={modalType}
                id={contentId}
                data={contentData}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface ModalContentProps {
  type: keyof ModalDataMap | null;
  id: string | null;
  data: ModalDataMap[keyof ModalDataMap] | null;
}

function ModalContent({ type, id, data }: Readonly<ModalContentProps>) {
  if (!data) {
    return (
      <div className="py-8 text-center text-(--modal-text)/60">Loading...</div>
    );
  }

  switch (type) {
    case "post":
      return <PostModalContent data={data as Post} />;

    case "artwork":
      return <ArtworkModalContent data={data as Artwork} />;

    case "song":
      return <SongModalContent id={id} data={data as MusicTrack} />;

    case "model":
      return <ModelModalContent data={data as Model} />;

    case "person":
      return <PersonModalContent data={data as Person} />;

    default:
      return (
        <div className="py-8 text-center text-(--modal-text)/60">
          Content not available
        </div>
      );
  }
}
