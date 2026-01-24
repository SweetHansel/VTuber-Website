import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const modelType = searchParams.get('type') // 'live2d' | '3d' | null (all)

    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)
    const payload = await getPayload({ config })

    const result: {
      live2d: unknown[]
      '3d': unknown[]
    } = {
      live2d: [],
      '3d': [],
    }

    // Fetch Live2D models
    if (!modelType || modelType === 'live2d') {
      const { docs: live2dModels } = await payload.find({
        collection: 'live2d-models',
        depth: 2,
        limit: 50,
        sort: '-debutDate',
      })
      result.live2d = live2dModels
    }

    // Fetch 3D models
    if (!modelType || modelType === '3d') {
      const { docs: threeDModels } = await payload.find({
        collection: '3d-models',
        depth: 2,
        limit: 50,
        sort: '-debutDate',
      })
      result['3d'] = threeDModels
    }

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('Failed to fetch models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}
