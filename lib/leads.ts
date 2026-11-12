import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import {
  CONSENT_CHANNELS,
  CONSENT_HEADING,
  CONSENT_SENDERS,
  CONSENT_TEXT,
  CONSENT_VERSION,
  FORM_VERSION,
} from "./consent";
import { hasDatabase, sql } from "./db";

export const CONSENT_TEXT_SHA256 = createHash("sha256").update(`${CONSENT_HEADING}\n${CONSENT_TEXT}`).digest("hex");

export type InquiryInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  projectSlug: string | null;
  projectName: string;
  message?: string;
  consentGiven: boolean;
  pageUrl?: string;
  referrer?: string;
  utm: Record<string, string>;
  ipAddress?: string;
  userAgent?: string;
};

export function toE164(phone: string): string | null {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+") && digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

/** Stores the lead and its consent record together. Returns the lead id. */
export async function storeInquiry(input: InquiryInput): Promise<string> {
  const phoneE164 = toE164(input.phone);
  const consent = {
    consent_given: input.consentGiven,
    consent_version: CONSENT_VERSION,
    consent_heading: CONSENT_HEADING,
    consent_text: CONSENT_TEXT,
    consent_text_sha256: CONSENT_TEXT_SHA256,
    senders: CONSENT_SENDERS,
    channels: CONSENT_CHANNELS,
    form_version: FORM_VERSION,
  };

  if (!hasDatabase()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("DATABASE_URL is required in production to record inquiries and consent.");
    }
    const id = randomUUID();
    const dir = path.join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(
      path.join(dir, "inquiries.jsonl"),
      JSON.stringify({ id, recorded_at: new Date().toISOString(), ...input, phone_e164: phoneE164, consent }) + "\n",
    );
    console.warn("[inquiry] DATABASE_URL not set; stored locally in .data/inquiries.jsonl (development only).");
    return id;
  }

  const db = sql();
  const [lead] = (await db.query(
    `INSERT INTO leads (first_name, last_name, email, phone, phone_e164, project_slug, project_name, message,
                        page_url, referrer, utm, ip_address, user_agent)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING id`,
    [
      input.firstName,
      input.lastName,
      input.email,
      input.phone,
      phoneE164,
      input.projectSlug,
      input.projectName,
      input.message ?? null,
      input.pageUrl ?? null,
      input.referrer ?? null,
      JSON.stringify(input.utm),
      input.ipAddress ?? null,
      input.userAgent ?? null,
    ],
  )) as { id: string }[];

  await db.query(
    `INSERT INTO consent_records (lead_id, consent_given, consent_version, consent_heading, consent_text,
                                  consent_text_sha256, senders, channels, form_version, email, phone, phone_e164,
                                  project_slug, project_name, page_url, ip_address, user_agent)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
    [
      lead.id,
      consent.consent_given,
      consent.consent_version,
      consent.consent_heading,
      consent.consent_text,
      consent.consent_text_sha256,
      JSON.stringify(consent.senders),
      JSON.stringify(consent.channels),
      consent.form_version,
      input.email,
      input.phone,
      phoneE164,
      input.projectSlug,
      input.projectName,
      input.pageUrl ?? null,
      input.ipAddress ?? null,
      input.userAgent ?? null,
    ],
  );

  return lead.id;
}

export async function markNotified(leadId: string) {
  if (!hasDatabase()) return;
  await sql().query(`UPDATE leads SET notified_at = now() WHERE id = $1`, [leadId]);
}

/** Simple abuse guard: max submissions per IP per 10 minutes. */
export async function recentSubmissionsFromIp(ip: string | undefined): Promise<number> {
  if (!ip || !hasDatabase()) return 0;
  const rows = (await sql().query(
    `SELECT count(*)::int AS n FROM leads WHERE ip_address = $1 AND created_at > now() - interval '10 minutes'`,
    [ip],
  )) as { n: number }[];
  return rows[0]?.n ?? 0;
}

export type Channel = "phone_call" | "sms" | "email" | "ai_voice" | "ai_messaging" | "prerecorded_voice" | "automated_dialer";

export async function addSuppression(args: {
  email?: string | null;
  phone?: string | null;
  channel?: Channel | "all";
  source: string;
  note?: string;
  ipAddress?: string;
}) {
  const phoneE164 = args.phone ? toE164(args.phone) : null;
  const email = args.email?.trim().toLowerCase() || null;
  if (!email && !phoneE164) throw new Error("An email address or phone number is required.");
  if (!hasDatabase()) {
    if (process.env.NODE_ENV === "production") throw new Error("DATABASE_URL is required in production.");
    const dir = path.join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(
      path.join(dir, "suppressions.jsonl"),
      JSON.stringify({ created_at: new Date().toISOString(), email, phone_e164: phoneE164, ...args }) + "\n",
    );
    return;
  }
  await sql().query(
    `INSERT INTO suppressions (email, phone_e164, channel, source, note, ip_address) VALUES ($1,$2,$3,$4,$5,$6)`,
    [email, phoneE164, args.channel ?? "all", args.source, args.note ?? null, args.ipAddress ?? null],
  );
}

/**
 * Gate for ANY automated or AI marketing outreach (calls, texts, AI voice, AI messaging, email).
 * Returns true only if the person gave express written consent and has not opted out since.
 */
export async function canContact(args: { email?: string; phone?: string; channel: Channel }): Promise<boolean> {
  if (!hasDatabase()) return false;
  const email = args.email?.trim().toLowerCase() ?? null;
  const phoneE164 = args.phone ? toE164(args.phone) : null;
  if (!email && !phoneE164) return false;

  const consentRows = (await sql().query(
    `SELECT max(recorded_at) AS granted_at FROM consent_records
     WHERE consent_given = true
       AND ((($1::text) IS NOT NULL AND lower(email) = $1) OR (($2::text) IS NOT NULL AND phone_e164 = $2))`,
    [email, phoneE164],
  )) as { granted_at: string | null }[];
  const grantedAt = consentRows[0]?.granted_at;
  if (!grantedAt) return false;

  const suppressionRows = (await sql().query(
    `SELECT max(created_at) AS suppressed_at FROM suppressions
     WHERE (channel = 'all' OR channel = $3)
       AND ((($1::text) IS NOT NULL AND lower(email) = $1) OR (($2::text) IS NOT NULL AND phone_e164 = $2))`,
    [email, phoneE164, args.channel],
  )) as { suppressed_at: string | null }[];
  const suppressedAt = suppressionRows[0]?.suppressed_at;

  return !suppressedAt || new Date(suppressedAt) < new Date(grantedAt);
}
