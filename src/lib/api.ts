import type { Where } from 'payload'

/**
 * Column mapping for different collections
 */
export interface ColumnMapping {
  title: string          // name/title field
  date: string           // primary date field
  tags: string           // tags relationship field
  people: string         // people relationship field (if separate from credits)
  credits: string        // credits array field
  creditsPerson: string  // path to person in credits array
}

/**
 * Default column mappings per collection
 */
export const COLLECTION_COLUMNS: Record<string, ColumnMapping> = {
  artworks: {
    title: 'title',
    date: 'createdAt',
    tags: 'tags',
    people: 'artist',
    credits: 'credits',
    creditsPerson: 'credits.artist',
  },
  'music-tracks': {
    title: 'title',
    date: 'releaseDate',
    tags: 'tags',
    people: 'artist',
    credits: 'credits',
    creditsPerson: 'credits.artist',
  },
  models: {
    title: 'name',
    date: 'debutDate',
    tags: 'tags',
    people: 'artist',
    credits: 'credits',
    creditsPerson: 'credits.artist',
  },
  posts: {
    title: 'title',
    date: 'publishedAt',
    tags: 'tags',
    people: 'featuredPeople',
    credits: 'credits',
    creditsPerson: 'credits.person',
  },
}

/**
 * Standardized query parameters
 */
export interface QueryParams {
  // Text search (searches title + tags names + credits/people names)
  search?: string

  // Date range filter
  dateFrom?: string
  dateTo?: string

  // Tags filter (matches if row has ANY of these tags)
  tags?: string[]

  // People filter (matches if row has ANY of these people)
  people?: string[]

  // Pagination
  page?: number
  limit?: number

  // Sort
  sort?: string
  sortDirection?: 'asc' | 'desc'
}

/**
 * Parse URL search params into QueryParams
 */
export function parseQueryParams(searchParams: URLSearchParams): QueryParams {
  const params: QueryParams = {}

  const search = searchParams.get('search')
  if (search) params.search = search

  const dateFrom = searchParams.get('dateFrom')
  if (dateFrom) params.dateFrom = dateFrom

  const dateTo = searchParams.get('dateTo')
  if (dateTo) params.dateTo = dateTo

  const tags = searchParams.get('tags')
  if (tags) params.tags = tags.split(',').filter(Boolean)

  const people = searchParams.get('people')
  if (people) params.people = people.split(',').filter(Boolean)

  const page = searchParams.get('page')
  if (page) params.page = Number.parseInt(page, 10)

  const limit = searchParams.get('limit')
  if (limit) params.limit = Number.parseInt(limit, 10)

  const sort = searchParams.get('sort')
  if (sort) params.sort = sort

  const sortDirection = searchParams.get('sortDirection')
  if (sortDirection === 'asc' || sortDirection === 'desc') {
    params.sortDirection = sortDirection
  }

  return params
}

/**
 * Build Payload where clause from query params
 */
export function buildWhereClause(
  params: QueryParams,
  columns: ColumnMapping,
  baseWhere: Where = {}
): Where {
  const where: Where = { ...baseWhere }
  const andConditions: Where[] = []

  // Text search (OR across title, tags.name, credits.person/artist name)
  if (params.search) {
    const searchConditions: Where[] = [
      { [columns.title]: { contains: params.search } },
      { 'tags.name': { contains: params.search } },
    ]

    // Add credits person/artist name search
    if (columns.creditsPerson) {
      searchConditions.push({
        [`${columns.creditsPerson}.name`]: { contains: params.search },
      })
    }

    // Add credits.name (for non-linked credits)
    searchConditions.push({
      'credits.name': { contains: params.search },
    })

    andConditions.push({ or: searchConditions })
  }

  // Date range filter
  if (params.dateFrom || params.dateTo) {
    const dateCondition: Record<string, string> = {}

    if (params.dateFrom) {
      dateCondition.greater_than_equal = params.dateFrom
    }
    if (params.dateTo) {
      dateCondition.less_than_equal = params.dateTo
    }

    andConditions.push({ [columns.date]: dateCondition } as Where)
  }

  // Tags filter (any tag matches)
  if (params.tags && params.tags.length > 0) {
    andConditions.push({
      [columns.tags]: { in: params.tags },
    })
  }

  // People filter (matches featured people OR people in credits)
  if (params.people && params.people.length > 0) {
    const peopleConditions: Where[] = []

    // Direct people relationship
    if (columns.people) {
      peopleConditions.push({
        [columns.people]: { in: params.people },
      })
    }

    // People in credits
    if (columns.creditsPerson) {
      peopleConditions.push({
        [columns.creditsPerson]: { in: params.people },
      })
    }

    if (peopleConditions.length > 0) {
      andConditions.push({ or: peopleConditions })
    }
  }

  // Combine all conditions
  if (andConditions.length > 0) {
    if (Object.keys(where).length > 0) {
      return { and: [where, ...andConditions] }
    }
    if (andConditions.length === 1) {
      return andConditions[0]
    }
    return { and: andConditions }
  }

  return where
}

/**
 * Build sort string for Payload
 */
export function buildSort(params: QueryParams, defaultSort: string): string {
  if (!params.sort) return defaultSort

  const direction = params.sortDirection === 'asc' ? '' : '-'
  return `${direction}${params.sort}`
}

/**
 * Get pagination options
 */
export function getPagination(params: QueryParams): { limit: number; page: number } {
  return {
    limit: params.limit ?? 100,
    page: params.page ?? 1,
  }
}

/**
 * Standard API response with pagination info
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    totalDocs: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

/**
 * Build paginated response
 */
export function buildPaginatedResponse<T>(
  docs: T[],
  totalDocs: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(totalDocs / limit)

  return {
    data: docs,
    pagination: {
      page,
      limit,
      totalDocs,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }
}
