import type { GlobalConfig } from 'payload'

export const LivestreamSettings: GlobalConfig = {
  slug: 'livestream-settings',
  admin: {
    group: 'Site',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable livestream status checking',
      },
    },
    {
      name: 'pollingInterval',
      type: 'number',
      defaultValue: 60,
      admin: {
        description: 'How often to check for live streams (seconds)',
      },
    },
    {
      name: 'alertDuration',
      type: 'number',
      defaultValue: 10,
      admin: {
        description: 'How long to show the alert (seconds)',
      },
    },
    {
      name: 'showFriendStreams',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show alerts for friend/collab channels',
      },
    },
    {
      name: 'alertPosition',
      type: 'select',
      options: [
        { label: 'Top Right', value: 'top-right' },
        { label: 'Top Left', value: 'top-left' },
        { label: 'Bottom Right', value: 'bottom-right' },
        { label: 'Bottom Left', value: 'bottom-left' },
      ],
      defaultValue: 'bottom-right',
    },
    {
      name: 'manualOverride',
      type: 'group',
      admin: {
        description: 'Manually set live status (useful when API fails)',
      },
      fields: [
        {
          name: 'isLive',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'None', value: '' },
            { label: 'Twitch', value: 'twitch' },
            { label: 'YouTube', value: 'youtube' },
          ],
        },
        {
          name: 'streamUrl',
          type: 'text',
        },
        {
          name: 'streamTitle',
          type: 'text',
        },
        {
          name: 'thumbnail',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
