import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_themes_interactive_media_slot" AS ENUM('landing-character', 'landing-left', 'page-artworks', 'page-discography', 'page-about', 'page-models');
  CREATE TABLE "interactive_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"location" varchar NOT NULL,
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
  
  CREATE TABLE "themes_interactive_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slot" "enum_themes_interactive_media_slot" NOT NULL,
  	"configuration_id" integer NOT NULL
  );
  
  ALTER TABLE "themes" DROP CONSTRAINT "themes_landing_page_media_id_media_id_fk";
  
  ALTER TABLE "themes" DROP CONSTRAINT "themes_artwork_page_media_id_media_id_fk";
  
  ALTER TABLE "themes" DROP CONSTRAINT "themes_music_page_media_id_media_id_fk";
  
  DROP INDEX "themes_landing_page_media_idx";
  DROP INDEX "themes_artwork_page_media_idx";
  DROP INDEX "themes_music_page_media_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "interactive_media_id" integer;
  ALTER TABLE "interactive_media" ADD CONSTRAINT "interactive_media_default_state_media_id_media_id_fk" FOREIGN KEY ("default_state_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "interactive_media" ADD CONSTRAINT "interactive_media_default_state_sound_id_media_id_fk" FOREIGN KEY ("default_state_sound_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "interactive_media" ADD CONSTRAINT "interactive_media_hover_state_media_id_media_id_fk" FOREIGN KEY ("hover_state_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "interactive_media" ADD CONSTRAINT "interactive_media_hover_state_sound_id_media_id_fk" FOREIGN KEY ("hover_state_sound_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "interactive_media" ADD CONSTRAINT "interactive_media_click_state_media_id_media_id_fk" FOREIGN KEY ("click_state_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "interactive_media" ADD CONSTRAINT "interactive_media_click_state_sound_id_media_id_fk" FOREIGN KEY ("click_state_sound_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "interactive_media" ADD CONSTRAINT "interactive_media_cursor_effect_media_id_media_id_fk" FOREIGN KEY ("cursor_effect_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "themes_interactive_media" ADD CONSTRAINT "themes_interactive_media_configuration_id_interactive_media_id_fk" FOREIGN KEY ("configuration_id") REFERENCES "public"."interactive_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "themes_interactive_media" ADD CONSTRAINT "themes_interactive_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action;
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
  CREATE INDEX "themes_interactive_media_order_idx" ON "themes_interactive_media" USING btree ("_order");
  CREATE INDEX "themes_interactive_media_parent_id_idx" ON "themes_interactive_media" USING btree ("_parent_id");
  CREATE INDEX "themes_interactive_media_configuration_idx" ON "themes_interactive_media" USING btree ("configuration_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_interactive_media_fk" FOREIGN KEY ("interactive_media_id") REFERENCES "public"."interactive_media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_interactive_media_id_idx" ON "payload_locked_documents_rels" USING btree ("interactive_media_id");
  ALTER TABLE "themes" DROP COLUMN "landing_page_media_id";
  ALTER TABLE "themes" DROP COLUMN "artwork_page_media_id";
  ALTER TABLE "themes" DROP COLUMN "music_page_media_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "interactive_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "themes_interactive_media" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "interactive_media" CASCADE;
  DROP TABLE "themes_interactive_media" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_interactive_media_fk";
  
  DROP INDEX "payload_locked_documents_rels_interactive_media_id_idx";
  ALTER TABLE "themes" ADD COLUMN "landing_page_media_id" integer;
  ALTER TABLE "themes" ADD COLUMN "artwork_page_media_id" integer;
  ALTER TABLE "themes" ADD COLUMN "music_page_media_id" integer;
  ALTER TABLE "themes" ADD CONSTRAINT "themes_landing_page_media_id_media_id_fk" FOREIGN KEY ("landing_page_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "themes" ADD CONSTRAINT "themes_artwork_page_media_id_media_id_fk" FOREIGN KEY ("artwork_page_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "themes" ADD CONSTRAINT "themes_music_page_media_id_media_id_fk" FOREIGN KEY ("music_page_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "themes_landing_page_media_idx" ON "themes" USING btree ("landing_page_media_id");
  CREATE INDEX "themes_artwork_page_media_idx" ON "themes" USING btree ("artwork_page_media_id");
  CREATE INDEX "themes_music_page_media_idx" ON "themes" USING btree ("music_page_media_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "interactive_media_id";
  DROP TYPE "public"."enum_themes_interactive_media_slot";`)
}
