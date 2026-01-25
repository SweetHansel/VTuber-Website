import { NextResponse } from 'next/server'
import type { Where } from 'payload'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const trackType = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')

    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)
    const payload = await getPayload({ config })

    const whereClause: Where = {}

    if (trackType && trackType !== 'all') {
      if (trackType === 'covers') {
        whereClause.trackType = { equals: 'cover' }
      } else if (trackType === 'originals') {
        whereClause.trackType = { in: ['original', 'remix'] }
      } else {
        whereClause.trackType = { equals: trackType }
      }
    }

    const { docs } = await payload.find({
      collection: 'music-tracks',
      where: whereClause,
      depth: 2, // Resolve media and album relationships
      limit,
      sort: '-releaseDate',
    })

    return NextResponse.json({ data: docs })
  } catch (error) {
    console.error('Failed to fetch music tracks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch music tracks' },
      { status: 500 }
    )
  }
}
