import { NextResponse } from 'next/server'
import type { Where } from 'payload'
import {
  parseQueryParams,
  buildWhereClause,
  buildSort,
  getPagination,
  buildPaginatedResponse,
  COLLECTION_COLUMNS,
} from '@/lib/api'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = parseQueryParams(searchParams)

    // Legacy params
    const status = searchParams.get('status') || 'published'
    const postType = searchParams.get('postType')

    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)
    const payload = await getPayload({ config })

    // Base where clause
    const baseWhere: Where = {}

    if (status !== 'all') {
      baseWhere.status = { equals: status }
    }

    if (postType) {
      baseWhere.postType = { equals: postType }
    }

    const columns = COLLECTION_COLUMNS.posts
    const where = buildWhereClause(queryParams, columns, baseWhere)
    const sort = buildSort(queryParams, '-publishedAt')
    const { limit, page } = getPagination(queryParams)

    const result = await payload.find({
      collection: 'posts',
      where,
      depth: 2,
      limit,
      page,
      sort,
    })

    return NextResponse.json(
      buildPaginatedResponse(result.docs, result.totalDocs, page, limit)
    )
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
