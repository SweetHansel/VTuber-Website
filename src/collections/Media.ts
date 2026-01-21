import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'audio/*', 'video/*', 'application/octet-stream'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 600,
        height: 400,
        position: 'centre',
      },
      {
        name: 'full',
        width: 1920,
        height: undefined,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
    },
    {
      name: 'credits',
      type: 'text',
      admin: {
        description: 'Attribution for the media',
      },
    },
  ],
}
