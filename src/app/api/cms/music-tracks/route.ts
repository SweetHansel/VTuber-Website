import { NextResponse } from 'next/server'
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

    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)
    const payload = await getPayload({ config })

    const columns = COLLECTION_COLUMNS['music-tracks']
    const where = buildWhereClause(queryParams, columns)
    const sort = buildSort(queryParams, '-releaseDate')
    const { limit, page } = getPagination(queryParams)

    const result = await payload.find({
      collection: 'music-tracks',
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
    console.error('Failed to fetch music tracks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch music tracks' },
      { status: 500 }
    )
  }
}
