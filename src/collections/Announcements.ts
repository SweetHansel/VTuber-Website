import type { CollectionConfig } from 'payload'

export const Announcements: CollectionConfig = {
  slug: 'announcements',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'type', 'eventDate', 'priority'],
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
      name: 'type',
      type: 'select',
      options: [
        { label: 'Stream Schedule', value: 'stream' },
        { label: 'Event', value: 'event' },
        { label: 'Release', value: 'release' },
        { label: 'Collab', value: 'collab' },
        { label: 'General', value: 'general' },
      ],
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'eventDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When the event/stream takes place',
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'Platform or venue (e.g., "YouTube Live", "Tokyo")',
      },
    },
    {
      name: 'externalLink',
      type: 'text',
      admin: {
        description: 'Link to event, stream, or more info',
      },
    },
    {
      name: 'priority',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Higher priority items appear first (1-10)',
      },
    },
    {
      name: 'isPinned',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Pin to top of announcements',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When to stop displaying this announcement',
      },
    },
  ],
}
