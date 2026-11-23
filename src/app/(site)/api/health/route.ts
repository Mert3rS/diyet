import { getCms } from "@/lib/cms";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const payload = await getCms();
    await payload.count({ collection: "users", overrideAccess: true });
    return Response.json(
      { status: "ok" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "not_ready" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
