import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin');
  CREATE TYPE "public"."enum_site_settings_navigation_anchor" AS ENUM('hakkimda', 'hizmetler', 'surec', 'sss', 'iletisim');
  CREATE TYPE "public"."enum_homepage_services_icon" AS ENUM('leaf', 'screen', 'activity', 'flower', 'sprout', 'heart');
  CREATE TYPE "public"."enum_homepage_process_image" AS ENUM('salad', 'fruit', 'preparation', 'breakfast');
  CREATE TYPE "public"."enum_homepage_goals_image" AS ENUM('salad', 'fruit', 'preparation', 'breakfast');
  CREATE TYPE "public"."enum_homepage_blog_image" AS ENUM('salad', 'fruit', 'preparation', 'breakfast');
  CREATE TABLE "users_sessions" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "created_at" timestamp(3) with time zone,
    "expires_at" timestamp(3) with time zone NOT NULL
  );

  CREATE TABLE "users" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "role" "enum_users_role" DEFAULT 'admin' NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "email" varchar NOT NULL,
    "reset_password_token" varchar,
    "reset_password_expiration" timestamp(3) with time zone,
    "salt" varchar,
    "hash" varchar,
    "reset_password_requested_at" timestamp(3) with time zone,
    "login_attempts" numeric DEFAULT 0,
    "lock_until" timestamp(3) with time zone
  );

  CREATE TABLE "media" (
    "id" serial PRIMARY KEY NOT NULL,
    "alt" varchar NOT NULL,
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
    "focal_y" numeric
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

  CREATE TABLE "site_settings_navigation" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "anchor" "enum_site_settings_navigation_anchor" NOT NULL,
    "label" varchar NOT NULL,
    "visible" boolean DEFAULT true
  );

  CREATE TABLE "site_settings" (
    "id" serial PRIMARY KEY NOT NULL,
    "initialized" boolean DEFAULT false,
    "brand_name" varchar NOT NULL,
    "brand_tagline" varchar,
    "brand_description" varchar,
    "brand_appointment_label" varchar,
    "brand_footer_eyebrow" varchar,
    "brand_footer_note" varchar,
    "contact_is_mock" boolean DEFAULT true,
    "contact_phone" varchar,
    "contact_email" varchar,
    "contact_address" varchar,
    "contact_hours" varchar,
    "contact_whatsapp_message" varchar,
    "social_whatsapp_visible" boolean DEFAULT true,
    "social_whatsapp_label" varchar,
    "social_instagram_visible" boolean DEFAULT true,
    "social_instagram_is_mock" boolean DEFAULT true,
    "social_instagram_url" varchar,
    "social_instagram_label" varchar,
    "photos_portrait_id" integer,
    "photos_salad_id" integer,
    "photos_fruit_id" integer,
    "photos_preparation_id" integer,
    "photos_breakfast_id" integer,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE "homepage_services" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "slug" varchar NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar NOT NULL,
    "tag" varchar,
    "icon" "enum_homepage_services_icon" NOT NULL
  );

  CREATE TABLE "homepage_process" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar NOT NULL,
    "detail" varchar NOT NULL,
    "image" "enum_homepage_process_image" NOT NULL
  );

  CREATE TABLE "homepage_tags" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL
  );

  CREATE TABLE "homepage_trust" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL
  );

  CREATE TABLE "homepage_goals" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "key" varchar NOT NULL,
    "service" varchar NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar NOT NULL,
    "message" varchar NOT NULL,
    "image" "enum_homepage_goals_image" NOT NULL
  );

  CREATE TABLE "homepage_packages_scope" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "text" varchar NOT NULL
  );

  CREATE TABLE "homepage_packages" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "subtitle" varchar,
    "featured" boolean DEFAULT false
  );

  CREATE TABLE "homepage_testimonials" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "key" varchar NOT NULL,
    "initials" varchar NOT NULL,
    "label" varchar,
    "quote" varchar NOT NULL
  );

  CREATE TABLE "homepage_blog" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "category" varchar,
    "reading_time" varchar,
    "image" "enum_homepage_blog_image" NOT NULL
  );

  CREATE TABLE "homepage_faqs" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "question" varchar NOT NULL,
    "answer" varchar NOT NULL
  );

  CREATE TABLE "homepage" (
    "id" serial PRIMARY KEY NOT NULL,
    "initialized" boolean DEFAULT false,
    "is_mock" boolean DEFAULT true,
    "copy_hero_eyebrow" varchar NOT NULL,
    "copy_hero_first" varchar NOT NULL,
    "copy_hero_second" varchar NOT NULL,
    "copy_hero_accent" varchar NOT NULL,
    "copy_hero_description" varchar NOT NULL,
    "copy_hero_note" varchar NOT NULL,
    "copy_hero_primary_button" varchar NOT NULL,
    "copy_hero_intro_link" varchar NOT NULL,
    "copy_about_eyebrow" varchar NOT NULL,
    "copy_about_title" varchar NOT NULL,
    "copy_about_accent" varchar NOT NULL,
    "copy_about_portrait_first" varchar NOT NULL,
    "copy_about_portrait_accent" varchar NOT NULL,
    "copy_about_portrait_handwriting" varchar NOT NULL,
    "copy_services_eyebrow" varchar NOT NULL,
    "copy_services_title" varchar NOT NULL,
    "copy_services_accent" varchar NOT NULL,
    "copy_services_description" varchar NOT NULL,
    "copy_services_link_label" varchar NOT NULL,
    "copy_process_eyebrow" varchar NOT NULL,
    "copy_process_title" varchar NOT NULL,
    "copy_process_accent" varchar NOT NULL,
    "copy_process_description" varchar NOT NULL,
    "copy_goals_eyebrow" varchar NOT NULL,
    "copy_goals_title" varchar NOT NULL,
    "copy_goals_accent" varchar NOT NULL,
    "copy_goals_description" varchar NOT NULL,
    "copy_packages_eyebrow" varchar NOT NULL,
    "copy_packages_title" varchar NOT NULL,
    "copy_packages_accent" varchar NOT NULL,
    "copy_packages_description" varchar NOT NULL,
    "copy_testimonials_eyebrow" varchar NOT NULL,
    "copy_testimonials_title" varchar NOT NULL,
    "copy_testimonials_accent" varchar NOT NULL,
    "copy_blog_eyebrow" varchar NOT NULL,
    "copy_blog_title" varchar NOT NULL,
    "copy_blog_accent" varchar NOT NULL,
    "copy_blog_description" varchar NOT NULL,
    "copy_faq_eyebrow" varchar NOT NULL,
    "copy_faq_title" varchar NOT NULL,
    "copy_faq_accent" varchar NOT NULL,
    "copy_faq_description" varchar NOT NULL,
    "copy_contact_eyebrow" varchar NOT NULL,
    "copy_contact_title" varchar NOT NULL,
    "copy_contact_accent" varchar NOT NULL,
    "copy_contact_description" varchar NOT NULL,
    "copy_contact_social_eyebrow" varchar NOT NULL,
    "copy_contact_social_title" varchar NOT NULL,
    "copy_contact_social_accent" varchar NOT NULL,
    "copy_contact_social_description" varchar NOT NULL,
    "identity_name" varchar NOT NULL,
    "identity_title" varchar,
    "identity_title_status" varchar,
    "identity_slogan" varchar,
    "identity_bio" varchar NOT NULL,
    "identity_approach" varchar NOT NULL,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE "body_analysis_settings_services" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "key" varchar NOT NULL,
    "label" varchar NOT NULL,
    "is_default" boolean DEFAULT false
  );

  CREATE TABLE "body_analysis_settings" (
    "id" serial PRIMARY KEY NOT NULL,
    "initialized" boolean DEFAULT false,
    "enabled" boolean DEFAULT false,
    "title" varchar NOT NULL,
    "subtitle" varchar NOT NULL,
    "description" varchar NOT NULL,
    "calculate_label" varchar NOT NULL,
    "send_label" varchar NOT NULL,
    "fields_neck" boolean DEFAULT true,
    "fields_waist" boolean DEFAULT true,
    "fields_hip" boolean DEFAULT true,
    "message_template" varchar NOT NULL,
    "include_bmi" boolean DEFAULT true,
    "include_fat" boolean DEFAULT true,
    "whatsapp_override" varchar,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_navigation" ADD CONSTRAINT "site_settings_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_photos_portrait_id_media_id_fk" FOREIGN KEY ("photos_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_photos_salad_id_media_id_fk" FOREIGN KEY ("photos_salad_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_photos_fruit_id_media_id_fk" FOREIGN KEY ("photos_fruit_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_photos_preparation_id_media_id_fk" FOREIGN KEY ("photos_preparation_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_photos_breakfast_id_media_id_fk" FOREIGN KEY ("photos_breakfast_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_services" ADD CONSTRAINT "homepage_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_process" ADD CONSTRAINT "homepage_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_tags" ADD CONSTRAINT "homepage_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_trust" ADD CONSTRAINT "homepage_trust_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_goals" ADD CONSTRAINT "homepage_goals_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_packages_scope" ADD CONSTRAINT "homepage_packages_scope_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_packages" ADD CONSTRAINT "homepage_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_testimonials" ADD CONSTRAINT "homepage_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blog" ADD CONSTRAINT "homepage_blog_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_faqs" ADD CONSTRAINT "homepage_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "body_analysis_settings_services" ADD CONSTRAINT "body_analysis_settings_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."body_analysis_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
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
  CREATE INDEX "site_settings_navigation_order_idx" ON "site_settings_navigation" USING btree ("_order");
  CREATE INDEX "site_settings_navigation_parent_id_idx" ON "site_settings_navigation" USING btree ("_parent_id");
  CREATE INDEX "site_settings_photos_photos_portrait_idx" ON "site_settings" USING btree ("photos_portrait_id");
  CREATE INDEX "site_settings_photos_photos_salad_idx" ON "site_settings" USING btree ("photos_salad_id");
  CREATE INDEX "site_settings_photos_photos_fruit_idx" ON "site_settings" USING btree ("photos_fruit_id");
  CREATE INDEX "site_settings_photos_photos_preparation_idx" ON "site_settings" USING btree ("photos_preparation_id");
  CREATE INDEX "site_settings_photos_photos_breakfast_idx" ON "site_settings" USING btree ("photos_breakfast_id");
  CREATE INDEX "homepage_services_order_idx" ON "homepage_services" USING btree ("_order");
  CREATE INDEX "homepage_services_parent_id_idx" ON "homepage_services" USING btree ("_parent_id");
  CREATE INDEX "homepage_process_order_idx" ON "homepage_process" USING btree ("_order");
  CREATE INDEX "homepage_process_parent_id_idx" ON "homepage_process" USING btree ("_parent_id");
  CREATE INDEX "homepage_tags_order_idx" ON "homepage_tags" USING btree ("_order");
  CREATE INDEX "homepage_tags_parent_id_idx" ON "homepage_tags" USING btree ("_parent_id");
  CREATE INDEX "homepage_trust_order_idx" ON "homepage_trust" USING btree ("_order");
  CREATE INDEX "homepage_trust_parent_id_idx" ON "homepage_trust" USING btree ("_parent_id");
  CREATE INDEX "homepage_goals_order_idx" ON "homepage_goals" USING btree ("_order");
  CREATE INDEX "homepage_goals_parent_id_idx" ON "homepage_goals" USING btree ("_parent_id");
  CREATE INDEX "homepage_packages_scope_order_idx" ON "homepage_packages_scope" USING btree ("_order");
  CREATE INDEX "homepage_packages_scope_parent_id_idx" ON "homepage_packages_scope" USING btree ("_parent_id");
  CREATE INDEX "homepage_packages_order_idx" ON "homepage_packages" USING btree ("_order");
  CREATE INDEX "homepage_packages_parent_id_idx" ON "homepage_packages" USING btree ("_parent_id");
  CREATE INDEX "homepage_testimonials_order_idx" ON "homepage_testimonials" USING btree ("_order");
  CREATE INDEX "homepage_testimonials_parent_id_idx" ON "homepage_testimonials" USING btree ("_parent_id");
  CREATE INDEX "homepage_blog_order_idx" ON "homepage_blog" USING btree ("_order");
  CREATE INDEX "homepage_blog_parent_id_idx" ON "homepage_blog" USING btree ("_parent_id");
  CREATE INDEX "homepage_faqs_order_idx" ON "homepage_faqs" USING btree ("_order");
  CREATE INDEX "homepage_faqs_parent_id_idx" ON "homepage_faqs" USING btree ("_parent_id");
  CREATE INDEX "body_analysis_settings_services_order_idx" ON "body_analysis_settings_services" USING btree ("_order");
  CREATE INDEX "body_analysis_settings_services_parent_id_idx" ON "body_analysis_settings_services" USING btree ("_parent_id");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_navigation" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "homepage_services" CASCADE;
  DROP TABLE "homepage_process" CASCADE;
  DROP TABLE "homepage_tags" CASCADE;
  DROP TABLE "homepage_trust" CASCADE;
  DROP TABLE "homepage_goals" CASCADE;
  DROP TABLE "homepage_packages_scope" CASCADE;
  DROP TABLE "homepage_packages" CASCADE;
  DROP TABLE "homepage_testimonials" CASCADE;
  DROP TABLE "homepage_blog" CASCADE;
  DROP TABLE "homepage_faqs" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "body_analysis_settings_services" CASCADE;
  DROP TABLE "body_analysis_settings" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_site_settings_navigation_anchor";
  DROP TYPE "public"."enum_homepage_services_icon";
  DROP TYPE "public"."enum_homepage_process_image";
  DROP TYPE "public"."enum_homepage_goals_image";
  DROP TYPE "public"."enum_homepage_blog_image";`);
}
