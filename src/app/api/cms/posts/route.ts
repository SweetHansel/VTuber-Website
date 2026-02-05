import { NextResponse } from 'next/server'
import type { Where } from 'payload'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'published'
    const postType = searchParams.get('postType')
    const limit = Number.parseInt(searchParams.get('limit') || '50')

    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)
    const payload = await getPayload({ config })

    const where: Where = {}

    // Filter by status unless 'all' is specified
    if (status !== 'all') {
      where.status = { equals: status }
    }

    // Filter by postType if specified
    if (postType) {
      where.postType = { equals: postType }
    }

    const { docs } = await payload.find({
      collection: 'posts',
      where,
      depth: 2,
      limit,
      sort: '-publishedAt',
    })

    return NextResponse.json({ data: docs })
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
