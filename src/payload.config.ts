import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tags } from './collections/Tags'
import { Categories } from './collections/Categories'
import { Artists } from './collections/Artists'
import { BlogPosts } from './collections/BlogPosts'
import { Announcements } from './collections/Announcements'
import { Artworks } from './collections/Artworks'
import { MusicTracks } from './collections/MusicTracks'
import { MusicAlbums } from './collections/MusicAlbums'
import { Videos } from './collections/Videos'
import { Live2DModels } from './collections/Live2DModels'
import { ThreeDModels } from './collections/ThreeDModels'
import { TrackedChannels } from './collections/TrackedChannels'

// Globals
import { Profile } from './globals/Profile'
import { SiteSettings } from './globals/SiteSettings'
import { Navigation } from './globals/Navigation'
import { LivestreamSettings } from './globals/LivestreamSettings'
import { LandingPage } from './globals/LandingPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Tags,
    Categories,
    Artists,
    BlogPosts,
    Announcements,
    Artworks,
    MusicTracks,
    MusicAlbums,
    Videos,
    Live2DModels,
    ThreeDModels,
    TrackedChannels,
  ],
  globals: [
    Profile,
    SiteSettings,
    Navigation,
    LivestreamSettings,
    LandingPage,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: {
              media: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})
