import type { CollectionConfig } from 'payload'

export const Artworks: CollectionConfig = {
  slug: 'artworks',
  admin: {
    useAsTitle: 'title',
    group: 'Gallery',
    defaultColumns: ['title', 'artworkType', 'artist', 'createdAt'],
  },
  access: {
    read: () => true,
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
        { label: 'Meme', value: 'meme' },
        { label: 'Screenshot', value: 'screenshot' },
      ],
      required: true,
    },
    {
      name: 'artist',
      type: 'relationship',
      relationTo: 'artists',
      admin: {
        description: 'Credit the artist',
      },
    },
    {
      name: 'artistName',
      type: 'text',
      admin: {
        description: 'Manual artist name if not in artists collection',
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
