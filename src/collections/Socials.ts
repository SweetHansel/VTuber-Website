import type { CollectionConfig } from 'payload'

export const Socials: CollectionConfig = {
  slug: 'socials',
  admin: {
    useAsTitle: 'name',
    group: 'Collections',
    defaultColumns: ['name', 'platform', 'url'],
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
        description: 'Display name for the social link',
      },
    },
    {
      name: 'platform',
      type: 'select',
      options: [
        { label: 'Twitter/X', value: 'twitter' },
        { label: 'Bluesky', value: 'bluesky' },
        { label: 'YouTube', value: 'youtube' },
        { label: 'Twitch', value: 'twitch' },
        { label: 'Instagram', value: 'instagram' },
        { label: 'TikTok', value: 'tiktok' },
        { label: 'Pixiv', value: 'pixiv' },
        { label: 'VGen', value: 'vgen' },
        { label: 'Website', value: 'website' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'Full URL to the social profile',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Avatar/profile picture for this social',
      },
    },
  ],
}
