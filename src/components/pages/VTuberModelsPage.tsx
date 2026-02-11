"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { User, Box, Loader2 } from "lucide-react";
import type { LRProps } from "@/components/layout/BookLayout";
import { useModels, type Model } from "@/hooks/useCMS";
import { useModelShowcaseStore } from "@/stores/modelShowcaseStore";
import { ModelShowcase } from "@/components/display/ModelShowcase";
import { ModelGrid } from "@/components/display/ModelGrid";
import { is3DModelType } from "@/constants/models";
import { useMotionValueState } from "@/hooks/useMotionValueState";

type ModelTab = "2d" | "3d";

function VTuberModelsLeft() {
  const model = useModelShowcaseStore((state) => state.selectedModel);
  return (
    <div className="h-full w-full p-4 ">
      <ModelShowcase model={model} />
    </div>
  );
}

function VTuberModelsRight({ index }: Readonly<LRProps>) {
  const currentPage = useMotionValueState(index);
  const isVisible = currentPage > 0 && currentPage < 1;

  const [activeTab, setActiveTab] = useState<ModelTab>("2d");
  const { selectedModel, setSelectedModel } = useModelShowcaseStore();
  const { data: allModels, loading } = useModels(undefined, { skip: !isVisible });

  const filteredModels: Model[] = allModels
    ? allModels.filter((model) =>
        activeTab === "2d"
          ? !is3DModelType(model.modelType)
          : is3DModelType(model.modelType),
      )
    : [];

  return (
    <div className="relative flex h-full w-full flex-col p-4 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between rounded-xl bg-(--page-surface)/5 px-4 py-3">
        <h1 className="text-2xl font-bold text-(--page-text)">Models</h1>

        {/* Tab switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("2d")}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-base font-medium transition-colors",
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
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-base font-medium transition-colors",
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
      {!allModels && loading && (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-(--page-text)/40" />
        </div>
      )}

      {/* Model grid */}
      {allModels && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="flex-1 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <ModelGrid
              models={filteredModels}
              selectedModelId={selectedModel?.id}
              onSelect={setSelectedModel}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export const VTuberModelsPage = [VTuberModelsLeft, VTuberModelsRight];
