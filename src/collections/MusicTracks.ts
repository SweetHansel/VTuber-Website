import type { CollectionConfig } from 'payload'

export const MusicTracks: CollectionConfig = {
  slug: 'music-tracks',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'trackType', 'releaseDate'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'trackType',
      type: 'select',
      options: [
        { label: 'Cover', value: 'cover' },
        { label: 'Original', value: 'original' },
        { label: 'Remix', value: 'remix' },
        { label: 'Karaoke/Off-vocal', value: 'karaoke' },
      ],
      required: true,
    },
    {
      name: 'coverArt',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'audioFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'MP3/WAV file for audio player',
      },
    },
    {
      name: 'duration',
      type: 'number',
      admin: {
        description: 'Duration in seconds',
      },
    },
    {
      name: 'originalArtist',
      type: 'text',
      admin: {
        description: 'Original artist (for covers)',
      },
    },
    {
      name: 'lyrics',
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
            { label: 'Vocals', value: 'vocals' },
            { label: 'Composer', value: 'composer' },
            { label: 'Lyricist', value: 'lyricist' },
            { label: 'Arranger', value: 'arranger' },
            { label: 'Mix', value: 'mix' },
            { label: 'Master', value: 'master' },
            { label: 'Illustration', value: 'illustration' },
            { label: 'Video', value: 'video' },
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
      name: 'streamingLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'YouTube', value: 'youtube' },
            { label: 'YouTube Music', value: 'youtube-music' },
            { label: 'Spotify', value: 'spotify' },
            { label: 'Apple Music', value: 'apple-music' },
            { label: 'SoundCloud', value: 'soundcloud' },
            { label: 'Bandcamp', value: 'bandcamp' },
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
      name: 'releaseDate',
      type: 'date',
    },
    {
      name: 'album',
      type: 'relationship',
      relationTo: 'albums',
      admin: {
        description: 'Album this track belongs to',
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
