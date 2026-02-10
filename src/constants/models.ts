// Model type constants
// Used in: VTuberModelsPage, api/cms/models, Modal

import type { Model } from '@/payload-types'

export type ModelType = Model['modelType']

/**
 * Color classes for model type badges
 */
export const MODEL_TYPE_COLORS: Record<ModelType, string> = {
  live2d: 'bg-blue-500 text-white',
  pngtuber: 'bg-blue-500 text-white',
  '2d-other': 'bg-blue-500 text-white',
  vrm: 'bg-purple-500 text-white',
  mmd: 'bg-purple-500 text-white',
  fbx: 'bg-purple-500 text-white',
  '3d-other': 'bg-purple-500 text-white',
}

const allTypes = Object.keys(MODEL_TYPE_COLORS) as ModelType[]

export const MODEL_2D_TYPES = allTypes.filter(t => ['live2d', 'pngtuber', '2d-other'].includes(t))
export const MODEL_3D_TYPES = allTypes.filter(t => ['vrm', 'mmd', 'fbx', '3d-other'].includes(t))

/**
 * Check if a model type is 3D
 */
export function is3DModelType(modelType: string): boolean {
  return MODEL_3D_TYPES.includes(modelType as ModelType)
}
