import { NextResponse } from 'next/server'

interface UpdateItem {
  id: string
  type: 'announcement' | 'blog-post'
  title: string
  excerpt?: string
  image?: string
  date?: string
  eventDate?: string
  location?: string
  announcementType?: string
  isPinned?: boolean
  externalLink?: string
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'
    const limit = parseInt(searchParams.get('limit') || '20')

    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)
    const payload = await getPayload({ config })

    const updates: UpdateItem[] = []

    // Fetch announcements if not filtering to blogs only
    if (filter === 'all' || filter === 'announcements') {
      const now = new Date().toISOString()
      const { docs: announcements } = await payload.find({
        collection: 'announcements',
        where: {
          or: [
            { expiresAt: { exists: false } },
            { expiresAt: { greater_than: now } },
          ],
        },
        depth: 2,
        limit,
        sort: '-eventDate',
      })

      for (const ann of announcements) {
        updates.push({
          id: String(ann.id),
          type: 'announcement',
          title: ann.title,
          excerpt: ann.description ? extractText(ann.description) : undefined,
          image: typeof ann.featuredImage === 'object' && ann.featuredImage !== null
            ? (ann.featuredImage as { url?: string }).url
            : undefined,
          eventDate: ann.eventDate || undefined,
          date: ann.createdAt,
          location: ann.location || undefined,
          announcementType: ann.type,
          isPinned: ann.isPinned || false,
          externalLink: ann.externalLink || undefined,
        })
      }
    }

    // Fetch blog posts if not filtering to announcements only
    if (filter === 'all' || filter === 'blogs') {
      const { docs: blogPosts } = await payload.find({
        collection: 'blog-posts',
        where: {
          status: { equals: 'published' },
        },
        depth: 2,
        limit,
        sort: '-publishedAt',
      })

      for (const post of blogPosts) {
        updates.push({
          id: String(post.id),
          type: 'blog-post',
          title: post.title,
          excerpt: post.excerpt || (post.content ? extractText(post.content) : undefined),
          image: typeof post.featuredImage === 'object' && post.featuredImage !== null
            ? (post.featuredImage as { url?: string }).url
            : undefined,
          date: post.publishedAt || post.createdAt,
        })
      }
    }

    // Sort: pinned first, then by date
    updates.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      const dateA = new Date(a.eventDate || a.date || 0)
      const dateB = new Date(b.eventDate || b.date || 0)
      return dateB.getTime() - dateA.getTime()
    })

    return NextResponse.json({ data: updates.slice(0, limit) })
  } catch (error) {
    console.error('Failed to fetch updates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch updates' },
      { status: 500 }
    )
  }
}

// Helper to extract plain text from rich text content
function extractText(content: unknown, maxLength = 150): string {
  if (!content) return ''

  // Handle Lexical rich text format
  if (typeof content === 'object' && content !== null && 'root' in content) {
    const root = (content as { root?: { children?: unknown[] } }).root
    if (root?.children) {
      const text = extractTextFromNodes(root.children)
      return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
    }
  }

  // Handle plain string
  if (typeof content === 'string') {
    return content.length > maxLength ? content.slice(0, maxLength) + '...' : content
  }

  return ''
}

function extractTextFromNodes(nodes: unknown[]): string {
  let text = ''
  for (const node of nodes) {
    if (typeof node === 'object' && node !== null) {
      const typedNode = node as { text?: string; children?: unknown[] }
      if (typedNode.text) {
        text += typedNode.text
      }
      if (typedNode.children) {
        text += extractTextFromNodes(typedNode.children)
      }
    }
  }
  return text
}
