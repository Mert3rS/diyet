import {
  sql,
  type MigrateUpArgs,
  type MigrateDownArgs,
} from "@payloadcms/db-postgres";

// Supabase exposes public-schema tables through its Data API. Payload connects
// as their owner, while RLS with no policies denies direct API access to them.
const tables = [
  "users_sessions",
  "users",
  "media",
  "payload_kv",
  "payload_locked_documents",
  "payload_locked_documents_rels",
  "payload_preferences",
  "payload_preferences_rels",
  "payload_migrations",
  "site_settings_navigation",
  "site_settings",
  "homepage_services",
  "homepage_process",
  "homepage_tags",
  "homepage_trust",
  "homepage_goals",
  "homepage_packages_scope",
  "homepage_packages",
  "homepage_testimonials",
  "homepage_blog",
  "homepage_faqs",
  "homepage",
  "body_analysis_settings_services",
  "body_analysis_settings",
];

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of tables)
    await db.execute(
      sql.raw(`ALTER TABLE "public"."${table}" ENABLE ROW LEVEL SECURITY`),
    );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const table of tables)
    await db.execute(
      sql.raw(`ALTER TABLE "public"."${table}" DISABLE ROW LEVEL SECURITY`),
    );
}
