import type { GlobalConfig } from 'payload'

export const Profile: GlobalConfig = {
  slug: 'profile',
  admin: {
    group: 'Site',
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
      name: 'bio',
      type: 'richText',
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
      name: 'debutDate',
      type: 'date',
    },
    {
      name: 'height',
      type: 'text',
      admin: {
        description: 'e.g., "160cm"',
      },
    },
    {
      name: 'personalInfo',
      type: 'group',
      fields: [
        {
          name: 'hobbies',
          type: 'array',
          fields: [
            {
              name: 'hobby',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'likes',
          type: 'array',
          fields: [
            {
              name: 'item',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'dislikes',
          type: 'array',
          fields: [
            {
              name: 'item',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'personality',
          type: 'array',
          fields: [
            {
              name: 'trait',
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
