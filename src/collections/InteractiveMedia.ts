import type { CollectionConfig, Field } from 'payload'

// Group field definitions for reuse
const createMediaStateFields = (name: string, description: string, required = false): Field => ({
  name,
  type: 'group',
  admin: {
    description,
  },
  fields: [
    ...(required ? [] : [{
      name: 'enabled',
      type: 'checkbox' as const,
      defaultValue: false,
      admin: {
        description: `Enable ${name} state`,
      },
    }]),
    {
      name: 'media',
      type: 'upload' as const,
      relationTo: 'media' as const,
      required,
      admin: {
        description: 'Image or GIF to display',
        ...(required ? {} : {
          condition: (_data: Record<string, unknown>, siblingData: Record<string, unknown>) => siblingData?.enabled === true,
        }),
      },
    },
    {
      name: 'alt',
      type: 'text' as const,
      admin: {
        description: 'Alt text for accessibility',
        ...(required ? {} : {
          condition: (_data: Record<string, unknown>, siblingData: Record<string, unknown>) => siblingData?.enabled === true,
        }),
      },
    },
    {
      name: 'sound',
      type: 'upload' as const,
      relationTo: 'media' as const,
      admin: {
        description: 'Sound effect to play (audio file)',
        ...(required ? {} : {
          condition: (_data: Record<string, unknown>, siblingData: Record<string, unknown>) => siblingData?.enabled === true,
        }),
      },
    },
  ],
})

export const InteractiveMedia: CollectionConfig = {
  slug: 'interactive-media',
  admin: {
    useAsTitle: 'name',
    group: 'Site',
    defaultColumns: ['name', 'location', 'updatedAt'],
    description: 'Interactive media elements with state-based visuals (hover, click effects)',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name for admin panel',
      },
    },
    {
      name: 'location',
      type: 'select',
      required: true,
      unique: true,
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
    // Default state (required)
    createMediaStateFields('defaultState', 'Default/idle state (required)', true),
    // Hover state (optional)
    createMediaStateFields('hoverState', 'Hover state - shown when mouse hovers over element'),
    // Click state (optional)
    createMediaStateFields('clickState', 'Click state - shown when element is clicked'),
    // Cursor effect (optional)
    {
      name: 'cursorEffect',
      type: 'group',
      admin: {
        description: 'Spawn particles/effects at cursor position on interaction',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable cursor effect',
          },
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media' as const,
          admin: {
            description: 'GIF or image to spawn at cursor (e.g., heart, star)',
            condition: (_data, siblingData) => siblingData?.enabled === true,
          },
        },
        {
          name: 'duration',
          type: 'number',
          defaultValue: 1000,
          admin: {
            description: 'How long the effect shows (milliseconds)',
            condition: (_data, siblingData) => siblingData?.enabled === true,
          },
        },
        {
          name: 'size',
          type: 'number',
          defaultValue: 40,
          admin: {
            description: 'Size of cursor effect in pixels',
            condition: (_data, siblingData) => siblingData?.enabled === true,
          },
        },
      ],
    },
    {
      name: 'depth',
      type: 'number',
      defaultValue: -20,
      admin: {
        description: 'CSS translateZ depth for 3D effect (negative = behind)',
      },
    },
  ],
}
