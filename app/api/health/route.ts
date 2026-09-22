// Liveness probe for the platform health check. No DB call: a Mongo blip must
// not make the platform kill and restart otherwise healthy containers.
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ ok: true }, { status: 200 });
}
