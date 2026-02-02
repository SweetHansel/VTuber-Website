import type { GlobalConfig } from 'payload'

export const Themes: GlobalConfig = {
  slug: 'themes',
  admin: {
    group: 'Site',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Colors',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'primaryColor',
          type: 'text',
          defaultValue: '#3b82f6',
          admin: {
            description: 'Primary brand color (buttons, links, accents)',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
        {
          name: 'phoneScreenColor',
          type: 'text',
          defaultValue: '#ffffff',
          admin: {
            description: 'Phone screen background color',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
        {
          name: 'pageSurfaceColor',
          type: 'text',
          defaultValue: '#ffffff',
          admin: {
            description: 'Page surface background color',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
      ],
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
            { label: 'Main Character', value: 'main-character' },
            { label: 'Landing - Left', value: 'landing-left' },
            { label: 'Landing - Background', value: 'landing-bg' },
            { label: 'Landing - Bottom Right', value: 'landing-bottom-right' },
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
          relationTo: 'interactive-media',
          required: true,
          admin: {
            description: 'Interactive media configuration to use',
          },
        },
      ],
    },
  ],
}
