import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')

    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)
    const payload = await getPayload({ config })

    if (location) {
      // First, check if there's a slot assignment in Themes global
      const themes = await payload.findGlobal({
        slug: 'themes',
        depth: 3, // Resolve nested interactive-media relationships
      })

      // Look for a matching slot in Themes
      const themesData = themes as {
        interactiveMedia?: Array<{
          slot: string
          configuration?: unknown
        }>
      }

      const slotAssignment = themesData.interactiveMedia?.find(
        (item) => item.slot === location
      )

      if (slotAssignment?.configuration) {
        // Found in Themes - return the configuration
        return NextResponse.json({ data: slotAssignment.configuration })
      }

      // Fallback: check the interactive-media collection's location field
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { docs } = await (payload as any).find({
        collection: 'interactive-media',
        where: {
          location: { equals: location },
        },
        depth: 2,
        limit: 1,
      })

      if (docs.length === 0) {
        return NextResponse.json({ data: null }, { status: 404 })
      }

      return NextResponse.json({ data: docs[0] })
    }

    // Fetch all from collection
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
