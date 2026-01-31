import { create } from 'zustand'
import type { Model } from '@/hooks/useCMS'

interface ModelShowcaseState {
  selectedModel: Model | null
  setSelectedModel: (model: Model | null) => void
}

export const useModelShowcaseStore = create<ModelShowcaseState>((set) => ({
  selectedModel: null,
  setSelectedModel: (model) => set({ selectedModel: model }),
}))
