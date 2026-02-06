import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_post_type" AS ENUM('blog', 'stream', 'event', 'release', 'collab', 'general');
  CREATE TYPE "public"."enum_artworks_artwork_type" AS ENUM('fanart', 'official', 'commissioned', 'other');
  CREATE TYPE "public"."enum_videos_video_type" AS ENUM('music-video', 'stream-archive', 'clip', 'short', 'animation', 'other');
  CREATE TYPE "public"."enum_videos_platform" AS ENUM('youtube', 'twitch', 'tiktok', 'bilibili', 'other');
  CREATE TYPE "public"."enum_music_tracks_streaming_links_platform" AS ENUM('youtube', 'youtube-music', 'spotify', 'apple-music', 'soundcloud', 'bandcamp', 'other');
  CREATE TYPE "public"."enum_music_tracks_track_type" AS ENUM('cover', 'original', 'remix', 'karaoke', 'other');
  CREATE TYPE "public"."enum_models_model_type" AS ENUM('live2d', 'pngtuber', '2d-other', 'vrm', 'mmd', 'fbx', '3d-other');
  CREATE TYPE "public"."enum_albums_streaming_links_platform" AS ENUM('youtube', 'spotify', 'apple-music', 'bandcamp', 'other');
  CREATE TYPE "public"."enum_albums_album_type" AS ENUM('single', 'ep', 'album', 'compilation');
  CREATE TYPE "public"."enum_socials_platform" AS ENUM('twitter', 'bluesky', 'youtube', 'twitch', 'instagram', 'tiktok', 'pixiv', 'vgen', 'website', 'other');
  CREATE TYPE "public"."enum_interactive_media_location" AS ENUM('main-character', 'landing-left', 'landing-bottom-right', 'landing-bg', 'page-artworks', 'page-discography', 'page-about', 'page-models');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_themes_interactive_media_slot" AS ENUM('main-character', 'landing-left', 'landing-bg', 'landing-bottom-right', 'page-artworks', 'page-discography', 'page-about', 'page-models');
  CREATE TYPE "public"."enum_livestream_settings_alert_position" AS ENUM('top-right', 'top-left', 'bottom-right', 'bottom-left');
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"color" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts_featured_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "posts_external_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "posts_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" varchar NOT NULL,
  	"person_id" integer,
  	"name" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"status" "enum_posts_status" DEFAULT 'draft' NOT NULL,
  	"is_pinned" boolean DEFAULT false,
  	"post_type" "enum_posts_post_type" DEFAULT 'general' NOT NULL,
  	"content" jsonb,
  	"excerpt" varchar,
  	"published_at" timestamp(3) with time zone,
  	"event_date" timestamp(3) with time zone,
  	"location" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"people_id" integer
  );
  
  CREATE TABLE "artworks_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" varchar NOT NULL,
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
  
  CREATE TABLE "videos_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" varchar NOT NULL,
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
  	"role" varchar NOT NULL,
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
  
  CREATE TABLE "models_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"caption" varchar,
  	"is_featured" boolean DEFAULT false
  );
  
  CREATE TABLE "models_ref_sheets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "models_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" varchar NOT NULL,
  	"artist_id" integer,
  	"name" varchar
  );
  
  CREATE TABLE "models" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"version" varchar,
  	"model_type" "enum_models_model_type" NOT NULL,
  	"description" jsonb,
  	"include_model_file" boolean DEFAULT false,
  	"model_file_id" integer,
  	"technical_specs_poly_count" numeric,
  	"technical_specs_texture_resolution" varchar,
  	"technical_specs_blendshapes" numeric,
  	"technical_specs_bone_count" numeric,
  	"debut_date" timestamp(3) with time zone,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "models_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "people" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"roles" varchar,
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
  	"socials_id" integer,
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
  
  CREATE TABLE "socials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"platform" "enum_socials_platform" NOT NULL,
  	"url" varchar NOT NULL,
  	"avatar_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "interactive_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"location" "enum_interactive_media_location" NOT NULL,
  	"default_state_media_id" integer NOT NULL,
  	"default_state_alt" varchar,
  	"default_state_sound_id" integer,
  	"hover_state_enabled" boolean DEFAULT false,
  	"hover_state_media_id" integer,
  	"hover_state_alt" varchar,
  	"hover_state_sound_id" integer,
  	"click_state_enabled" boolean DEFAULT false,
  	"click_state_media_id" integer,
  	"click_state_alt" varchar,
  	"click_state_sound_id" integer,
  	"cursor_effect_enabled" boolean DEFAULT false,
  	"cursor_effect_media_id" integer,
  	"cursor_effect_duration" numeric DEFAULT 1000,
  	"cursor_effect_size" numeric DEFAULT 40,
  	"depth" numeric DEFAULT -20,
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
  	"posts_id" integer,
  	"artworks_id" integer,
  	"videos_id" integer,
  	"music_tracks_id" integer,
  	"models_id" integer,
  	"people_id" integer,
  	"albums_id" integer,
  	"socials_id" integer,
  	"interactive_media_id" integer,
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
  
  CREATE TABLE "profile_hashtags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "profile" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"person_id" integer,
  	"current_model_id" integer,
  	"name" varchar NOT NULL,
  	"alternate_name" varchar,
  	"tagline" varchar,
  	"short_bio" varchar,
  	"debut_date" timestamp(3) with time zone,
  	"birthday" timestamp(3) with time zone,
  	"height" varchar,
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
  
  CREATE TABLE "themes_interactive_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slot" "enum_themes_interactive_media_slot" NOT NULL,
  	"configuration_id" integer NOT NULL
  );
  
  CREATE TABLE "themes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"phone_bg" varchar DEFAULT '#1e3a8a',
  	"phone_text" varchar DEFAULT '#ffffff',
  	"phone_surface" varchar DEFAULT '#ffffff',
  	"phone_primary" varchar DEFAULT '#3b82f6',
  	"page_bg" varchar DEFAULT '#1e3a8a',
  	"page_text" varchar DEFAULT '#ffffff',
  	"page_surface" varchar DEFAULT '#ffffff',
  	"page_primary" varchar DEFAULT '#3b82f6',
  	"modal_bg" varchar DEFAULT '#1e293b',
  	"modal_text" varchar DEFAULT '#ffffff',
  	"modal_surface" varchar DEFAULT '#ffffff',
  	"modal_primary" varchar DEFAULT '#3b82f6',
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
  	"manual_override_stream_url" varchar,
  	"manual_override_stream_title" varchar,
  	"manual_override_thumbnail_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "livestream_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"socials_id" integer
  );
  
  ALTER TABLE "posts_featured_images" ADD CONSTRAINT "posts_featured_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_featured_images" ADD CONSTRAINT "posts_featured_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_external_links" ADD CONSTRAINT "posts_external_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_credits" ADD CONSTRAINT "posts_credits_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_credits" ADD CONSTRAINT "posts_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artworks_credits" ADD CONSTRAINT "artworks_credits_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artworks_credits" ADD CONSTRAINT "artworks_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artworks" ADD CONSTRAINT "artworks_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "artworks_rels" ADD CONSTRAINT "artworks_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artworks_rels" ADD CONSTRAINT "artworks_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artworks_rels" ADD CONSTRAINT "artworks_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
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
  ALTER TABLE "models_showcase" ADD CONSTRAINT "models_showcase_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "models_showcase" ADD CONSTRAINT "models_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "models_ref_sheets" ADD CONSTRAINT "models_ref_sheets_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "models_ref_sheets" ADD CONSTRAINT "models_ref_sheets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "models_credits" ADD CONSTRAINT "models_credits_artist_id_people_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "models_credits" ADD CONSTRAINT "models_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "models" ADD CONSTRAINT "models_model_file_id_media_id_fk" FOREIGN KEY ("model_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "models_rels" ADD CONSTRAINT "models_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "models_rels" ADD CONSTRAINT "models_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people_rels" ADD CONSTRAINT "people_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people_rels" ADD CONSTRAINT "people_rels_socials_fk" FOREIGN KEY ("socials_id") REFERENCES "public"."socials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people_rels" ADD CONSTRAINT "people_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums_streaming_links" ADD CONSTRAINT "albums_streaming_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums" ADD CONSTRAINT "albums_cover_art_id_media_id_fk" FOREIGN KEY ("cover_art_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "albums_rels" ADD CONSTRAINT "albums_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums_rels" ADD CONSTRAINT "albums_rels_music_tracks_fk" FOREIGN KEY ("music_tracks_id") REFERENCES "public"."music_tracks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums_rels" ADD CONSTRAINT "albums_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "socials" ADD CONSTRAINT "socials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "interactive_media" ADD CONSTRAINT "interactive_media_default_state_media_id_media_id_fk" FOREIGN KEY ("default_state_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "interactive_media" ADD CONSTRAINT "interactive_media_default_state_sound_id_media_id_fk" FOREIGN KEY ("default_state_sound_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "interactive_media" ADD CONSTRAINT "interactive_media_hover_state_media_id_media_id_fk" FOREIGN KEY ("hover_state_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "interactive_media" ADD CONSTRAINT "interactive_media_hover_state_sound_id_media_id_fk" FOREIGN KEY ("hover_state_sound_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "interactive_media" ADD CONSTRAINT "interactive_media_click_state_media_id_media_id_fk" FOREIGN KEY ("click_state_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "interactive_media" ADD CONSTRAINT "interactive_media_click_state_sound_id_media_id_fk" FOREIGN KEY ("click_state_sound_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "interactive_media" ADD CONSTRAINT "interactive_media_cursor_effect_media_id_media_id_fk" FOREIGN KEY ("cursor_effect_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_artworks_fk" FOREIGN KEY ("artworks_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_music_tracks_fk" FOREIGN KEY ("music_tracks_id") REFERENCES "public"."music_tracks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_models_fk" FOREIGN KEY ("models_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_albums_fk" FOREIGN KEY ("albums_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_socials_fk" FOREIGN KEY ("socials_id") REFERENCES "public"."socials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_interactive_media_fk" FOREIGN KEY ("interactive_media_id") REFERENCES "public"."interactive_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_traits_items" ADD CONSTRAINT "profile_traits_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_traits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_traits" ADD CONSTRAINT "profile_traits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_hashtags" ADD CONSTRAINT "profile_hashtags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile" ADD CONSTRAINT "profile_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile" ADD CONSTRAINT "profile_current_model_id_models_id_fk" FOREIGN KEY ("current_model_id") REFERENCES "public"."models"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_seo_keywords" ADD CONSTRAINT "site_settings_seo_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "themes_interactive_media" ADD CONSTRAINT "themes_interactive_media_configuration_id_interactive_media_id_fk" FOREIGN KEY ("configuration_id") REFERENCES "public"."interactive_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "themes_interactive_media" ADD CONSTRAINT "themes_interactive_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "livestream_settings" ADD CONSTRAINT "livestream_settings_manual_override_thumbnail_id_media_id_fk" FOREIGN KEY ("manual_override_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "livestream_settings_rels" ADD CONSTRAINT "livestream_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."livestream_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "livestream_settings_rels" ADD CONSTRAINT "livestream_settings_rels_socials_fk" FOREIGN KEY ("socials_id") REFERENCES "public"."socials"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "posts_featured_images_order_idx" ON "posts_featured_images" USING btree ("_order");
  CREATE INDEX "posts_featured_images_parent_id_idx" ON "posts_featured_images" USING btree ("_parent_id");
  CREATE INDEX "posts_featured_images_image_idx" ON "posts_featured_images" USING btree ("image_id");
  CREATE INDEX "posts_external_links_order_idx" ON "posts_external_links" USING btree ("_order");
  CREATE INDEX "posts_external_links_parent_id_idx" ON "posts_external_links" USING btree ("_parent_id");
  CREATE INDEX "posts_credits_order_idx" ON "posts_credits" USING btree ("_order");
  CREATE INDEX "posts_credits_parent_id_idx" ON "posts_credits" USING btree ("_parent_id");
  CREATE INDEX "posts_credits_person_idx" ON "posts_credits" USING btree ("person_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_tags_id_idx" ON "posts_rels" USING btree ("tags_id");
  CREATE INDEX "posts_rels_people_id_idx" ON "posts_rels" USING btree ("people_id");
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
  CREATE INDEX "models_showcase_order_idx" ON "models_showcase" USING btree ("_order");
  CREATE INDEX "models_showcase_parent_id_idx" ON "models_showcase" USING btree ("_parent_id");
  CREATE INDEX "models_showcase_media_idx" ON "models_showcase" USING btree ("media_id");
  CREATE INDEX "models_ref_sheets_order_idx" ON "models_ref_sheets" USING btree ("_order");
  CREATE INDEX "models_ref_sheets_parent_id_idx" ON "models_ref_sheets" USING btree ("_parent_id");
  CREATE INDEX "models_ref_sheets_media_idx" ON "models_ref_sheets" USING btree ("media_id");
  CREATE INDEX "models_credits_order_idx" ON "models_credits" USING btree ("_order");
  CREATE INDEX "models_credits_parent_id_idx" ON "models_credits" USING btree ("_parent_id");
  CREATE INDEX "models_credits_artist_idx" ON "models_credits" USING btree ("artist_id");
  CREATE INDEX "models_model_file_idx" ON "models" USING btree ("model_file_id");
  CREATE INDEX "models_updated_at_idx" ON "models" USING btree ("updated_at");
  CREATE INDEX "models_created_at_idx" ON "models" USING btree ("created_at");
  CREATE INDEX "models_rels_order_idx" ON "models_rels" USING btree ("order");
  CREATE INDEX "models_rels_parent_idx" ON "models_rels" USING btree ("parent_id");
  CREATE INDEX "models_rels_path_idx" ON "models_rels" USING btree ("path");
  CREATE INDEX "models_rels_tags_id_idx" ON "models_rels" USING btree ("tags_id");
  CREATE INDEX "people_avatar_idx" ON "people" USING btree ("avatar_id");
  CREATE INDEX "people_updated_at_idx" ON "people" USING btree ("updated_at");
  CREATE INDEX "people_created_at_idx" ON "people" USING btree ("created_at");
  CREATE INDEX "people_rels_order_idx" ON "people_rels" USING btree ("order");
  CREATE INDEX "people_rels_parent_idx" ON "people_rels" USING btree ("parent_id");
  CREATE INDEX "people_rels_path_idx" ON "people_rels" USING btree ("path");
  CREATE INDEX "people_rels_socials_id_idx" ON "people_rels" USING btree ("socials_id");
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
  CREATE INDEX "socials_avatar_idx" ON "socials" USING btree ("avatar_id");
  CREATE INDEX "socials_updated_at_idx" ON "socials" USING btree ("updated_at");
  CREATE INDEX "socials_created_at_idx" ON "socials" USING btree ("created_at");
  CREATE UNIQUE INDEX "interactive_media_location_idx" ON "interactive_media" USING btree ("location");
  CREATE INDEX "interactive_media_default_state_default_state_media_idx" ON "interactive_media" USING btree ("default_state_media_id");
  CREATE INDEX "interactive_media_default_state_default_state_sound_idx" ON "interactive_media" USING btree ("default_state_sound_id");
  CREATE INDEX "interactive_media_hover_state_hover_state_media_idx" ON "interactive_media" USING btree ("hover_state_media_id");
  CREATE INDEX "interactive_media_hover_state_hover_state_sound_idx" ON "interactive_media" USING btree ("hover_state_sound_id");
  CREATE INDEX "interactive_media_click_state_click_state_media_idx" ON "interactive_media" USING btree ("click_state_media_id");
  CREATE INDEX "interactive_media_click_state_click_state_sound_idx" ON "interactive_media" USING btree ("click_state_sound_id");
  CREATE INDEX "interactive_media_cursor_effect_cursor_effect_media_idx" ON "interactive_media" USING btree ("cursor_effect_media_id");
  CREATE INDEX "interactive_media_updated_at_idx" ON "interactive_media" USING btree ("updated_at");
  CREATE INDEX "interactive_media_created_at_idx" ON "interactive_media" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
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
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_artworks_id_idx" ON "payload_locked_documents_rels" USING btree ("artworks_id");
  CREATE INDEX "payload_locked_documents_rels_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("videos_id");
  CREATE INDEX "payload_locked_documents_rels_music_tracks_id_idx" ON "payload_locked_documents_rels" USING btree ("music_tracks_id");
  CREATE INDEX "payload_locked_documents_rels_models_id_idx" ON "payload_locked_documents_rels" USING btree ("models_id");
  CREATE INDEX "payload_locked_documents_rels_people_id_idx" ON "payload_locked_documents_rels" USING btree ("people_id");
  CREATE INDEX "payload_locked_documents_rels_albums_id_idx" ON "payload_locked_documents_rels" USING btree ("albums_id");
  CREATE INDEX "payload_locked_documents_rels_socials_id_idx" ON "payload_locked_documents_rels" USING btree ("socials_id");
  CREATE INDEX "payload_locked_documents_rels_interactive_media_id_idx" ON "payload_locked_documents_rels" USING btree ("interactive_media_id");
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
  CREATE INDEX "profile_hashtags_order_idx" ON "profile_hashtags" USING btree ("_order");
  CREATE INDEX "profile_hashtags_parent_id_idx" ON "profile_hashtags" USING btree ("_parent_id");
  CREATE INDEX "profile_person_idx" ON "profile" USING btree ("person_id");
  CREATE INDEX "profile_current_model_idx" ON "profile" USING btree ("current_model_id");
  CREATE INDEX "site_settings_seo_keywords_order_idx" ON "site_settings_seo_keywords" USING btree ("_order");
  CREATE INDEX "site_settings_seo_keywords_parent_id_idx" ON "site_settings_seo_keywords" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_og_image_idx" ON "site_settings" USING btree ("og_image_id");
  CREATE INDEX "themes_interactive_media_order_idx" ON "themes_interactive_media" USING btree ("_order");
  CREATE INDEX "themes_interactive_media_parent_id_idx" ON "themes_interactive_media" USING btree ("_parent_id");
  CREATE INDEX "themes_interactive_media_configuration_idx" ON "themes_interactive_media" USING btree ("configuration_id");
  CREATE INDEX "livestream_settings_manual_override_manual_override_thum_idx" ON "livestream_settings" USING btree ("manual_override_thumbnail_id");
  CREATE INDEX "livestream_settings_rels_order_idx" ON "livestream_settings_rels" USING btree ("order");
  CREATE INDEX "livestream_settings_rels_parent_idx" ON "livestream_settings_rels" USING btree ("parent_id");
  CREATE INDEX "livestream_settings_rels_path_idx" ON "livestream_settings_rels" USING btree ("path");
  CREATE INDEX "livestream_settings_rels_socials_id_idx" ON "livestream_settings_rels" USING btree ("socials_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "tags" CASCADE;
  DROP TABLE "posts_featured_images" CASCADE;
  DROP TABLE "posts_external_links" CASCADE;
  DROP TABLE "posts_credits" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "artworks_credits" CASCADE;
  DROP TABLE "artworks" CASCADE;
  DROP TABLE "artworks_rels" CASCADE;
  DROP TABLE "videos_credits" CASCADE;
  DROP TABLE "videos" CASCADE;
  DROP TABLE "videos_rels" CASCADE;
  DROP TABLE "music_tracks_credits" CASCADE;
  DROP TABLE "music_tracks_streaming_links" CASCADE;
  DROP TABLE "music_tracks" CASCADE;
  DROP TABLE "music_tracks_rels" CASCADE;
  DROP TABLE "models_showcase" CASCADE;
  DROP TABLE "models_ref_sheets" CASCADE;
  DROP TABLE "models_credits" CASCADE;
  DROP TABLE "models" CASCADE;
  DROP TABLE "models_rels" CASCADE;
  DROP TABLE "people" CASCADE;
  DROP TABLE "people_rels" CASCADE;
  DROP TABLE "albums_streaming_links" CASCADE;
  DROP TABLE "albums" CASCADE;
  DROP TABLE "albums_rels" CASCADE;
  DROP TABLE "socials" CASCADE;
  DROP TABLE "interactive_media" CASCADE;
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
  DROP TABLE "profile_hashtags" CASCADE;
  DROP TABLE "profile" CASCADE;
  DROP TABLE "site_settings_seo_keywords" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "themes_interactive_media" CASCADE;
  DROP TABLE "themes" CASCADE;
  DROP TABLE "livestream_settings" CASCADE;
  DROP TABLE "livestream_settings_rels" CASCADE;
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum_posts_post_type";
  DROP TYPE "public"."enum_artworks_artwork_type";
  DROP TYPE "public"."enum_videos_video_type";
  DROP TYPE "public"."enum_videos_platform";
  DROP TYPE "public"."enum_music_tracks_streaming_links_platform";
  DROP TYPE "public"."enum_music_tracks_track_type";
  DROP TYPE "public"."enum_models_model_type";
  DROP TYPE "public"."enum_albums_streaming_links_platform";
  DROP TYPE "public"."enum_albums_album_type";
  DROP TYPE "public"."enum_socials_platform";
  DROP TYPE "public"."enum_interactive_media_location";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_themes_interactive_media_slot";
  DROP TYPE "public"."enum_livestream_settings_alert_position";`)
}
