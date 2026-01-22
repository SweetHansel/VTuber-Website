import type { CollectionConfig } from 'payload'

export const Albums: CollectionConfig = {
  slug: 'albums',
  admin: {
    useAsTitle: 'title',
    group: 'Ungrouped',
    defaultColumns: ['title', 'albumType', 'releaseDate'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'albumType',
      type: 'select',
      options: [
        { label: 'Single', value: 'single' },
        { label: 'EP', value: 'ep' },
        { label: 'Album', value: 'album' },
        { label: 'Compilation', value: 'compilation' },
      ],
      required: true,
    },
    {
      name: 'coverArt',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'tracks',
      type: 'relationship',
      relationTo: 'music-tracks',
      hasMany: true,
    },
    {
      name: 'releaseDate',
      type: 'date',
    },
    {
      name: 'streamingLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'YouTube', value: 'youtube' },
            { label: 'Spotify', value: 'spotify' },
            { label: 'Apple Music', value: 'apple-music' },
            { label: 'Bandcamp', value: 'bandcamp' },
            { label: 'Other', value: 'other' },
          ],
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
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
  ],
}
