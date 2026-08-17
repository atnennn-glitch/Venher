import { getDb } from "../../../db";
import { leads } from "../../../db/schema";

export async function POST(request: Request) {
  try {
    const { email: raw } = await request.json() as { email?: string };
    const email = raw?.trim().toLowerCase() ?? "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "invalid email" }, { status: 400 });
    await getDb().insert(leads).values({ email }).onConflictDoNothing({ target: leads.email });
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "unable to save lead" }, { status: 500 });
  }
}
