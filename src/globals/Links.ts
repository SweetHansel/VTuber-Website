import type { GlobalConfig } from 'payload'

export const Links: GlobalConfig = {
  slug: 'links',
  admin: {
    group: 'Site',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Logo or icon for the link',
          },
        },
      ],
    },
  ],
}
