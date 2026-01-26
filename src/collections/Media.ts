import type { CollectionConfig } from 'payload'

const useVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Asset',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  upload: {
    // Only use local staticDir when NOT using Vercel Blob
    // Vercel Blob adapter handles storage and URL generation
    ...(useVercelBlob ? {} : { staticDir: '../media' }),
    disableLocalStorage: useVercelBlob,
    mimeTypes: ['image/*', 'audio/*', 'video/*'],
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
