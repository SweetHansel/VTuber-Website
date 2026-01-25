'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainerVariants, staggerItemVariants } from '@/animations'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ChevronRight, User, Box, Loader2 } from 'lucide-react'
import type { PageContent } from '@/components/layout/BookLayout'
import { useModels, type Live2DModel, type ThreeDModel } from '@/hooks/useCMS'

type ModelTab = 'live2d' | '3d'

interface ModelCardData {
  id: string
  name: string
  version?: string
  thumbnail: string
  isActive?: boolean
  specs?: {
    polyCount?: number
    blendshapes?: number
  }
}

function transformLive2D(model: Live2DModel): ModelCardData {
  return {
    id: model.id,
    name: model.name,
    version: model.version,
    thumbnail: model.thumbnail?.url || '/placeholder-live2d.png',
    isActive: model.isActive,
  }
}

function transform3D(model: ThreeDModel): ModelCardData {
  return {
    id: model.id,
    name: model.name,
    thumbnail: model.thumbnail?.url || '/placeholder-vrm.png',
    isActive: model.isActive,
    specs: model.technicalSpecs ? {
      polyCount: model.technicalSpecs.polyCount,
      blendshapes: model.technicalSpecs.blendshapes,
    } : undefined,
  }
}

function VTuberModelsLeft() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="text-center text-white">
        <Box className="mx-auto h-16 w-16 mb-4 text-white/60" />
        <h2 className="text-xl font-bold">Model Showcase</h2>
        <p className="text-sm text-white/60 mt-2">Live2D & 3D Models</p>
      </div>
    </div>
  )
}

function VTuberModelsRight() {
  const [activeTab, setActiveTab] = useState<ModelTab>('live2d')
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const { data: cmsModels, loading, error } = useModels()

  // Transform CMS data or use fallback
  const models: ModelCardData[] = cmsModels
    ? activeTab === 'live2d'
      ? (cmsModels.live2d?.length > 0 ? cmsModels.live2d.map(transformLive2D) : [])
      : (cmsModels['3d']?.length > 0 ? cmsModels['3d'].map(transform3D) : [])
    : []

  if (error) {
    console.warn('Failed to fetch models, using fallback data:', error)
  }

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="enter"
      className="flex h-full flex-col p-6"
    >
      {/* Header */}
      <motion.div
        variants={staggerItemVariants}
        className="mb-4 flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-white">VTuber Models</h1>

        {/* Tab switcher */}
        <div className="flex gap-1 rounded-lg bg-white/5 p-1">
          <button
            onClick={() => setActiveTab('live2d')}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              activeTab === 'live2d'
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white'
            )}
          >
            <User className="h-4 w-4" />
            Live2D
          </button>
          <button
            onClick={() => setActiveTab('3d')}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              activeTab === '3d'
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white'
            )}
          >
            <Box className="h-4 w-4" />
            3D
          </button>
        </div>
      </motion.div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white/40" />
        </div>
      )}

      {/* Model grid */}
      {!loading && (
        <motion.div
          variants={staggerItemVariants}
          className="grid flex-1 grid-cols-2 gap-4 overflow-y-auto md:grid-cols-3"
        >
          {models.map((model) => (
            <motion.div
              key={model.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedModel(model.id)}
              className={cn(
                'group cursor-pointer overflow-hidden rounded-xl bg-white/5 transition-colors hover:bg-white/10',
                selectedModel === model.id && 'ring-2 ring-blue-500'
              )}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={model.thumbnail}
                  alt={model.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {model.isActive && (
                  <div className="absolute right-2 top-2 rounded-full bg-green-500/90 px-2 py-0.5 text-xs font-medium text-white">
                    Active
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="font-medium text-white">{model.name}</h3>
                {model.version && (
                  <p className="text-sm text-white/60">v{model.version}</p>
                )}
                {model.specs?.polyCount && (
                  <p className="text-sm text-white/60">
                    {model.specs.polyCount.toLocaleString()} polys
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
          ))}
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && models.length === 0 && (
        <div className="flex flex-1 items-center justify-center text-white/40">
          No models found
        </div>
      )}

      {/* Model viewer placeholder */}
      {selectedModel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl bg-white/5 p-4 text-center text-white/60"
        >
          Model viewer coming soon - Select model ID: {selectedModel}
        </motion.div>
      )}
    </motion.div>
  )
}

export const VTuberModelsPage: PageContent = {
  Left: VTuberModelsLeft,
  Right: VTuberModelsRight,
}
