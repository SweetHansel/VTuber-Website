import { NextResponse } from 'next/server'
import type { Where } from 'payload'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const artworkType = searchParams.get('type')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '50')

    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)
    const payload = await getPayload({ config })

    const whereClause: Where = {
      isNsfw: { equals: false }, // Filter out NSFW by default
    }

    if (artworkType && artworkType !== 'all') {
      whereClause.artworkType = { equals: artworkType }
    }

    if (featured === 'true') {
      whereClause.isFeatured = { equals: true }
    }

    const { docs } = await payload.find({
      collection: 'artworks',
      where: whereClause,
      depth: 2, // Resolve media and relationships
      limit,
      sort: '-createdAt',
    })

    return NextResponse.json({ data: docs })
  } catch (error) {
    console.error('Failed to fetch artworks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    )
  }
}
