import type { CollectionConfig } from 'payload'

export const Live2DModels: CollectionConfig = {
  slug: 'live2d-models',
  admin: {
    useAsTitle: 'name',
    group: 'Model',
    defaultColumns: ['name', 'version', 'createdAt'],
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
        description: 'Model name/version identifier',
      },
    },
    {
      name: 'version',
      type: 'text',
      admin: {
        description: 'e.g., "1.0", "2.0 Summer"',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'modelFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Live2D model file (optional - uploading exposes the file)',
      },
    },
    {
      name: 'refSheets',
      type: 'array',
      admin: {
        description: 'Reference sheets (character design, turnarounds, color refs)',
      },
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'e.g., "Front view", "Color palette", "Expressions"',
          },
        },
      ],
    },
    {
      name: 'showcase',
      type: 'array',
      admin: {
        description: 'Images, GIFs, or videos showcasing the model',
      },
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
        {
          name: 'isFeatured',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Use as main showcase image',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'credits',
      type: 'array',
      fields: [
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'Character Design', value: 'character-design' },
            { label: 'Illustration', value: 'illustration' },
            { label: 'Live2D Rigging', value: 'rigging' },
            { label: 'Additional Art', value: 'additional-art' },
          ],
          required: true,
        },
        {
          name: 'artist',
          type: 'relationship',
          relationTo: 'people',
        },
        {
          name: 'name',
          type: 'text',
          admin: {
            description: 'Manual name if not in people collection',
          },
        },
      ],
    },
    {
      name: 'debutDate',
      type: 'date',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Currently in use',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'expressions',
      type: 'array',
      admin: {
        description: 'Available expressions/poses',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'preview',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
