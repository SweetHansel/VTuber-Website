import type { CollectionConfig } from 'payload'

export const Models: CollectionConfig = {
  slug: 'models',
  admin: {
    useAsTitle: 'name',
    group: 'Model',
    defaultColumns: ['name', 'modelType', 'version', 'isActive', 'createdAt'],
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
        description: 'Model name/version identifier',
      },
    },
    {
      name: 'version',
      type: 'text',
      admin: {
        description: 'e.g., "1.0", "2.0 Summer", "Halloween"',
      },
    },
    {
      name: 'modelType',
      type: 'select',
      required: true,
      options: [
        // 2D types
        { label: 'Live2D', value: 'live2d' },
        { label: 'PNGTuber', value: 'pngtuber' },
        { label: '2D Other', value: '2d-other' },
        // 3D types
        { label: 'VRM', value: 'vrm' },
        { label: 'MMD', value: 'mmd' },
        { label: 'FBX', value: 'fbx' },
        { label: '3D Other', value: '3d-other' },
      ],
    },
    {
      name: 'showcase',
      type: 'array',
      admin: {
        description: 'Images, GIFs, or videos showcasing the model (first featured item used as thumbnail)',
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
            description: 'Use as main showcase image/thumbnail',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
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
      name: 'includeModelFile',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Include downloadable model file (exposes the file publicly)',
      },
    },
    {
      name: 'modelFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Model file (.zip, .json, .vrm, .glb, etc.)',
        condition: (data) => data?.includeModelFile === true,
      },
    },
    {
      name: 'technicalSpecs',
      type: 'group',
      admin: {
        condition: (data) => ['vrm', 'mmd', 'fbx', '3d-other'].includes(data?.modelType),
      },
      fields: [
        {
          name: 'polyCount',
          type: 'number',
          admin: {
            description: 'Polygon count',
          },
        },
        {
          name: 'textureResolution',
          type: 'text',
          admin: {
            description: 'e.g., "4K", "2048x2048"',
          },
        },
        {
          name: 'blendshapes',
          type: 'number',
          admin: {
            description: 'Number of blendshapes/expressions',
          },
        },
        {
          name: 'boneCount',
          type: 'number',
        },
      ],
    },
    {
      name: 'credits',
      type: 'array',
      fields: [
        {
          name: 'role',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., "Character Design", "Illustration", "Rigging", "3D Modeling", "Texturing"',
          },
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
  ],
}
