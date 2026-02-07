import type { CollectionConfig } from 'payload'
import { slugify } from '@/lib/utils'
import { extractPlainText } from '@/components/richtext/RichTextRenderer'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'postType', 'status', 'isPinned', 'publishedAt'],
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
        if (!data) return data

        // Auto-generate slug from title if not provided
        if (!data.slug && data.title) {
          data.slug = slugify(data.title)
        }

        // Auto-generate excerpt from content if empty
        if (!data.excerpt && data.content) {
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
      unique: true,
      admin: {
        description: 'URL-friendly version of the title (auto-generated if left empty)',
      },
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
      name: 'isPinned',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Pin to top of updates feed',
      },
    },
    {
      name: 'postType',
      type: 'select',
      options: [
        { label: 'Blog', value: 'blog' },
        { label: 'Stream Schedule', value: 'stream' },
        { label: 'Event', value: 'event' },
        { label: 'Release', value: 'release' },
        { label: 'Collab', value: 'collab' },
        { label: 'General', value: 'general' },
      ],
      defaultValue: 'general',
      required: true,
    },
    {
      name: 'featuredImages',
      type: 'array',
      admin: {
        description: 'Featured images for the post (first image shown as thumbnail)',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Brief summary for cards and previews (auto-generated from content if left empty)',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When this post was published',
      },
    },
    {
      name: 'eventDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'For events/streams: when the event takes place',
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'Platform or venue (e.g., "YouTube Live", "Tokyo")',
      },
    },
    {
      name: 'externalLinks',
      type: 'array',
      admin: {
        description: 'External links related to this post',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'featuredPeople',
      type: 'relationship',
      relationTo: 'people',
      hasMany: true,
      admin: {
        description: 'People featured in this post',
      },
    },
    {
      name: 'credits',
      type: 'array',
      admin: {
        description: 'Credits for contributors (use person relationship or name text)',
      },
      fields: [
        {
          name: 'role',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., "Director", "Artist", "Editor"',
          },
        },
        {
          name: 'person',
          type: 'relationship',
          relationTo: 'people',
          admin: {
            description: 'Link to person in CMS (optional)',
          },
        },
        {
          name: 'name',
          type: 'text',
          admin: {
            description: 'Name text if person not in CMS',
          },
        },
      ],
    },
  ],
}
