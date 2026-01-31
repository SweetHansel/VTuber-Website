import type { CollectionConfig } from 'payload'

export const Artworks: CollectionConfig = {
  slug: 'artworks',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'artworkType', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Optional title for the artwork',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'artworkType',
      type: 'select',
      options: [
        { label: 'Fan Art', value: 'fanart' },
        { label: 'Official', value: 'official' },
        { label: 'Commissioned', value: 'commissioned' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'credits',
      type: 'array',
      admin: {
        description: 'Credits for this artwork',
      },
      fields: [
        {
          name: 'role',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., "Artist", "Illustrator", "Colorist", "Line Art", "Background", "Commissioner"',
          },
        },
        {
          name: 'person',
          type: 'relationship',
          relationTo: 'people',
        },
        {
          name: 'name',
          type: 'text',
          admin: {
            description: 'Manual name if not in people collection',
          },
        },
      ],
    },
    {
      name: 'featuredPeople',
      type: 'relationship',
      relationTo: 'people',
      hasMany: true,
      admin: {
        description: 'People depicted in this artwork',
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      admin: {
        description: 'Link to original post (Twitter, Pixiv, etc.)',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'isNsfw',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature on landing page',
      },
    },
  ],
}
