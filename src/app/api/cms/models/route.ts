import { NextResponse } from 'next/server'
import type { Where } from 'payload'
import { MODEL_2D_TYPES, MODEL_3D_TYPES } from '@/constants/models'
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

    // Legacy param for 2D/3D filter
    const filterType = searchParams.get('type')

    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)
    const payload = await getPayload({ config })

    // Base where clause for model type filter
    const baseWhere: Where = {}
    if (filterType === '2d') {
      baseWhere.modelType = { in: MODEL_2D_TYPES }
    } else if (filterType === '3d') {
      baseWhere.modelType = { in: MODEL_3D_TYPES }
    }

    const columns = COLLECTION_COLUMNS.models
    const where = buildWhereClause(queryParams, columns, baseWhere)
    const sort = buildSort(queryParams, '-debutDate')
    const { limit, page } = getPagination(queryParams)

    const result = await payload.find({
      collection: 'models',
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
    console.error('Failed to fetch models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}
