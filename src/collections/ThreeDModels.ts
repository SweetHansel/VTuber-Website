import type { CollectionConfig } from 'payload'

export const ThreeDModels: CollectionConfig = {
  slug: '3d-models',
  admin: {
    useAsTitle: 'name',
    group: 'Model',
    defaultColumns: ['name', 'modelType', 'createdAt'],
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
      name: 'modelType',
      type: 'select',
      options: [
        { label: 'VRM', value: 'vrm' },
        { label: 'MMD', value: 'mmd' },
        { label: 'FBX', value: 'fbx' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: true,
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
      name: 'modelFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'VRM or GLB/GLTF file for 3D viewer (optional - uploading exposes the file)',
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
      name: 'description',
      type: 'richText',
    },
    {
      name: 'technicalSpecs',
      type: 'group',
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
          type: 'select',
          options: [
            { label: 'Character Design', value: 'character-design' },
            { label: '3D Modeling', value: '3d-modeling' },
            { label: 'Rigging', value: 'rigging' },
            { label: 'Texturing', value: 'texturing' },
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
        },
      ],
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'debutDate',
      type: 'date',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
