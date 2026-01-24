import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_announcements_type" AS ENUM('stream', 'event', 'release', 'collab', 'general');
  CREATE TYPE "public"."enum_artworks_credits_role" AS ENUM('artist', 'illustrator', 'colorist', 'line-art', 'background', 'commissioner', 'other');
  CREATE TYPE "public"."enum_artworks_artwork_type" AS ENUM('fanart', 'official', 'commissioned', 'other');
  CREATE TYPE "public"."enum_blog_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_videos_credits_role" AS ENUM('director', 'editor', 'animator', 'illustrator', 'cameraman', 'motion-graphics', 'other');
  CREATE TYPE "public"."enum_videos_video_type" AS ENUM('music-video', 'stream-archive', 'clip', 'short', 'animation', 'other');
  CREATE TYPE "public"."enum_videos_platform" AS ENUM('youtube', 'twitch', 'tiktok', 'bilibili', 'other');
  CREATE TYPE "public"."enum_music_tracks_credits_role" AS ENUM('vocals', 'composer', 'lyricist', 'arranger', 'mix', 'master', 'illustration', 'video');
  CREATE TYPE "public"."enum_music_tracks_streaming_links_platform" AS ENUM('youtube', 'youtube-music', 'spotify', 'apple-music', 'soundcloud', 'bandcamp', 'other');
  CREATE TYPE "public"."enum_music_tracks_track_type" AS ENUM('cover', 'original', 'remix', 'karaoke');
  CREATE TYPE "public"."enum_live2d_models_credits_role" AS ENUM('character-design', 'illustration', 'rigging', 'additional-art');
  CREATE TYPE "public"."enum_3d_models_credits_role" AS ENUM('character-design', '3d-modeling', 'rigging', 'texturing');
  CREATE TYPE "public"."enum_3d_models_model_type" AS ENUM('vrm', 'mmd', 'fbx', 'other');
  CREATE TYPE "public"."enum_people_roles" AS ENUM('content-creator', 'manager', 'moderator', 'other', 'illustrator', 'rigger', '3d-modeler', 'music-producer', 'mixer', 'video-editor', 'animator');
  CREATE TYPE "public"."enum_people_social_links_platform" AS ENUM('twitter', 'youtube', 'twitch', 'instagram', 'pixiv', 'website', 'other');
  CREATE TYPE "public"."enum_albums_streaming_links_platform" AS ENUM('youtube', 'spotify', 'apple-music', 'bandcamp', 'other');
  CREATE TYPE "public"."enum_albums_album_type" AS ENUM('single', 'ep', 'album', 'compilation');
  CREATE TYPE "public"."enum_channels_platform" AS ENUM('twitch', 'youtube', 'tiktok');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_profile_social_links_platform" AS ENUM('twitter', 'youtube', 'twitch', 'tiktok', 'instagram', 'discord', 'marshmallow', 'other');
  CREATE TYPE "public"."enum_livestream_settings_alert_position" AS ENUM('top-right', 'top-left', 'bottom-right', 'bottom-left');
  CREATE TYPE "public"."enum_livestream_settings_manual_override_platform" AS ENUM('', 'twitch', 'youtube');
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"color" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "announcements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"type" "enum_announcements_type" NOT NULL,
  	"description" jsonb,
  	"featured_image_id" integer,
  	"event_date" timestamp(3) with time zone,
  	"location" varchar,
  	"external_link" varchar,
  	"priority" numeric DEFAULT 1,
  	"is_pinned" boolean DEFAULT false,
  	"expires_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "artworks_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" "enum_artworks_credits_role" NOT NULL,
  	"person_id" integer,
  	"name" varchar
  );
  
  CREATE TABLE "artworks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"image_id" integer NOT NULL,
  	"artwork_type" "enum_artworks_artwork_type" NOT NULL,
  	"source_url" varchar,
  	"is_nsfw" boolean DEFAULT false,
  	"is_featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "artworks_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"people_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "blog_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"featured_image_id" integer,
  	"excerpt" varchar,
  	"content" jsonb NOT NULL,
  	"status" "enum_blog_posts_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog_posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "videos_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" "enum_videos_credits_role" NOT NULL,
  	"person_id" integer,
  	"name" varchar
  );
  
  CREATE TABLE "videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"video_type" "enum_videos_video_type" NOT NULL,
  	"platform" "enum_videos_platform" NOT NULL,
  	"video_url" varchar NOT NULL,
  	"video_id" varchar,
  	"thumbnail_id" integer,
  	"description" varchar,
  	"duration" numeric,
  	"published_at" timestamp(3) with time zone,
  	"is_featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "videos_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"music_tracks_id" integer,
  	"people_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "music_tracks_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" "enum_music_tracks_credits_role" NOT NULL,
  	"artist_id" integer,
  	"name" varchar
  );
  
  CREATE TABLE "music_tracks_streaming_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_music_tracks_streaming_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "music_tracks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"track_type" "enum_music_tracks_track_type" NOT NULL,
  	"cover_art_id" integer NOT NULL,
  	"audio_file_id" integer,
  	"duration" numeric,
  	"original_artist" varchar,
  	"lyrics" jsonb,
  	"release_date" timestamp(3) with time zone,
  	"album_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "music_tracks_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "live2d_models_ref_sheets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "live2d_models_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"caption" varchar,
  	"is_featured" boolean DEFAULT false
  );
  
  CREATE TABLE "live2d_models_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" "enum_live2d_models_credits_role" NOT NULL,
  	"artist_id" integer,
  	"name" varchar
  );
  
  CREATE TABLE "live2d_models_expressions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"preview_id" integer
  );
  
  CREATE TABLE "live2d_models" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"version" varchar,
  	"thumbnail_id" integer NOT NULL,
  	"model_file_id" integer,
  	"description" jsonb,
  	"debut_date" timestamp(3) with time zone,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "live2d_models_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "3d_models_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"caption" varchar,
  	"is_featured" boolean DEFAULT false
  );
  
  CREATE TABLE "3d_models_ref_sheets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "3d_models_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" "enum_3d_models_credits_role" NOT NULL,
  	"artist_id" integer,
  	"name" varchar
  );
  
  CREATE TABLE "3d_models" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"model_type" "enum_3d_models_model_type" NOT NULL,
  	"thumbnail_id" integer NOT NULL,
  	"model_file_id" integer,
  	"description" jsonb,
  	"technical_specs_poly_count" numeric,
  	"technical_specs_texture_resolution" varchar,
  	"technical_specs_blendshapes" numeric,
  	"technical_specs_bone_count" numeric,
  	"debut_date" timestamp(3) with time zone,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "3d_models_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "people_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_people_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "people_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_people_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "people" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"avatar_id" integer,
  	"bio" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "people_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"channels_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "albums_streaming_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_albums_streaming_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "albums" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"album_type" "enum_albums_album_type" NOT NULL,
  	"cover_art_id" integer NOT NULL,
  	"release_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "albums_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"music_tracks_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "channels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"platform" "enum_channels_platform" NOT NULL,
  	"channel_id" varchar NOT NULL,
  	"channel_url" varchar NOT NULL,
  	"avatar_id" integer,
  	"track_livestream" boolean DEFAULT true,
  	"priority" numeric DEFAULT 1,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"avatar_id" integer,
  	"display_name" varchar,
  	"person_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" varchar,
  	"credits" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_full_url" varchar,
  	"sizes_full_width" numeric,
  	"sizes_full_height" numeric,
  	"sizes_full_mime_type" varchar,
  	"sizes_full_filesize" numeric,
  	"sizes_full_filename" varchar
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"announcements_id" integer,
  	"artworks_id" integer,
  	"blog_posts_id" integer,
  	"videos_id" integer,
  	"music_tracks_id" integer,
  	"live2d_models_id" integer,
  	"3d_models_id" integer,
  	"people_id" integer,
  	"albums_id" integer,
  	"channels_id" integer,
  	"users_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "profile_traits_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "profile_traits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category" varchar NOT NULL,
  	"icon" varchar,
  	"color" varchar
  );
  
  CREATE TABLE "profile_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_profile_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "profile" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"japanese_name" varchar,
  	"tagline" varchar,
  	"avatar_id" integer,
  	"short_bio" varchar,
  	"birthday" timestamp(3) with time zone,
  	"height" varchar,
  	"hashtags_general" varchar,
  	"hashtags_fanart" varchar,
  	"hashtags_stream" varchar,
  	"hashtags_fan_name" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_seo_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar NOT NULL,
  	"site_description" varchar,
  	"logo_id" integer,
  	"favicon_id" integer,
  	"og_image_id" integer,
  	"analytics_google_analytics_id" varchar,
  	"seo_default_title" varchar,
  	"seo_title_template" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "links_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE "links" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "themes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"primary_color" varchar,
  	"secondary_color" varchar,
  	"accent_color" varchar,
  	"landing_page_media_id" integer,
  	"artwork_page_media_id" integer,
  	"music_page_media_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "livestream_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"polling_interval" numeric DEFAULT 60,
  	"alert_duration" numeric DEFAULT 10,
  	"show_friend_streams" boolean DEFAULT true,
  	"alert_position" "enum_livestream_settings_alert_position" DEFAULT 'bottom-right',
  	"manual_override_is_live" boolean DEFAULT false,
  	"manual_override_platform" "enum_livestream_settings_manual_override_platform",
  	"manual_override_stream_url" varchar,
  	"manual_override_stream_title" varchar,
  	"manual_override_thumbnail_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "announcements" ADD CONSTRAINT "announcements_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artworks_credits" ADD CONSTRAINT "artworks_credits_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artworks_credits" ADD CONSTRAINT "artworks_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artworks" ADD CONSTRAINT "artworks_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artworks_rels" ADD CONSTRAINT "artworks_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artworks_rels" ADD CONSTRAINT "artworks_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artworks_rels" ADD CONSTRAINT "artworks_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "videos_credits" ADD CONSTRAINT "videos_credits_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "videos_credits" ADD CONSTRAINT "videos_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "videos" ADD CONSTRAINT "videos_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "videos_rels" ADD CONSTRAINT "videos_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "videos_rels" ADD CONSTRAINT "videos_rels_music_tracks_fk" FOREIGN KEY ("music_tracks_id") REFERENCES "public"."music_tracks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "videos_rels" ADD CONSTRAINT "videos_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "videos_rels" ADD CONSTRAINT "videos_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "music_tracks_credits" ADD CONSTRAINT "music_tracks_credits_artist_id_people_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "music_tracks_credits" ADD CONSTRAINT "music_tracks_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."music_tracks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "music_tracks_streaming_links" ADD CONSTRAINT "music_tracks_streaming_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."music_tracks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "music_tracks" ADD CONSTRAINT "music_tracks_cover_art_id_media_id_fk" FOREIGN KEY ("cover_art_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "music_tracks" ADD CONSTRAINT "music_tracks_audio_file_id_media_id_fk" FOREIGN KEY ("audio_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "music_tracks" ADD CONSTRAINT "music_tracks_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "music_tracks_rels" ADD CONSTRAINT "music_tracks_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."music_tracks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "music_tracks_rels" ADD CONSTRAINT "music_tracks_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "live2d_models_ref_sheets" ADD CONSTRAINT "live2d_models_ref_sheets_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "live2d_models_ref_sheets" ADD CONSTRAINT "live2d_models_ref_sheets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."live2d_models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "live2d_models_showcase" ADD CONSTRAINT "live2d_models_showcase_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "live2d_models_showcase" ADD CONSTRAINT "live2d_models_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."live2d_models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "live2d_models_credits" ADD CONSTRAINT "live2d_models_credits_artist_id_people_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "live2d_models_credits" ADD CONSTRAINT "live2d_models_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."live2d_models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "live2d_models_expressions" ADD CONSTRAINT "live2d_models_expressions_preview_id_media_id_fk" FOREIGN KEY ("preview_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "live2d_models_expressions" ADD CONSTRAINT "live2d_models_expressions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."live2d_models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "live2d_models" ADD CONSTRAINT "live2d_models_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "live2d_models" ADD CONSTRAINT "live2d_models_model_file_id_media_id_fk" FOREIGN KEY ("model_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "live2d_models_rels" ADD CONSTRAINT "live2d_models_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."live2d_models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "live2d_models_rels" ADD CONSTRAINT "live2d_models_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "3d_models_showcase" ADD CONSTRAINT "3d_models_showcase_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "3d_models_showcase" ADD CONSTRAINT "3d_models_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."3d_models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "3d_models_ref_sheets" ADD CONSTRAINT "3d_models_ref_sheets_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "3d_models_ref_sheets" ADD CONSTRAINT "3d_models_ref_sheets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."3d_models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "3d_models_credits" ADD CONSTRAINT "3d_models_credits_artist_id_people_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "3d_models_credits" ADD CONSTRAINT "3d_models_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."3d_models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "3d_models" ADD CONSTRAINT "3d_models_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "3d_models" ADD CONSTRAINT "3d_models_model_file_id_media_id_fk" FOREIGN KEY ("model_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "3d_models_rels" ADD CONSTRAINT "3d_models_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."3d_models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "3d_models_rels" ADD CONSTRAINT "3d_models_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people_roles" ADD CONSTRAINT "people_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people_social_links" ADD CONSTRAINT "people_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people_rels" ADD CONSTRAINT "people_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people_rels" ADD CONSTRAINT "people_rels_channels_fk" FOREIGN KEY ("channels_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people_rels" ADD CONSTRAINT "people_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums_streaming_links" ADD CONSTRAINT "albums_streaming_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums" ADD CONSTRAINT "albums_cover_art_id_media_id_fk" FOREIGN KEY ("cover_art_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "albums_rels" ADD CONSTRAINT "albums_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums_rels" ADD CONSTRAINT "albums_rels_music_tracks_fk" FOREIGN KEY ("music_tracks_id") REFERENCES "public"."music_tracks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums_rels" ADD CONSTRAINT "albums_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "channels" ADD CONSTRAINT "channels_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_announcements_fk" FOREIGN KEY ("announcements_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_artworks_fk" FOREIGN KEY ("artworks_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_music_tracks_fk" FOREIGN KEY ("music_tracks_id") REFERENCES "public"."music_tracks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_live2d_models_fk" FOREIGN KEY ("live2d_models_id") REFERENCES "public"."live2d_models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_3d_models_fk" FOREIGN KEY ("3d_models_id") REFERENCES "public"."3d_models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_albums_fk" FOREIGN KEY ("albums_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_channels_fk" FOREIGN KEY ("channels_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_traits_items" ADD CONSTRAINT "profile_traits_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_traits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_traits" ADD CONSTRAINT "profile_traits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_social_links" ADD CONSTRAINT "profile_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile" ADD CONSTRAINT "profile_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_seo_keywords" ADD CONSTRAINT "site_settings_seo_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "links_social_links" ADD CONSTRAINT "links_social_links_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "links_social_links" ADD CONSTRAINT "links_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "themes" ADD CONSTRAINT "themes_landing_page_media_id_media_id_fk" FOREIGN KEY ("landing_page_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "themes" ADD CONSTRAINT "themes_artwork_page_media_id_media_id_fk" FOREIGN KEY ("artwork_page_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "themes" ADD CONSTRAINT "themes_music_page_media_id_media_id_fk" FOREIGN KEY ("music_page_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "livestream_settings" ADD CONSTRAINT "livestream_settings_manual_override_thumbnail_id_media_id_fk" FOREIGN KEY ("manual_override_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "announcements_featured_image_idx" ON "announcements" USING btree ("featured_image_id");
  CREATE INDEX "announcements_updated_at_idx" ON "announcements" USING btree ("updated_at");
  CREATE INDEX "announcements_created_at_idx" ON "announcements" USING btree ("created_at");
  CREATE INDEX "artworks_credits_order_idx" ON "artworks_credits" USING btree ("_order");
  CREATE INDEX "artworks_credits_parent_id_idx" ON "artworks_credits" USING btree ("_parent_id");
  CREATE INDEX "artworks_credits_person_idx" ON "artworks_credits" USING btree ("person_id");
  CREATE INDEX "artworks_image_idx" ON "artworks" USING btree ("image_id");
  CREATE INDEX "artworks_updated_at_idx" ON "artworks" USING btree ("updated_at");
  CREATE INDEX "artworks_created_at_idx" ON "artworks" USING btree ("created_at");
  CREATE INDEX "artworks_rels_order_idx" ON "artworks_rels" USING btree ("order");
  CREATE INDEX "artworks_rels_parent_idx" ON "artworks_rels" USING btree ("parent_id");
  CREATE INDEX "artworks_rels_path_idx" ON "artworks_rels" USING btree ("path");
  CREATE INDEX "artworks_rels_people_id_idx" ON "artworks_rels" USING btree ("people_id");
  CREATE INDEX "artworks_rels_tags_id_idx" ON "artworks_rels" USING btree ("tags_id");
  CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");
  CREATE INDEX "blog_posts_featured_image_idx" ON "blog_posts" USING btree ("featured_image_id");
  CREATE INDEX "blog_posts_updated_at_idx" ON "blog_posts" USING btree ("updated_at");
  CREATE INDEX "blog_posts_created_at_idx" ON "blog_posts" USING btree ("created_at");
  CREATE INDEX "blog_posts_rels_order_idx" ON "blog_posts_rels" USING btree ("order");
  CREATE INDEX "blog_posts_rels_parent_idx" ON "blog_posts_rels" USING btree ("parent_id");
  CREATE INDEX "blog_posts_rels_path_idx" ON "blog_posts_rels" USING btree ("path");
  CREATE INDEX "blog_posts_rels_tags_id_idx" ON "blog_posts_rels" USING btree ("tags_id");
  CREATE INDEX "videos_credits_order_idx" ON "videos_credits" USING btree ("_order");
  CREATE INDEX "videos_credits_parent_id_idx" ON "videos_credits" USING btree ("_parent_id");
  CREATE INDEX "videos_credits_person_idx" ON "videos_credits" USING btree ("person_id");
  CREATE INDEX "videos_thumbnail_idx" ON "videos" USING btree ("thumbnail_id");
  CREATE INDEX "videos_updated_at_idx" ON "videos" USING btree ("updated_at");
  CREATE INDEX "videos_created_at_idx" ON "videos" USING btree ("created_at");
  CREATE INDEX "videos_rels_order_idx" ON "videos_rels" USING btree ("order");
  CREATE INDEX "videos_rels_parent_idx" ON "videos_rels" USING btree ("parent_id");
  CREATE INDEX "videos_rels_path_idx" ON "videos_rels" USING btree ("path");
  CREATE INDEX "videos_rels_music_tracks_id_idx" ON "videos_rels" USING btree ("music_tracks_id");
  CREATE INDEX "videos_rels_people_id_idx" ON "videos_rels" USING btree ("people_id");
  CREATE INDEX "videos_rels_tags_id_idx" ON "videos_rels" USING btree ("tags_id");
  CREATE INDEX "music_tracks_credits_order_idx" ON "music_tracks_credits" USING btree ("_order");
  CREATE INDEX "music_tracks_credits_parent_id_idx" ON "music_tracks_credits" USING btree ("_parent_id");
  CREATE INDEX "music_tracks_credits_artist_idx" ON "music_tracks_credits" USING btree ("artist_id");
  CREATE INDEX "music_tracks_streaming_links_order_idx" ON "music_tracks_streaming_links" USING btree ("_order");
  CREATE INDEX "music_tracks_streaming_links_parent_id_idx" ON "music_tracks_streaming_links" USING btree ("_parent_id");
  CREATE INDEX "music_tracks_cover_art_idx" ON "music_tracks" USING btree ("cover_art_id");
  CREATE INDEX "music_tracks_audio_file_idx" ON "music_tracks" USING btree ("audio_file_id");
  CREATE INDEX "music_tracks_album_idx" ON "music_tracks" USING btree ("album_id");
  CREATE INDEX "music_tracks_updated_at_idx" ON "music_tracks" USING btree ("updated_at");
  CREATE INDEX "music_tracks_created_at_idx" ON "music_tracks" USING btree ("created_at");
  CREATE INDEX "music_tracks_rels_order_idx" ON "music_tracks_rels" USING btree ("order");
  CREATE INDEX "music_tracks_rels_parent_idx" ON "music_tracks_rels" USING btree ("parent_id");
  CREATE INDEX "music_tracks_rels_path_idx" ON "music_tracks_rels" USING btree ("path");
  CREATE INDEX "music_tracks_rels_tags_id_idx" ON "music_tracks_rels" USING btree ("tags_id");
  CREATE INDEX "live2d_models_ref_sheets_order_idx" ON "live2d_models_ref_sheets" USING btree ("_order");
  CREATE INDEX "live2d_models_ref_sheets_parent_id_idx" ON "live2d_models_ref_sheets" USING btree ("_parent_id");
  CREATE INDEX "live2d_models_ref_sheets_media_idx" ON "live2d_models_ref_sheets" USING btree ("media_id");
  CREATE INDEX "live2d_models_showcase_order_idx" ON "live2d_models_showcase" USING btree ("_order");
  CREATE INDEX "live2d_models_showcase_parent_id_idx" ON "live2d_models_showcase" USING btree ("_parent_id");
  CREATE INDEX "live2d_models_showcase_media_idx" ON "live2d_models_showcase" USING btree ("media_id");
  CREATE INDEX "live2d_models_credits_order_idx" ON "live2d_models_credits" USING btree ("_order");
  CREATE INDEX "live2d_models_credits_parent_id_idx" ON "live2d_models_credits" USING btree ("_parent_id");
  CREATE INDEX "live2d_models_credits_artist_idx" ON "live2d_models_credits" USING btree ("artist_id");
  CREATE INDEX "live2d_models_expressions_order_idx" ON "live2d_models_expressions" USING btree ("_order");
  CREATE INDEX "live2d_models_expressions_parent_id_idx" ON "live2d_models_expressions" USING btree ("_parent_id");
  CREATE INDEX "live2d_models_expressions_preview_idx" ON "live2d_models_expressions" USING btree ("preview_id");
  CREATE INDEX "live2d_models_thumbnail_idx" ON "live2d_models" USING btree ("thumbnail_id");
  CREATE INDEX "live2d_models_model_file_idx" ON "live2d_models" USING btree ("model_file_id");
  CREATE INDEX "live2d_models_updated_at_idx" ON "live2d_models" USING btree ("updated_at");
  CREATE INDEX "live2d_models_created_at_idx" ON "live2d_models" USING btree ("created_at");
  CREATE INDEX "live2d_models_rels_order_idx" ON "live2d_models_rels" USING btree ("order");
  CREATE INDEX "live2d_models_rels_parent_idx" ON "live2d_models_rels" USING btree ("parent_id");
  CREATE INDEX "live2d_models_rels_path_idx" ON "live2d_models_rels" USING btree ("path");
  CREATE INDEX "live2d_models_rels_tags_id_idx" ON "live2d_models_rels" USING btree ("tags_id");
  CREATE INDEX "3d_models_showcase_order_idx" ON "3d_models_showcase" USING btree ("_order");
  CREATE INDEX "3d_models_showcase_parent_id_idx" ON "3d_models_showcase" USING btree ("_parent_id");
  CREATE INDEX "3d_models_showcase_media_idx" ON "3d_models_showcase" USING btree ("media_id");
  CREATE INDEX "3d_models_ref_sheets_order_idx" ON "3d_models_ref_sheets" USING btree ("_order");
  CREATE INDEX "3d_models_ref_sheets_parent_id_idx" ON "3d_models_ref_sheets" USING btree ("_parent_id");
  CREATE INDEX "3d_models_ref_sheets_media_idx" ON "3d_models_ref_sheets" USING btree ("media_id");
  CREATE INDEX "3d_models_credits_order_idx" ON "3d_models_credits" USING btree ("_order");
  CREATE INDEX "3d_models_credits_parent_id_idx" ON "3d_models_credits" USING btree ("_parent_id");
  CREATE INDEX "3d_models_credits_artist_idx" ON "3d_models_credits" USING btree ("artist_id");
  CREATE INDEX "3d_models_thumbnail_idx" ON "3d_models" USING btree ("thumbnail_id");
  CREATE INDEX "3d_models_model_file_idx" ON "3d_models" USING btree ("model_file_id");
  CREATE INDEX "3d_models_updated_at_idx" ON "3d_models" USING btree ("updated_at");
  CREATE INDEX "3d_models_created_at_idx" ON "3d_models" USING btree ("created_at");
  CREATE INDEX "3d_models_rels_order_idx" ON "3d_models_rels" USING btree ("order");
  CREATE INDEX "3d_models_rels_parent_idx" ON "3d_models_rels" USING btree ("parent_id");
  CREATE INDEX "3d_models_rels_path_idx" ON "3d_models_rels" USING btree ("path");
  CREATE INDEX "3d_models_rels_tags_id_idx" ON "3d_models_rels" USING btree ("tags_id");
  CREATE INDEX "people_roles_order_idx" ON "people_roles" USING btree ("order");
  CREATE INDEX "people_roles_parent_idx" ON "people_roles" USING btree ("parent_id");
  CREATE INDEX "people_social_links_order_idx" ON "people_social_links" USING btree ("_order");
  CREATE INDEX "people_social_links_parent_id_idx" ON "people_social_links" USING btree ("_parent_id");
  CREATE INDEX "people_avatar_idx" ON "people" USING btree ("avatar_id");
  CREATE INDEX "people_updated_at_idx" ON "people" USING btree ("updated_at");
  CREATE INDEX "people_created_at_idx" ON "people" USING btree ("created_at");
  CREATE INDEX "people_rels_order_idx" ON "people_rels" USING btree ("order");
  CREATE INDEX "people_rels_parent_idx" ON "people_rels" USING btree ("parent_id");
  CREATE INDEX "people_rels_path_idx" ON "people_rels" USING btree ("path");
  CREATE INDEX "people_rels_channels_id_idx" ON "people_rels" USING btree ("channels_id");
  CREATE INDEX "people_rels_tags_id_idx" ON "people_rels" USING btree ("tags_id");
  CREATE INDEX "albums_streaming_links_order_idx" ON "albums_streaming_links" USING btree ("_order");
  CREATE INDEX "albums_streaming_links_parent_id_idx" ON "albums_streaming_links" USING btree ("_parent_id");
  CREATE INDEX "albums_cover_art_idx" ON "albums" USING btree ("cover_art_id");
  CREATE INDEX "albums_updated_at_idx" ON "albums" USING btree ("updated_at");
  CREATE INDEX "albums_created_at_idx" ON "albums" USING btree ("created_at");
  CREATE INDEX "albums_rels_order_idx" ON "albums_rels" USING btree ("order");
  CREATE INDEX "albums_rels_parent_idx" ON "albums_rels" USING btree ("parent_id");
  CREATE INDEX "albums_rels_path_idx" ON "albums_rels" USING btree ("path");
  CREATE INDEX "albums_rels_music_tracks_id_idx" ON "albums_rels" USING btree ("music_tracks_id");
  CREATE INDEX "albums_rels_tags_id_idx" ON "albums_rels" USING btree ("tags_id");
  CREATE INDEX "channels_avatar_idx" ON "channels" USING btree ("avatar_id");
  CREATE INDEX "channels_updated_at_idx" ON "channels" USING btree ("updated_at");
  CREATE INDEX "channels_created_at_idx" ON "channels" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "users_person_idx" ON "users" USING btree ("person_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_full_sizes_full_filename_idx" ON "media" USING btree ("sizes_full_filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_announcements_id_idx" ON "payload_locked_documents_rels" USING btree ("announcements_id");
  CREATE INDEX "payload_locked_documents_rels_artworks_id_idx" ON "payload_locked_documents_rels" USING btree ("artworks_id");
  CREATE INDEX "payload_locked_documents_rels_blog_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_posts_id");
  CREATE INDEX "payload_locked_documents_rels_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("videos_id");
  CREATE INDEX "payload_locked_documents_rels_music_tracks_id_idx" ON "payload_locked_documents_rels" USING btree ("music_tracks_id");
  CREATE INDEX "payload_locked_documents_rels_live2d_models_id_idx" ON "payload_locked_documents_rels" USING btree ("live2d_models_id");
  CREATE INDEX "payload_locked_documents_rels_3d_models_id_idx" ON "payload_locked_documents_rels" USING btree ("3d_models_id");
  CREATE INDEX "payload_locked_documents_rels_people_id_idx" ON "payload_locked_documents_rels" USING btree ("people_id");
  CREATE INDEX "payload_locked_documents_rels_albums_id_idx" ON "payload_locked_documents_rels" USING btree ("albums_id");
  CREATE INDEX "payload_locked_documents_rels_channels_id_idx" ON "payload_locked_documents_rels" USING btree ("channels_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "profile_traits_items_order_idx" ON "profile_traits_items" USING btree ("_order");
  CREATE INDEX "profile_traits_items_parent_id_idx" ON "profile_traits_items" USING btree ("_parent_id");
  CREATE INDEX "profile_traits_order_idx" ON "profile_traits" USING btree ("_order");
  CREATE INDEX "profile_traits_parent_id_idx" ON "profile_traits" USING btree ("_parent_id");
  CREATE INDEX "profile_social_links_order_idx" ON "profile_social_links" USING btree ("_order");
  CREATE INDEX "profile_social_links_parent_id_idx" ON "profile_social_links" USING btree ("_parent_id");
  CREATE INDEX "profile_avatar_idx" ON "profile" USING btree ("avatar_id");
  CREATE INDEX "site_settings_seo_keywords_order_idx" ON "site_settings_seo_keywords" USING btree ("_order");
  CREATE INDEX "site_settings_seo_keywords_parent_id_idx" ON "site_settings_seo_keywords" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_og_image_idx" ON "site_settings" USING btree ("og_image_id");
  CREATE INDEX "links_social_links_order_idx" ON "links_social_links" USING btree ("_order");
  CREATE INDEX "links_social_links_parent_id_idx" ON "links_social_links" USING btree ("_parent_id");
  CREATE INDEX "links_social_links_icon_idx" ON "links_social_links" USING btree ("icon_id");
  CREATE INDEX "themes_landing_page_media_idx" ON "themes" USING btree ("landing_page_media_id");
  CREATE INDEX "themes_artwork_page_media_idx" ON "themes" USING btree ("artwork_page_media_id");
  CREATE INDEX "themes_music_page_media_idx" ON "themes" USING btree ("music_page_media_id");
  CREATE INDEX "livestream_settings_manual_override_manual_override_thum_idx" ON "livestream_settings" USING btree ("manual_override_thumbnail_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "tags" CASCADE;
  DROP TABLE "announcements" CASCADE;
  DROP TABLE "artworks_credits" CASCADE;
  DROP TABLE "artworks" CASCADE;
  DROP TABLE "artworks_rels" CASCADE;
  DROP TABLE "blog_posts" CASCADE;
  DROP TABLE "blog_posts_rels" CASCADE;
  DROP TABLE "videos_credits" CASCADE;
  DROP TABLE "videos" CASCADE;
  DROP TABLE "videos_rels" CASCADE;
  DROP TABLE "music_tracks_credits" CASCADE;
  DROP TABLE "music_tracks_streaming_links" CASCADE;
  DROP TABLE "music_tracks" CASCADE;
  DROP TABLE "music_tracks_rels" CASCADE;
  DROP TABLE "live2d_models_ref_sheets" CASCADE;
  DROP TABLE "live2d_models_showcase" CASCADE;
  DROP TABLE "live2d_models_credits" CASCADE;
  DROP TABLE "live2d_models_expressions" CASCADE;
  DROP TABLE "live2d_models" CASCADE;
  DROP TABLE "live2d_models_rels" CASCADE;
  DROP TABLE "3d_models_showcase" CASCADE;
  DROP TABLE "3d_models_ref_sheets" CASCADE;
  DROP TABLE "3d_models_credits" CASCADE;
  DROP TABLE "3d_models" CASCADE;
  DROP TABLE "3d_models_rels" CASCADE;
  DROP TABLE "people_roles" CASCADE;
  DROP TABLE "people_social_links" CASCADE;
  DROP TABLE "people" CASCADE;
  DROP TABLE "people_rels" CASCADE;
  DROP TABLE "albums_streaming_links" CASCADE;
  DROP TABLE "albums" CASCADE;
  DROP TABLE "albums_rels" CASCADE;
  DROP TABLE "channels" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "profile_traits_items" CASCADE;
  DROP TABLE "profile_traits" CASCADE;
  DROP TABLE "profile_social_links" CASCADE;
  DROP TABLE "profile" CASCADE;
  DROP TABLE "site_settings_seo_keywords" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "links_social_links" CASCADE;
  DROP TABLE "links" CASCADE;
  DROP TABLE "themes" CASCADE;
  DROP TABLE "livestream_settings" CASCADE;
  DROP TYPE "public"."enum_announcements_type";
  DROP TYPE "public"."enum_artworks_credits_role";
  DROP TYPE "public"."enum_artworks_artwork_type";
  DROP TYPE "public"."enum_blog_posts_status";
  DROP TYPE "public"."enum_videos_credits_role";
  DROP TYPE "public"."enum_videos_video_type";
  DROP TYPE "public"."enum_videos_platform";
  DROP TYPE "public"."enum_music_tracks_credits_role";
  DROP TYPE "public"."enum_music_tracks_streaming_links_platform";
  DROP TYPE "public"."enum_music_tracks_track_type";
  DROP TYPE "public"."enum_live2d_models_credits_role";
  DROP TYPE "public"."enum_3d_models_credits_role";
  DROP TYPE "public"."enum_3d_models_model_type";
  DROP TYPE "public"."enum_people_roles";
  DROP TYPE "public"."enum_people_social_links_platform";
  DROP TYPE "public"."enum_albums_streaming_links_platform";
  DROP TYPE "public"."enum_albums_album_type";
  DROP TYPE "public"."enum_channels_platform";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_profile_social_links_platform";
  DROP TYPE "public"."enum_livestream_settings_alert_position";
  DROP TYPE "public"."enum_livestream_settings_manual_override_platform";`)
}
