import type { GlobalConfig } from 'payload'

export const Profile: GlobalConfig = {
  slug: 'profile',
  admin: {
    group: 'Content',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'person',
      type: 'relationship',
      relationTo: 'people',
      admin: {
        description: 'Link to person profile (provides name, avatar, socials)',
      },
    },
    {
      name: 'currentModel',
      type: 'relationship',
      relationTo: 'models',
      admin: {
        description: 'Currently active model for site display',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'alternateName',
      type: 'text',
      admin: {
        description: 'Alternate name (e.g., Japanese, nickname, stage name)',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'Short catchphrase or title',
      },
    },
    {
      name: 'shortBio',
      type: 'textarea',
      admin: {
        description: 'Brief bio for cards and previews',
      },
    },
    {
      name: 'debutDate',
      type: 'date',
      admin: {
        description: 'VTuber debut date',
      },
    },
    {
      name: 'birthday',
      type: 'date',
      admin: {
        description: 'Character birthday',
      },
    },
    {
      name: 'height',
      type: 'text',
      admin: {
        description: 'e.g., "160cm"',
      },
    },
    {
      name: 'traits',
      type: 'array',
      admin: {
        description: 'Dynamic personality traits (e.g., Hobbies, Likes, Dislikes, Food, Games)',
      },
      fields: [
        {
          name: 'category',
          type: 'text',
          required: true,
          admin: {
            description: 'Category name (e.g., "Hobbies", "Likes", "Dislikes")',
          },
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Lucide icon name',
          },
        },
        {
          name: 'color',
          type: 'text',
          admin: {
            description: 'Hex color for UI',
            components: {
              Field: '/components/admin/ColorPicker#ColorPicker',
            },
          },
        },
        {
          name: 'items',
          type: 'array',
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'hashtags',
      type: 'array',
      admin: {
        description: 'Hashtags and fan terms',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., "General", "Fan Art", "Stream", "Fan Name"',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., "#LoremIpsum", "Placeholders"',
          },
        },
      ],
    },
  ],
}
