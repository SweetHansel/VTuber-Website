import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')

    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)
    const payload = await getPayload({ config })

    if (location) {
      // Fetch by location (unique key)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { docs } = await (payload as any).find({
        collection: 'interactive-media',
        where: {
          location: { equals: location },
        },
        depth: 2, // Resolve media relationships
        limit: 1,
      })

      if (docs.length === 0) {
        return NextResponse.json({ data: null }, { status: 404 })
      }

      return NextResponse.json({ data: docs[0] })
    }

    // Fetch all
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { docs } = await (payload as any).find({
      collection: 'interactive-media',
      depth: 2,
      limit: 100,
    })

    return NextResponse.json({ data: docs })
  } catch (error) {
    console.error('Failed to fetch interactive media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch interactive media' },
      { status: 500 }
    )
  }
}
