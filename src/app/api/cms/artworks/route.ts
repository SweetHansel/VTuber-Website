import { NextResponse } from 'next/server'
import type { Where } from 'payload'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')

    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)
    const payload = await getPayload({ config })

    const whereClause: Where = {
      isNsfw: { equals: false }, // Filter out NSFW by default
    }

    if (featured === 'true') {
      whereClause.isFeatured = { equals: true }
    }

    // Fetch all artworks - filtering happens client-side
    const { docs } = await payload.find({
      collection: 'artworks',
      where: whereClause,
      depth: 2, // Resolve media and relationships
      limit: 100, // Increased limit for all data
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
