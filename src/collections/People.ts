import type { CollectionConfig } from 'payload'

export const People: CollectionConfig = {
  slug: 'people',
  admin: {
    useAsTitle: 'name',
    group: 'Collections',
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
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Content Creator', value: 'content-creator' },
        { label: 'Manager', value: 'manager' },
        { label: 'Moderator', value: 'moderator' },
        { label: 'Other', value: 'other' },
        { label: 'Illustrator', value: 'illustrator' },
        { label: 'Rigger', value: 'rigger' },
        { label: '3D Modeler', value: '3d-modeler' },
        { label: 'Music Producer', value: 'music-producer' },
        { label: 'Mixer', value: 'mixer' },
        { label: 'Video Editor', value: 'video-editor' },
        { label: 'Animator', value: 'animator' },
      ],
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'channels',
      type: 'relationship',
      relationTo: 'channels',
      hasMany: true,
      admin: {
        description: 'Associated channels',
      },
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
            { label: 'Instagram', value: 'instagram' },
            { label: 'Pixiv', value: 'pixiv' },
            { label: 'Website', value: 'website' },
            { label: 'Other', value: 'other' },
          ],
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
  ],
}
