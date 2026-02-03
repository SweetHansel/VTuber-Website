import type { CollectionConfig } from 'payload'

// Helper to extract plain text from Lexical rich text content
function extractPlainText(content: unknown): string {
  if (!content || typeof content !== 'object') return ''

  const root = (content as { root?: unknown }).root
  if (!root || typeof root !== 'object') return ''

  const children = (root as { children?: unknown[] }).children
  if (!Array.isArray(children)) return ''

  let text = ''

  function traverse(nodes: unknown[]) {
    for (const node of nodes) {
      if (!node || typeof node !== 'object') continue

      const nodeObj = node as { type?: string; text?: string; children?: unknown[] }

      if (nodeObj.type === 'text' && typeof nodeObj.text === 'string') {
        text += nodeObj.text
      }

      if (Array.isArray(nodeObj.children)) {
        traverse(nodeObj.children)
      }

      // Add space after paragraphs
      if (nodeObj.type === 'paragraph') {
        text += ' '
      }
    }
  }

  traverse(children)
  return text.trim()
}

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'status', 'publishedAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate excerpt if empty
        if (data && !data.excerpt && data.content) {
          const plainText = extractPlainText(data.content)
          if (plainText) {
            // Take first 150 characters, trim to last word boundary
            let excerpt = plainText.slice(0, 150)
            if (plainText.length > 150) {
              const lastSpace = excerpt.lastIndexOf(' ')
              if (lastSpace > 100) {
                excerpt = excerpt.slice(0, lastSpace)
              }
              excerpt += '...'
            }
            data.excerpt = excerpt
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the title',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Brief summary for cards and previews (auto-generated from content if left empty)',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
