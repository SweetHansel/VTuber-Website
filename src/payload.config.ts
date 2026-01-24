import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tags } from './collections/Tags'
import { Announcements } from './collections/Announcements'
import { Artworks } from './collections/Artworks'
import { BlogPosts } from './collections/BlogPosts'
import { Videos } from './collections/Videos'
import { MusicTracks } from './collections/MusicTracks'
import { Live2DModels } from './collections/Live2DModels'
import { ThreeDModels } from './collections/ThreeDModels'
import { People } from './collections/People'
import { Albums } from './collections/Albums'
import { Channels } from './collections/Channels'
import { InteractiveMedia } from './collections/InteractiveMedia'

// Globals
import { Profile } from './globals/Profile'
import { SiteSettings } from './globals/SiteSettings'
import { Links } from './globals/Links'
import { Themes } from './globals/Themes'
import { LivestreamSettings } from './globals/LivestreamSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'https://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, 'app', '(payload)', 'admin','[[...segments]]','importMap.ts'),
    },
  },
  collections: [
    Tags,
    Announcements,
    Artworks,
    BlogPosts,
    Videos,
    MusicTracks,
    Live2DModels,
    ThreeDModels,
    People,
    Albums,
    Channels,
    InteractiveMedia,
    Users,
    Media,
  ],
  globals: [
    Profile,
    SiteSettings,
    Links,
    Themes,
    LivestreamSettings,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  sharp,
})
