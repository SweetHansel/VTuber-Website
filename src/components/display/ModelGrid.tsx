"use client";

import { motion } from "framer-motion";
import { type Model } from "@/hooks/useCMS";
import { ModelCard } from "./ModelCard";
import { ScrollContainer } from "../layout";
import { staggerContainer, staggerItem } from "@/constants/animations";

interface ModelGridProps {
  models: Model[];
  selectedModelId?: number;
  onSelect?: (model: Model) => void;
}

export function ModelGrid({ models, selectedModelId, onSelect }: ModelGridProps) {
  if (models.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-(--page-text)/40">
        No models found
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-(--page-surface)/5 scrollbar-thumb-(--page-surface)/20">
      <ScrollContainer>
        <motion.div
          className="grid grid-cols-4 gap-4 p-4"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {Array(1)
            .fill(models)
            .flat()
            .map((model, i) => (
              <motion.div key={`${model.id}-${i}`} variants={staggerItem}>
                <ModelCard
                  model={model}
                  selected={selectedModelId === model.id}
                  onClick={() => onSelect?.(model)}
                />
              </motion.div>
            ))}
        </motion.div>
      </ScrollContainer>
    </div>
  );
}
