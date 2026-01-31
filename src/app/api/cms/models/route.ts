import { NextResponse } from 'next/server'

// 2D model types
const MODEL_2D_TYPES = ['live2d', 'pngtuber', '2d-other']
// 3D model types
const MODEL_3D_TYPES = ['vrm', 'mmd', 'fbx', '3d-other']

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filterType = searchParams.get('type') // '2d' | '3d' | null (all)

    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)
    const payload = await getPayload({ config })

    // Build where clause based on filter
    let where = {}
    if (filterType === '2d') {
      where = {
        modelType: { in: MODEL_2D_TYPES },
      }
    } else if (filterType === '3d') {
      where = {
        modelType: { in: MODEL_3D_TYPES },
      }
    }

    const { docs: models } = await payload.find({
      collection: 'models',
      depth: 2,
      limit: 100,
      sort: '-debutDate',
      where,
    })

    return NextResponse.json({ data: models })
  } catch (error) {
    console.error('Failed to fetch models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}
