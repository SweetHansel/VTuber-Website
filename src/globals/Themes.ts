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
  ],
}
