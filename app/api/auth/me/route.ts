import { isAdmin } from "@/lib/auth";
import { json } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  return json({ admin: isAdmin() });
}
