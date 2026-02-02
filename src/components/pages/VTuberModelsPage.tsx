"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ChevronRight, User, Box, Loader2 } from "lucide-react";
import type { PageContent } from "@/components/layout/BookLayout";
import { useModels, type Model, type Media, getMedia, nullToUndefined } from "@/hooks/useCMS";
import { useModelShowcaseStore } from "@/stores/modelShowcaseStore";
import { ModelShowcase } from "@/components/models/ModelShowcase";
import { MODEL_2D_TYPES, MODEL_3D_TYPES } from "@/constants/models";

type ModelTab = "2d" | "3d";

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
function getThumbnail(showcase: Model['showcase'], fallback = "/placeholder-model.png"): string {
  if (!showcase || showcase.length === 0) return fallback;
  const featured = showcase.find(item => item.isFeatured);
  const targetItem = featured || showcase[0];
  const media = getMedia(targetItem?.media);
  return media?.url || fallback;
}

function transformModel(model: Model): ModelCardData {
  return {
    id: String(model.id),
    name: model.name,
    version: nullToUndefined(model.version),
    modelType: model.modelType,
    thumbnail: getThumbnail(model.showcase),
    isActive: nullToUndefined(model.isActive),
    specs: model.technicalSpecs
      ? {
          polyCount: nullToUndefined(model.technicalSpecs.polyCount),
          blendshapes: nullToUndefined(model.technicalSpecs.blendshapes),
        }
      : undefined,
  };
}

function VTuberModelsLeft() {
  const model = useModelShowcaseStore((state) => state.selectedModel);
  return <ModelShowcase model={model} />;
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
        <h1 className="text-2xl font-bold text-(--page-text)">VTuber Models</h1>

        {/* Tab switcher */}
        <div className="flex gap-1 rounded-lg bg-(--page-surface)/5 p-1">
          <button
            onClick={() => setActiveTab("2d")}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === "2d"
                ? "bg-(--page-surface)/20 text-(--page-text)"
                : "text-(--page-text)/60 hover:text-(--page-text)",
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
                ? "bg-(--page-surface)/20 text-(--page-text)"
                : "text-(--page-text)/60 hover:text-(--page-text)",
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
          <Loader2 className="h-8 w-8 animate-spin text-(--page-text)/40" />
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
                  "group cursor-pointer overflow-hidden rounded-xl bg-(--page-surface)/5 transition-colors hover:bg-(--page-surface)/10",
                  selectedModel?.id === model.id && "ring-2 ring-(--page-primary)",
                )}
              >
                {/* Thumbnail */}
                <div className="relative aspect-3/4 w-full overflow-hidden">
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
                  <h3 className="font-medium text-(--page-text)">{model.name}</h3>
                  {model.version && (
                    <p className="text-sm text-(--page-text)/60">v{model.version}</p>
                  )}
                  {cardData.specs?.polyCount && (
                    <p className="text-sm text-(--page-text)/60">
                      {cardData.specs.polyCount.toLocaleString()} polys
                    </p>
                  )}
                </div>

                {/* View button */}
                <div className="flex items-center justify-end border-t border-(--page-surface)/5 p-2">
                  <span className="flex items-center gap-1 text-xs text-(--page-text)/60 group-hover:text-(--page-text)">
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
        <div className="flex flex-1 items-center justify-center text-(--page-text)/40">
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
