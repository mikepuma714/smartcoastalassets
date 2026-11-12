import { z } from "zod";
import { authorized } from "@/lib/auth";
import { addSuppression } from "@/lib/leads";

const body = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().min(7).optional(),
    channel: z.enum(["all", "sms", "phone_call", "email", "ai_voice", "ai_messaging", "prerecorded_voice", "automated_dialer"]).default("all"),
    source: z.string().max(80).default("webhook"),
    note: z.string().max(500).optional(),
  })
  .refine((b) => b.email || b.phone, "email or phone is required");

/**
 * Opt-out webhook for texting, calling, email and AI follow-up providers (e.g. STOP replies).
 * Auth: `Authorization: Bearer $OPTOUT_WEBHOOK_SECRET`.
 */
export async function POST(request: Request) {
  if (!authorized(request, process.env.OPTOUT_WEBHOOK_SECRET)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  await addSuppression(parsed.data);
  return Response.json({ ok: true });
}
