import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    group: 'Site',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'mainNav',
      type: 'array',
      admin: {
        description: 'Main navigation items',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'section',
          type: 'select',
          options: [
            { label: 'About', value: 'about' },
            { label: 'Artworks', value: 'artworks' },
            { label: 'Discography', value: 'discography' },
            { label: 'VTuber Models', value: 'vtuber-models' },
          ],
          required: true,
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Lucide icon name',
          },
        },
      ],
    },
    {
      name: 'footerLinks',
      type: 'array',
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
        {
          name: 'isExternal',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
}
