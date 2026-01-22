import type { GlobalConfig } from 'payload'

export const Themes: GlobalConfig = {
  slug: 'themes',
  admin: {
    group: 'Site',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'primaryColor',
      type: 'text',
      admin: {
        description: 'Primary brand color (hex)',
      },
    },
    {
      name: 'secondaryColor',
      type: 'text',
      admin: {
        description: 'Secondary color (hex)',
      },
    },
    {
      name: 'accentColor',
      type: 'text',
      admin: {
        description: 'Accent color (hex)',
      },
    },
    {
      name: 'landingPageMedia',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Media displayed on the landing page',
      },
    },
    {
      name: 'artworkPageMedia',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Media displayed on the artwork page',
      },
    },
    {
      name: 'musicPageMedia',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Media displayed on the music page',
      },
    },
    {
      name: 'animationSettings',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Float', value: 'float' },
            { label: 'Bounce', value: 'bounce' },
            { label: 'Sway', value: 'sway' },
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
          name: 'amplitude',
          type: 'number',
          defaultValue: 8,
          admin: {
            description: 'Movement amount in pixels',
          },
        },
      ],
    },
  ],
}
