import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  access: {
    // Allow first user creation, then require auth
    create: async ({ req }) => {
      // If no users exist yet, allow creation (first admin setup)
      if (!req.user) {
        const { totalDocs } = await req.payload.count({ collection: 'users' })
        return totalDocs === 0
      }
      return true
    },
    read: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      defaultValue: 'editor',
      required: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'displayName',
      type: 'text',
    },
    {
      name: 'person',
      type: 'relationship',
      relationTo: 'people',
      admin: {
        description: 'Link to associated person profile (optional)',
      },
    },
  ],
}
