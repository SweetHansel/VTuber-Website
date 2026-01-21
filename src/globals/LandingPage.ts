import type { GlobalConfig } from 'payload'

export const LandingPage: GlobalConfig = {
  slug: 'landing-page',
  admin: {
    group: 'Site',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'animatedArtworks',
      type: 'array',
      admin: {
        description: 'Floating animated artworks displayed on the landing page',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'position',
          type: 'select',
          options: [
            { label: 'Right Upper', value: 'right-upper' },
            { label: 'Artworks Page Left', value: 'artworks-left' },
            { label: 'Discography Page Right', value: 'discography-right' },
          ],
          required: true,
        },
        {
          name: 'size',
          type: 'group',
          fields: [
            {
              name: 'width',
              type: 'number',
              admin: {
                description: 'Width in pixels',
              },
            },
            {
              name: 'height',
              type: 'number',
              admin: {
                description: 'Height in pixels (optional, maintains aspect ratio)',
              },
            },
          ],
        },
        {
          name: 'animation',
          type: 'group',
          fields: [
            {
              name: 'type',
              type: 'select',
              options: [
                { label: 'Float', value: 'float' },
                { label: 'Bounce', value: 'bounce' },
                { label: 'Sway', value: 'sway' },
                { label: 'Pulse', value: 'pulse' },
                { label: 'None', value: 'none' },
              ],
              defaultValue: 'float',
            },
            {
              name: 'duration',
              type: 'number',
              defaultValue: 4,
              admin: {
                description: 'Animation duration in seconds',
              },
            },
            {
              name: 'delay',
              type: 'number',
              defaultValue: 0,
              admin: {
                description: 'Animation delay in seconds',
              },
            },
            {
              name: 'amplitude',
              type: 'number',
              defaultValue: 8,
              admin: {
                description: 'Movement amount in pixels',
              },
            },
          ],
        },
        {
          name: 'depth',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Z-depth for 2.5D effect (negative = back, positive = front)',
          },
        },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'welcomeMessage',
      type: 'richText',
    },
  ],
}
