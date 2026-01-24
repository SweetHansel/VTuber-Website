import type { GlobalConfig } from 'payload'

export const Profile: GlobalConfig = {
  slug: 'profile',
  admin: {
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'japaneseName',
      type: 'text',
      admin: {
        description: 'Name in Japanese characters',
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
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'shortBio',
      type: 'textarea',
      admin: {
        description: 'Brief bio for cards and previews',
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
      type: 'group',
      fields: [
        {
          name: 'general',
          type: 'text',
          admin: {
            description: 'Main hashtag',
          },
        },
        {
          name: 'fanart',
          type: 'text',
        },
        {
          name: 'stream',
          type: 'text',
        },
        {
          name: 'fanName',
          type: 'text',
          admin: {
            description: 'What fans are called',
          },
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Twitter/X', value: 'twitter' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Twitch', value: 'twitch' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Discord', value: 'discord' },
            { label: 'Marshmallow', value: 'marshmallow' },
            { label: 'Other', value: 'other' },
          ],
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'Custom label (optional)',
          },
        },
      ],
    },
  ],
}
