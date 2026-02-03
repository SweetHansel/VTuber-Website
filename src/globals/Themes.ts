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
      label: 'Phone Colors',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'phoneBg',
          type: 'text',
          defaultValue: '#1e3a8a',
          admin: {
            description: 'Phone background color',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
        {
          name: 'phoneText',
          type: 'text',
          defaultValue: '#ffffff',
          admin: {
            description: 'Phone text color',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
        {
          name: 'phoneSurface',
          type: 'text',
          defaultValue: '#ffffff',
          admin: {
            description: 'Phone card/overlay color (used with opacity)',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
        {
          name: 'phonePrimary',
          type: 'text',
          defaultValue: '#3b82f6',
          admin: {
            description: 'Phone accent color',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Page Colors',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'pageBg',
          type: 'text',
          defaultValue: '#1e3a8a',
          admin: {
            description: 'Page background color',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
        {
          name: 'pageText',
          type: 'text',
          defaultValue: '#ffffff',
          admin: {
            description: 'Page text color',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
        {
          name: 'pageSurface',
          type: 'text',
          defaultValue: '#ffffff',
          admin: {
            description: 'Page card/overlay color (used with opacity)',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
        {
          name: 'pagePrimary',
          type: 'text',
          defaultValue: '#3b82f6',
          admin: {
            description: 'Page accent color',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Modal Colors',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'modalBg',
          type: 'text',
          defaultValue: '#1e293b',
          admin: {
            description: 'Modal background color',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
        {
          name: 'modalText',
          type: 'text',
          defaultValue: '#ffffff',
          admin: {
            description: 'Modal text color',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
        {
          name: 'modalSurface',
          type: 'text',
          defaultValue: '#ffffff',
          admin: {
            description: 'Modal card/overlay color (used with opacity)',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
        {
          name: 'modalPrimary',
          type: 'text',
          defaultValue: '#3b82f6',
          admin: {
            description: 'Modal accent color',
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
