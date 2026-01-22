import type { CollectionConfig } from 'payload'

export const Channels: CollectionConfig = {
  slug: 'channels',
  admin: {
    useAsTitle: 'name',
    group: 'Ungrouped',
    defaultColumns: ['name', 'platform', 'trackLivestream'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name for the channel',
      },
    },
    {
      name: 'platform',
      type: 'select',
      options: [
        { label: 'Twitch', value: 'twitch' },
        { label: 'YouTube', value: 'youtube' },
        { label: 'TikTok', value: 'tiktok' },
      ],
      required: true,
    },
    {
      name: 'channelId',
      type: 'text',
      required: true,
      admin: {
        description: 'Platform-specific channel/user ID',
      },
    },
    {
      name: 'channelUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'Direct link to the channel',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Channel avatar/profile picture',
      },
    },
    {
      name: 'trackLivestream',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable livestream tracking for this channel',
      },
    },
    {
      name: 'priority',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Alert priority (higher = more prominent)',
      },
    },
  ],
}
