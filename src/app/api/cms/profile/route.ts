import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)
    const payload = await getPayload({ config })

    const profile = await payload.findGlobal({
      slug: 'profile',
      depth: 3, // Resolve person.socials and currentModel.showcase relationships
    })

    return NextResponse.json({ data: profile })
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
