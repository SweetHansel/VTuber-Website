import type { CollectionConfig } from 'payload'

export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'videoType', 'platform', 'publishedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'videoType',
      type: 'select',
      options: [
        { label: 'Music Video', value: 'music-video' },
        { label: 'Stream Archive', value: 'stream-archive' },
        { label: 'Clip', value: 'clip' },
        { label: 'Short', value: 'short' },
        { label: 'Animation', value: 'animation' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'platform',
      type: 'select',
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Twitch', value: 'twitch' },
        { label: 'TikTok', value: 'tiktok' },
        { label: 'Bilibili', value: 'bilibili' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'videoUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'Full URL to the video',
      },
    },
    {
      name: 'videoId',
      type: 'text',
      admin: {
        description: 'Platform-specific video ID for embedding',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'duration',
      type: 'number',
      admin: {
        description: 'Duration in seconds',
      },
    },
    {
      name: 'relatedTrack',
      type: 'relationship',
      relationTo: 'music-tracks',
      admin: {
        description: 'Link to associated music track (for MVs)',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
