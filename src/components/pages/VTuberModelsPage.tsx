"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ChevronRight, ChevronLeft, User, Box, Loader2 } from "lucide-react";
import type { PageContent } from "@/components/layout/BookLayout";
import { useModels, type Model } from "@/hooks/useCMS";
import { useModelShowcaseStore } from "@/stores/modelShowcaseStore";

type ModelTab = "2d" | "3d";

// Model Showcase Component
function ModelShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const model = useModelShowcaseStore((state) => state.selectedModel);

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
        <div className="text-center text-white">
          <Box className="mx-auto h-16 w-16 mb-4 text-white/60" />
          <h2 className="text-xl font-bold">Model Showcase</h2>
          <p className="text-sm text-white/60 mt-2">Select a model to view</p>
        </div>
      </div>
    );
  }

  if (showcase.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center text-white">
          <Box className="mx-auto h-16 w-16 mb-4 text-white/60" />
          <h2 className="text-xl font-bold">{model.name}</h2>
          <p className="text-sm text-white/60 mt-2">No showcase images</p>
        </div>
      </div>
    );
  }

  const currentItem = showcase[currentIndex];

  return (
    <div className="flex h-full flex-col p-4">
      {/* Model name */}
      <div className="mb-3 text-center">
        <h2 className="text-lg font-bold text-white">{model.name}</h2>
        {model.version && (
          <p className="text-sm text-white/60">v{model.version}</p>
        )}
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
              src={currentItem.media?.url || "/placeholder-model.png"}
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
        <p className="mt-2 text-center text-sm text-white/70">
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
                  ? "bg-white w-4"
                  : "bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// 2D model types
const MODEL_2D_TYPES = ['live2d', 'pngtuber', '2d-other'] as const;
// 3D model types
const MODEL_3D_TYPES = ['vrm', 'mmd', 'fbx', '3d-other'] as const;

interface ModelCardData {
  id: string;
  name: string;
  version?: string;
  modelType: string;
  thumbnail: string;
  isActive?: boolean;
  specs?: {
    polyCount?: number;
    blendshapes?: number;
  };
}

// Helper to get thumbnail from showcase array (first featured item or first item)
function getThumbnail(showcase?: { media?: { url?: string }; isFeatured?: boolean }[], fallback = "/placeholder-model.png"): string {
  if (!showcase || showcase.length === 0) return fallback;
  const featured = showcase.find(item => item.isFeatured);
  return featured?.media?.url || showcase[0]?.media?.url || fallback;
}

function transformModel(model: Model): ModelCardData {
  return {
    id: model.id,
    name: model.name,
    version: model.version,
    modelType: model.modelType,
    thumbnail: getThumbnail(model.showcase),
    isActive: model.isActive,
    specs: model.technicalSpecs
      ? {
          polyCount: model.technicalSpecs.polyCount,
          blendshapes: model.technicalSpecs.blendshapes,
        }
      : undefined,
  };
}

function VTuberModelsLeft() {
  return <ModelShowcase />;
}

function VTuberModelsRight() {
  const [activeTab, setActiveTab] = useState<ModelTab>("2d");
  const { selectedModel, setSelectedModel } = useModelShowcaseStore();
  const { data: allModels, loading, error } = useModels();

  // Filter models by type (keep full Model objects)
  const filteredModels: Model[] = allModels
    ? allModels.filter((model) =>
        activeTab === "2d"
          ? MODEL_2D_TYPES.includes(model.modelType as typeof MODEL_2D_TYPES[number])
          : MODEL_3D_TYPES.includes(model.modelType as typeof MODEL_3D_TYPES[number])
      )
    : [];

  if (error) {
    console.warn("Failed to fetch models:", error);
  }

  return (
    <div className="flex h-full flex-col p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">VTuber Models</h1>

        {/* Tab switcher */}
        <div className="flex gap-1 rounded-lg bg-white/5 p-1">
          <button
            onClick={() => setActiveTab("2d")}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === "2d"
                ? "bg-white/20 text-white"
                : "text-white/60 hover:text-white",
            )}
          >
            <User className="h-4 w-4" />
            2D
          </button>
          <button
            onClick={() => setActiveTab("3d")}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === "3d"
                ? "bg-white/20 text-white"
                : "text-white/60 hover:text-white",
            )}
          >
            <Box className="h-4 w-4" />
            3D
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white/40" />
        </div>
      )}

      {/* Model grid */}
      {!loading && filteredModels.length > 0 && (
        <div className="grid flex-1 grid-cols-2 gap-4 overflow-y-auto md:grid-cols-3">
          {filteredModels.map((model) => {
            const cardData = transformModel(model);
            return (
              <motion.div
                key={model.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedModel(model)}
                className={cn(
                  "group cursor-pointer overflow-hidden rounded-xl bg-white/5 transition-colors hover:bg-white/10",
                  selectedModel?.id === model.id && "ring-2 ring-blue-500",
                )}
              >
                {/* Thumbnail */}
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={cardData.thumbnail}
                    alt={model.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {model.isActive && (
                    <div className="absolute right-2 top-2 rounded-full bg-green-500/90 px-2 py-0.5 text-xs font-medium text-white">
                      Active
                    </div>
                  )}
                  {/* Model type badge */}
                  <div className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white uppercase">
                    {model.modelType}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-medium text-white">{model.name}</h3>
                  {model.version && (
                    <p className="text-sm text-white/60">v{model.version}</p>
                  )}
                  {cardData.specs?.polyCount && (
                    <p className="text-sm text-white/60">
                      {cardData.specs.polyCount.toLocaleString()} polys
                    </p>
                  )}
                </div>

                {/* View button */}
                <div className="flex items-center justify-end border-t border-white/5 p-2">
                  <span className="flex items-center gap-1 text-xs text-white/60 group-hover:text-white">
                    View <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredModels.length === 0 && (
        <div className="flex flex-1 items-center justify-center text-white/40">
          No models found
        </div>
      )}
    </div>
  );
}

export const VTuberModelsPage: PageContent = {
  Left: VTuberModelsLeft,
  Right: VTuberModelsRight,
};
