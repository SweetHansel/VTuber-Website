'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainerVariants, staggerItemVariants } from '@/animations'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ChevronRight, User, Box } from 'lucide-react'

type ModelTab = 'live2d' | '3d'

// Mock data - will be replaced with CMS data
const mockModels = {
  live2d: [
    {
      id: '1',
      name: 'Default Model',
      version: '2.0',
      thumbnail: '/placeholder-live2d.png',
      isActive: true,
      debutDate: '2025-01-01',
    },
    {
      id: '2',
      name: 'Summer Outfit',
      version: '2.0 Summer',
      thumbnail: '/placeholder-live2d-summer.png',
      isActive: false,
      debutDate: '2025-07-01',
    },
  ],
  '3d': [
    {
      id: '1',
      name: 'VRM Model',
      thumbnail: '/placeholder-vrm.png',
      isActive: true,
      specs: {
        polyCount: 50000,
        blendshapes: 52,
      },
    },
  ],
}

export function VTuberModelsPage() {
  const [activeTab, setActiveTab] = useState<ModelTab>('live2d')
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  const models = mockModels[activeTab]

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

      {/* Model grid */}
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
              {'version' in model && (
                <p className="text-sm text-white/60">v{model.version}</p>
              )}
              {'specs' in model && model.specs && (
                <p className="text-sm text-white/60">
                  {model.specs.polyCount?.toLocaleString()} polys
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
