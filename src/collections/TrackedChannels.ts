import type { CollectionConfig } from 'payload'

export const TrackedChannels: CollectionConfig = {
  slug: 'tracked-channels',
  admin: {
    useAsTitle: 'name',
    group: 'Livestream',
    defaultColumns: ['name', 'platform', 'isOwner', 'enabled'],
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
      name: 'isOwner',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Is this the main VTuber channel?',
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
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable livestream tracking for this channel',
      },
    },
  ],
}
