"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { MODEL_TYPE_COLORS, type ModelType } from "@/constants/models";
import { type Model, getMedia, nullToUndefined } from "@/hooks/useCMS";

export interface ModelCardData {
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

/** Get thumbnail from showcase array (first featured item or first item) */
export function getThumbnail(
  showcase: Model["showcase"],
  fallback = "/placeholder-model.png",
): string {
  if (!showcase || showcase.length === 0) return fallback;
  const featured = showcase.find((item) => item.isFeatured);
  const targetItem = featured || showcase[0];
  const media = getMedia(targetItem?.media);
  return media?.url || fallback;
}

export function transformModel(model: Model): ModelCardData {
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

interface ModelCardProps {
  model: Model;
  selected?: boolean;
  onClick?: () => void;
}

export function ModelCard({ model, selected, onClick }: ModelCardProps) {
  const cardData = transformModel(model);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group cursor-pointer overflow-hidden rounded-xl bg-(--page-surface)/5 transition-colors hover:bg-(--page-surface)/10",
        selected && "ring-2 ring-(--page-primary)",
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
          <div className="absolute right-2 top-4 rounded-full bg-green-500/90 px-2 py-0.5 text-base font-medium text-white">
            Active
          </div>
        )}
        {/* Model type badge */}
        <Badge
          label={model.modelType}
          colorClass={MODEL_TYPE_COLORS[model.modelType as ModelType]}
          className="top-4 left-2 relative"
        />
      </div>

      {/* Info */}
      <div className=" p-4 ">
        <h3 className="font-medium text-(--page-text)">{model.name}</h3>
        {model.version && (
          <p className="text-base text-(--page-text)/60">v{model.version}</p>
        )}
      </div>
    </motion.div>
  );
}
