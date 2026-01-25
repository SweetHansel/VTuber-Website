import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)
    const payload = await getPayload({ config })

    const themes = await payload.findGlobal({
      slug: 'themes',
      depth: 3, // Resolve nested interactive-media relationships
    })

    return NextResponse.json({ data: themes })
  } catch (error) {
    console.error('Failed to fetch themes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch themes' },
      { status: 500 }
    )
  }
}
