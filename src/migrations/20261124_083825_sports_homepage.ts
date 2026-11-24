import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_sports_homepage_slides_visual" AS ENUM('running', 'food', 'track', 'kitchen');
  CREATE TYPE "public"."enum_sports_homepage_services_icon" AS ENUM('activity', 'utensils', 'users', 'mic');
  CREATE TYPE "public"."enum_sports_homepage_audiences_icon" AS ENUM('trophy', 'sprout', 'footprints', 'heart');
  CREATE TYPE "public"."enum_sports_homepage_events_icon" AS ENUM('mic', 'messages', 'users');
  CREATE TYPE "public"."enum_sports_homepage_recipes_category" AS ENUM('Ana yemek', 'Tatlı', 'Tuzlu');
  CREATE TYPE "public"."enum_sports_homepage_recipes_image" AS ENUM('salad', 'fruit', 'preparation', 'breakfast');
  CREATE TYPE "public"."enum_sports_homepage_social_tiles_image" AS ENUM('salad', 'fruit', 'preparation', 'breakfast');
  CREATE TYPE "public"."enum_sports_homepage_media_type" AS ENUM('VİDEO', 'PODCAST', 'BLOG');
  ALTER TYPE "public"."enum_site_settings_navigation_anchor" ADD VALUE 'kimler-icin' BEFORE 'sss';
  ALTER TYPE "public"."enum_site_settings_navigation_anchor" ADD VALUE 'sistem' BEFORE 'sss';
  ALTER TYPE "public"."enum_site_settings_navigation_anchor" ADD VALUE 'tarifler' BEFORE 'sss';
  CREATE TABLE "sports_homepage_slides" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "visible" boolean DEFAULT true,
    "is_mock" boolean DEFAULT true,
    "service" varchar NOT NULL,
    "kicker" varchar NOT NULL,
    "first" varchar NOT NULL,
    "accent" varchar NOT NULL,
    "description" varchar NOT NULL,
    "label" varchar,
    "visual" "enum_sports_homepage_slides_visual" NOT NULL,
    "photo_id" integer
  );

  CREATE TABLE "sports_homepage_services_scope" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "text" varchar NOT NULL
  );

  CREATE TABLE "sports_homepage_services" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "visible" boolean DEFAULT true,
    "is_mock" boolean DEFAULT true,
    "slug" varchar NOT NULL,
    "title" varchar NOT NULL,
    "tag" varchar,
    "description" varchar NOT NULL,
    "icon" "enum_sports_homepage_services_icon" NOT NULL,
    "note" varchar
  );

  CREATE TABLE "sports_homepage_audiences" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "visible" boolean DEFAULT true,
    "is_mock" boolean DEFAULT true,
    "title" varchar NOT NULL,
    "subtitle" varchar,
    "description" varchar,
    "service" varchar NOT NULL,
    "icon" "enum_sports_homepage_audiences_icon" NOT NULL,
    "message" varchar
  );

  CREATE TABLE "sports_homepage_method" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "visible" boolean DEFAULT true,
    "is_mock" boolean DEFAULT true,
    "title" varchar NOT NULL,
    "label" varchar,
    "word" varchar NOT NULL,
    "description" varchar
  );

  CREATE TABLE "sports_homepage_events" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "visible" boolean DEFAULT true,
    "is_mock" boolean DEFAULT true,
    "type" varchar,
    "title" varchar NOT NULL,
    "date" varchar,
    "icon" "enum_sports_homepage_events_icon" NOT NULL
  );

  CREATE TABLE "sports_homepage_recipes" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "visible" boolean DEFAULT true,
    "is_mock" boolean DEFAULT true,
    "title" varchar NOT NULL,
    "description" varchar,
    "category" "enum_sports_homepage_recipes_category" NOT NULL,
    "time" varchar,
    "image" "enum_sports_homepage_recipes_image" NOT NULL,
    "photo_id" integer
  );

  CREATE TABLE "sports_homepage_social_tiles" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "visible" boolean DEFAULT true,
    "is_mock" boolean DEFAULT true,
    "title" varchar NOT NULL,
    "topic" varchar,
    "image" "enum_sports_homepage_social_tiles_image",
    "photo_id" integer
  );

  CREATE TABLE "sports_homepage_media" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "visible" boolean DEFAULT true,
    "is_mock" boolean DEFAULT true,
    "type" "enum_sports_homepage_media_type" NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar
  );

  CREATE TABLE "sports_homepage_testimonials" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "visible" boolean DEFAULT true,
    "is_mock" boolean DEFAULT true,
    "initials" varchar NOT NULL,
    "label" varchar,
    "quote" varchar NOT NULL
  );

  CREATE TABLE "sports_homepage_faqs" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "visible" boolean DEFAULT true,
    "is_mock" boolean DEFAULT true,
    "question" varchar NOT NULL,
    "answer" varchar NOT NULL
  );

  CREATE TABLE "sports_homepage_dashboard_rings" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL
  );

  CREATE TABLE "sports_homepage_dashboard_timeline" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL
  );

  CREATE TABLE "sports_homepage_dashboard_chips" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL
  );

  CREATE TABLE "sports_homepage_branches" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL
  );

  CREATE TABLE "sports_homepage" (
    "id" serial PRIMARY KEY NOT NULL,
    "initialized" boolean DEFAULT false,
    "is_mock" boolean DEFAULT true,
    "hero_headline" varchar NOT NULL,
    "hero_primary_label" varchar NOT NULL,
    "hero_secondary_label" varchar NOT NULL,
    "hero_note" varchar,
    "hero_scroll_label" varchar,
    "hero_visual_caption" varchar,
    "hero_autoplay" boolean DEFAULT true,
    "copy_audience_eyebrow" varchar NOT NULL,
    "copy_audience_title" varchar NOT NULL,
    "copy_audience_accent" varchar NOT NULL,
    "copy_audience_description" varchar,
    "copy_about_eyebrow" varchar NOT NULL,
    "copy_about_title" varchar NOT NULL,
    "copy_about_accent" varchar NOT NULL,
    "copy_about_bio" varchar,
    "copy_about_philosophy" varchar,
    "copy_about_note" varchar,
    "copy_about_credential" varchar,
    "copy_services_eyebrow" varchar NOT NULL,
    "copy_services_title" varchar NOT NULL,
    "copy_services_accent" varchar NOT NULL,
    "copy_services_description" varchar,
    "copy_events_eyebrow" varchar NOT NULL,
    "copy_events_title" varchar NOT NULL,
    "copy_events_accent" varchar NOT NULL,
    "copy_events_description" varchar,
    "copy_recipes_eyebrow" varchar NOT NULL,
    "copy_recipes_title" varchar NOT NULL,
    "copy_recipes_accent" varchar NOT NULL,
    "copy_recipes_description" varchar,
    "copy_social_eyebrow" varchar NOT NULL,
    "copy_social_title" varchar NOT NULL,
    "copy_social_accent" varchar NOT NULL,
    "copy_social_description" varchar,
    "copy_faq_eyebrow" varchar NOT NULL,
    "copy_faq_title" varchar NOT NULL,
    "copy_faq_accent" varchar NOT NULL,
    "copy_faq_description" varchar,
    "copy_contact_eyebrow" varchar NOT NULL,
    "copy_contact_title" varchar NOT NULL,
    "copy_contact_accent" varchar NOT NULL,
    "copy_contact_description" varchar,
    "copy_contact_note" varchar,
    "copy_method_eyebrow" varchar NOT NULL,
    "copy_method_title" varchar NOT NULL,
    "copy_method_accent" varchar NOT NULL,
    "copy_method_description" varchar,
    "copy_testimonials_eyebrow" varchar NOT NULL,
    "copy_testimonials_title" varchar NOT NULL,
    "copy_testimonials_accent" varchar NOT NULL,
    "copy_testimonials_description" varchar,
    "dashboard_title" varchar NOT NULL,
    "dashboard_eyebrow" varchar,
    "dashboard_disclaimer" varchar NOT NULL,
    "dashboard_timeline_title" varchar,
    "sections_audience" boolean DEFAULT true,
    "sections_about" boolean DEFAULT true,
    "sections_services" boolean DEFAULT true,
    "sections_method" boolean DEFAULT true,
    "sections_events" boolean DEFAULT true,
    "sections_recipes" boolean DEFAULT true,
    "sections_social" boolean DEFAULT true,
    "sections_testimonials" boolean DEFAULT true,
    "sections_faq" boolean DEFAULT true,
    "sections_contact" boolean DEFAULT true,
    "sections_dashboard" boolean DEFAULT true,
    "sections_branches" boolean DEFAULT true,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  ALTER TABLE "site_settings" ADD COLUMN "brand_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "brand_title_status" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "brand_descriptor_status" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "brand_booking_url" varchar;
  ALTER TABLE "sports_homepage_slides" ADD CONSTRAINT "sports_homepage_slides_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sports_homepage_slides" ADD CONSTRAINT "sports_homepage_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sports_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sports_homepage_services_scope" ADD CONSTRAINT "sports_homepage_services_scope_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sports_homepage_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sports_homepage_services" ADD CONSTRAINT "sports_homepage_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sports_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sports_homepage_audiences" ADD CONSTRAINT "sports_homepage_audiences_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sports_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sports_homepage_method" ADD CONSTRAINT "sports_homepage_method_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sports_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sports_homepage_events" ADD CONSTRAINT "sports_homepage_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sports_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sports_homepage_recipes" ADD CONSTRAINT "sports_homepage_recipes_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sports_homepage_recipes" ADD CONSTRAINT "sports_homepage_recipes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sports_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sports_homepage_social_tiles" ADD CONSTRAINT "sports_homepage_social_tiles_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sports_homepage_social_tiles" ADD CONSTRAINT "sports_homepage_social_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sports_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sports_homepage_media" ADD CONSTRAINT "sports_homepage_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sports_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sports_homepage_testimonials" ADD CONSTRAINT "sports_homepage_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sports_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sports_homepage_faqs" ADD CONSTRAINT "sports_homepage_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sports_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sports_homepage_dashboard_rings" ADD CONSTRAINT "sports_homepage_dashboard_rings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sports_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sports_homepage_dashboard_timeline" ADD CONSTRAINT "sports_homepage_dashboard_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sports_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sports_homepage_dashboard_chips" ADD CONSTRAINT "sports_homepage_dashboard_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sports_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sports_homepage_branches" ADD CONSTRAINT "sports_homepage_branches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sports_homepage"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "sports_homepage_slides_order_idx" ON "sports_homepage_slides" USING btree ("_order");
  CREATE INDEX "sports_homepage_slides_parent_id_idx" ON "sports_homepage_slides" USING btree ("_parent_id");
  CREATE INDEX "sports_homepage_slides_photo_idx" ON "sports_homepage_slides" USING btree ("photo_id");
  CREATE INDEX "sports_homepage_services_scope_order_idx" ON "sports_homepage_services_scope" USING btree ("_order");
  CREATE INDEX "sports_homepage_services_scope_parent_id_idx" ON "sports_homepage_services_scope" USING btree ("_parent_id");
  CREATE INDEX "sports_homepage_services_order_idx" ON "sports_homepage_services" USING btree ("_order");
  CREATE INDEX "sports_homepage_services_parent_id_idx" ON "sports_homepage_services" USING btree ("_parent_id");
  CREATE INDEX "sports_homepage_audiences_order_idx" ON "sports_homepage_audiences" USING btree ("_order");
  CREATE INDEX "sports_homepage_audiences_parent_id_idx" ON "sports_homepage_audiences" USING btree ("_parent_id");
  CREATE INDEX "sports_homepage_method_order_idx" ON "sports_homepage_method" USING btree ("_order");
  CREATE INDEX "sports_homepage_method_parent_id_idx" ON "sports_homepage_method" USING btree ("_parent_id");
  CREATE INDEX "sports_homepage_events_order_idx" ON "sports_homepage_events" USING btree ("_order");
  CREATE INDEX "sports_homepage_events_parent_id_idx" ON "sports_homepage_events" USING btree ("_parent_id");
  CREATE INDEX "sports_homepage_recipes_order_idx" ON "sports_homepage_recipes" USING btree ("_order");
  CREATE INDEX "sports_homepage_recipes_parent_id_idx" ON "sports_homepage_recipes" USING btree ("_parent_id");
  CREATE INDEX "sports_homepage_recipes_photo_idx" ON "sports_homepage_recipes" USING btree ("photo_id");
  CREATE INDEX "sports_homepage_social_tiles_order_idx" ON "sports_homepage_social_tiles" USING btree ("_order");
  CREATE INDEX "sports_homepage_social_tiles_parent_id_idx" ON "sports_homepage_social_tiles" USING btree ("_parent_id");
  CREATE INDEX "sports_homepage_social_tiles_photo_idx" ON "sports_homepage_social_tiles" USING btree ("photo_id");
  CREATE INDEX "sports_homepage_media_order_idx" ON "sports_homepage_media" USING btree ("_order");
  CREATE INDEX "sports_homepage_media_parent_id_idx" ON "sports_homepage_media" USING btree ("_parent_id");
  CREATE INDEX "sports_homepage_testimonials_order_idx" ON "sports_homepage_testimonials" USING btree ("_order");
  CREATE INDEX "sports_homepage_testimonials_parent_id_idx" ON "sports_homepage_testimonials" USING btree ("_parent_id");
  CREATE INDEX "sports_homepage_faqs_order_idx" ON "sports_homepage_faqs" USING btree ("_order");
  CREATE INDEX "sports_homepage_faqs_parent_id_idx" ON "sports_homepage_faqs" USING btree ("_parent_id");
  CREATE INDEX "sports_homepage_dashboard_rings_order_idx" ON "sports_homepage_dashboard_rings" USING btree ("_order");
  CREATE INDEX "sports_homepage_dashboard_rings_parent_id_idx" ON "sports_homepage_dashboard_rings" USING btree ("_parent_id");
  CREATE INDEX "sports_homepage_dashboard_timeline_order_idx" ON "sports_homepage_dashboard_timeline" USING btree ("_order");
  CREATE INDEX "sports_homepage_dashboard_timeline_parent_id_idx" ON "sports_homepage_dashboard_timeline" USING btree ("_parent_id");
  CREATE INDEX "sports_homepage_dashboard_chips_order_idx" ON "sports_homepage_dashboard_chips" USING btree ("_order");
  CREATE INDEX "sports_homepage_dashboard_chips_parent_id_idx" ON "sports_homepage_dashboard_chips" USING btree ("_parent_id");
  CREATE INDEX "sports_homepage_branches_order_idx" ON "sports_homepage_branches" USING btree ("_order");
  CREATE INDEX "sports_homepage_branches_parent_id_idx" ON "sports_homepage_branches" USING btree ("_parent_id");`);
  for (const table of [
    "sports_homepage_slides",
    "sports_homepage_services_scope",
    "sports_homepage_services",
    "sports_homepage_audiences",
    "sports_homepage_method",
    "sports_homepage_events",
    "sports_homepage_recipes",
    "sports_homepage_social_tiles",
    "sports_homepage_media",
    "sports_homepage_testimonials",
    "sports_homepage_faqs",
    "sports_homepage_dashboard_rings",
    "sports_homepage_dashboard_timeline",
    "sports_homepage_dashboard_chips",
    "sports_homepage_branches",
    "sports_homepage",
  ])
    await db.execute(
      sql.raw('ALTER TABLE "public"."' + table + '" ENABLE ROW LEVEL SECURITY'),
    );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "sports_homepage_slides" CASCADE;
  DROP TABLE "sports_homepage_services_scope" CASCADE;
  DROP TABLE "sports_homepage_services" CASCADE;
  DROP TABLE "sports_homepage_audiences" CASCADE;
  DROP TABLE "sports_homepage_method" CASCADE;
  DROP TABLE "sports_homepage_events" CASCADE;
  DROP TABLE "sports_homepage_recipes" CASCADE;
  DROP TABLE "sports_homepage_social_tiles" CASCADE;
  DROP TABLE "sports_homepage_media" CASCADE;
  DROP TABLE "sports_homepage_testimonials" CASCADE;
  DROP TABLE "sports_homepage_faqs" CASCADE;
  DROP TABLE "sports_homepage_dashboard_rings" CASCADE;
  DROP TABLE "sports_homepage_dashboard_timeline" CASCADE;
  DROP TABLE "sports_homepage_dashboard_chips" CASCADE;
  DROP TABLE "sports_homepage_branches" CASCADE;
  DROP TABLE "sports_homepage" CASCADE;
  ALTER TABLE "site_settings_navigation" ALTER COLUMN "anchor" SET DATA TYPE text;
  DROP TYPE "public"."enum_site_settings_navigation_anchor";
  CREATE TYPE "public"."enum_site_settings_navigation_anchor" AS ENUM('hakkimda', 'hizmetler', 'surec', 'sss', 'iletisim');
  ALTER TABLE "site_settings_navigation" ALTER COLUMN "anchor" SET DATA TYPE "public"."enum_site_settings_navigation_anchor" USING "anchor"::"public"."enum_site_settings_navigation_anchor";
  ALTER TABLE "site_settings" DROP COLUMN "brand_title";
  ALTER TABLE "site_settings" DROP COLUMN "brand_title_status";
  ALTER TABLE "site_settings" DROP COLUMN "brand_descriptor_status";
  ALTER TABLE "site_settings" DROP COLUMN "brand_booking_url";
  DROP TYPE "public"."enum_sports_homepage_slides_visual";
  DROP TYPE "public"."enum_sports_homepage_services_icon";
  DROP TYPE "public"."enum_sports_homepage_audiences_icon";
  DROP TYPE "public"."enum_sports_homepage_events_icon";
  DROP TYPE "public"."enum_sports_homepage_recipes_category";
  DROP TYPE "public"."enum_sports_homepage_recipes_image";
  DROP TYPE "public"."enum_sports_homepage_social_tiles_image";
  DROP TYPE "public"."enum_sports_homepage_media_type";`);
}
