// Model type constants - single source of truth
// Used in: VTuberModelsPage, api/cms/models, Modal

export const MODEL_2D_TYPES = ['live2d', 'pngtuber', '2d-other'] as const
export const MODEL_3D_TYPES = ['vrm', 'mmd', 'fbx', '3d-other'] as const

export type Model2DType = typeof MODEL_2D_TYPES[number]
export type Model3DType = typeof MODEL_3D_TYPES[number]
export type ModelType = Model2DType | Model3DType

/**
 * Check if a model type is 3D
 */
export function is3DModelType(modelType: string): boolean {
  return MODEL_3D_TYPES.includes(modelType as Model3DType)
}

/**
 * Check if a model type is 2D
 */
export function is2DModelType(modelType: string): boolean {
  return MODEL_2D_TYPES.includes(modelType as Model2DType)
}
