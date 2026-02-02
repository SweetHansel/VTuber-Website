"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ChevronRight, ChevronLeft, Box, Info } from "lucide-react";
import { type Model, getMedia } from "@/hooks/useCMS";
import { useModalStore } from "@/stores/modalStore";

interface ModelShowcaseProps {
  model: Model | null;
}

export function ModelShowcase({ model }: Readonly<ModelShowcaseProps>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const openModal = useModalStore((state) => state.openModal);

  const handleOpenDetails = () => {
    if (!model) return;
    openModal('model', String(model.id), {
      name: model.name,
      version: model.version,
      modelType: model.modelType,
      isActive: model.isActive,
      debutDate: model.debutDate,
      showcase: model.showcase,
      credits: model.credits,
      technicalSpecs: model.technicalSpecs,
    });
  };

  const showcase = model?.showcase || [];
  const hasMultiple = showcase.length > 1;

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % showcase.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + showcase.length) % showcase.length);
  };

  if (!model) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center text-(--page-text)">
          <Box className="mx-auto h-16 w-16 mb-4 text-(--page-text)/60" />
          <h2 className="text-xl font-bold">Model Showcase</h2>
          <p className="text-sm text-(--page-text)/60 mt-2">Select a model to view</p>
        </div>
      </div>
    );
  }

  if (showcase.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center text-(--page-text)">
          <Box className="mx-auto h-16 w-16 mb-4 text-(--page-text)/60" />
          <h2 className="text-xl font-bold">{model.name}</h2>
          <p className="text-sm text-(--page-text)/60 mt-2">No showcase images</p>
        </div>
      </div>
    );
  }

  const currentItem = showcase[currentIndex];
  const currentMedia = getMedia(currentItem.media);

  return (
    <div className="flex h-full flex-col p-4">
      {/* Model name */}
      <div className="mb-3 flex items-center justify-center gap-2">
        <div className="text-center">
          <h2 className="text-lg font-bold text-(--page-text)">{model.name}</h2>
          {model.version && (
            <p className="text-sm text-(--page-text)/60">v{model.version}</p>
          )}
        </div>
        <button
          onClick={handleOpenDetails}
          className="rounded-full p-2 text-(--page-text)/60 transition-colors hover:bg-(--page-surface)/10 hover:text-(--page-text)"
          title="View details"
        >
          <Info className="h-5 w-5" />
        </button>
      </div>

      {/* Image container */}
      <div className="relative flex-1 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Image
              src={currentMedia?.url || "/placeholder-model.png"}
              alt={currentItem.caption || model.name}
              fill
              className="object-contain"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        {hasMultiple && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Caption */}
      {currentItem.caption && (
        <p className="mt-2 text-center text-sm text-(--page-text)/70">
          {currentItem.caption}
        </p>
      )}

      {/* Dot indicators */}
      {hasMultiple && (
        <div className="mt-3 flex justify-center gap-2">
          {showcase.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                index === currentIndex
                  ? "bg-(--page-surface) w-4"
                  : "bg-(--page-surface)/40 hover:bg-(--page-surface)/60"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
