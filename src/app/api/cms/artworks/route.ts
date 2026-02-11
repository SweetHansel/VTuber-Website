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
    const featured = searchParams.get('featured')

    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)
    const payload = await getPayload({ config })

    // Base where clause
    const baseWhere: Where = {}

    if (featured === 'true') {
      baseWhere.isFeatured = { equals: true }
    }

    const columns = COLLECTION_COLUMNS.artworks
    const where = buildWhereClause(queryParams, columns, baseWhere)
    const sort = buildSort(queryParams, '-createdAt')
    const { limit, page } = getPagination(queryParams)

    const result = await payload.find({
      collection: 'artworks',
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
    console.error('Failed to fetch artworks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    )
  }
}
