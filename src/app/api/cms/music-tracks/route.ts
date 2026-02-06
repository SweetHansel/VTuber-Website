import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)
    const payload = await getPayload({ config })

    // Fetch all music tracks - filtering happens client-side
    const { docs } = await payload.find({
      collection: 'music-tracks',
      depth: 2, // Resolve media and album relationships
      limit: 100, // Increased limit for all data
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
