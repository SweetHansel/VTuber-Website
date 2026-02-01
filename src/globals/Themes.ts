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
      label: 'Base Colors',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'backgroundColor',
          type: 'text',
          defaultValue: '#0a0a0a',
          admin: {
            description: 'Page background color',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
        {
          name: 'foregroundColor',
          type: 'text',
          defaultValue: '#ededed',
          admin: {
            description: 'Text/foreground color',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Brand Colors',
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
          name: 'primaryHoverColor',
          type: 'text',
          defaultValue: '#2563eb',
          admin: {
            description: 'Primary color on hover',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
        {
          name: 'secondaryColor',
          type: 'text',
          defaultValue: '#8b5cf6',
          admin: {
            description: 'Secondary brand color',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
        {
          name: 'accentColor',
          type: 'text',
          defaultValue: '#ec4899',
          admin: {
            description: 'Accent color for highlights',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Surface Colors',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'bgPrimaryColor',
          type: 'text',
          defaultValue: '#1e3a8a',
          admin: {
            description: 'Primary background (cards, panels)',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
        {
          name: 'bgSurfaceColor',
          type: 'text',
          defaultValue: '#172554',
          admin: {
            description: 'Surface background (elevated elements)',
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
