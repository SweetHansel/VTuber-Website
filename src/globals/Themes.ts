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
        components: {
          Field: '/components/admin/ColorPicker#ColorPicker',
        },
      },
    },
    {
      name: 'secondaryColor',
      type: 'text',
      admin: {
        description: 'Secondary color (hex)',
        components: {
          Field: '/components/admin/ColorPicker#ColorPicker',
        },
      },
    },
    {
      name: 'accentColor',
      type: 'text',
      admin: {
        description: 'Accent color (hex)',
        components: {
          Field: '/components/admin/ColorPicker#ColorPicker',
        },
      },
    },
    {
      name: 'interactiveMedia',
      type: 'array',
      admin: {
        description: 'Assign interactive media configurations to layout slots',
      },
      fields: [
        {
          name: 'slot',
          type: 'select',
          required: true,
          options: [
            { label: 'Landing - Main Character', value: 'landing-character' },
            { label: 'Landing - Left Panel', value: 'landing-left' },
            { label: 'Page - Artworks', value: 'page-artworks' },
            { label: 'Page - Discography', value: 'page-discography' },
            { label: 'Page - About', value: 'page-about' },
            { label: 'Page - Models', value: 'page-models' },
          ],
          admin: {
            description: 'Which layout slot this media appears in',
          },
        },
        {
          name: 'configuration',
          type: 'relationship',
          // Note: 'interactive-media' will be available after running payload generate:importmap
          relationTo: 'interactive-media' as 'media',
          required: true,
          admin: {
            description: 'Interactive media configuration to use',
          },
        },
      ],
    },
  ],
}
