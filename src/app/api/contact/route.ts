import { after } from "next/server";
import { db, ensureSchema } from "@/lib/server/db";
import { ADMIN_EMAILS } from "@/lib/server/auth";
import { messageMail, sendMailEach } from "@/lib/server/email";
import { markMessageEmailed, saveMessage } from "@/lib/server/messages";
import { rateLimit, requestMeta, sha256 } from "@/lib/server/security";

/**
 * Contact form endpoint. The message is stored first and emailed second, so a
 * failed send never loses it — the dashboard shows anything not yet emailed.
 */
export async function POST(request: Request) {
  if (!db()) return Response.json({ ok: false, error: "not_configured" }, { status: 503 });

  const meta = requestMeta(request.headers);
  const ipHash = sha256(meta.ip ?? "unknown");
  if (!(await rateLimit(`contact:${ipHash}`, 5, 3600))) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const name = str(body.name, 120);
  const email = str(body.email, 254);
  const message = str(body.message, 5000);
  const subject = str(body.subject, 160) || null;
  // A hidden field real people never fill in.
  if (str(body.company, 50)) return Response.json({ ok: true });
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  await ensureSchema();
  const id = await saveMessage({
    name,
    email,
    subject,
    message,
    sessionId: str(body.sessionId, 64) || null,
    entryPath: str(body.entryPath, 300) || null,
    ipHash,
    country: meta.country,
    city: meta.city,
  });

  after(async () => {
    const sent = await sendMailEach([...ADMIN_EMAILS], messageMail({ name, email, subject, message }));
    if (sent) await markMessageEmailed(id);
  });

  return Response.json({ ok: true });
}
