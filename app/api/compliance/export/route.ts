import { authorized } from "@/lib/auth";
import { hasDatabase, sql } from "@/lib/db";

const QUERIES = {
  consent: `SELECT c.recorded_at, c.consent_given, c.consent_version, c.form_version, c.consent_text_sha256,
                   l.first_name, l.last_name, c.email, c.phone, c.phone_e164, c.project_name, c.project_slug,
                   c.page_url, c.ip_address, c.user_agent, c.senders, c.channels, c.consent_heading, c.consent_text,
                   c.lead_id, c.id AS consent_record_id
            FROM consent_records c JOIN leads l ON l.id = c.lead_id
            ORDER BY c.recorded_at DESC`,
  leads: `SELECT created_at, first_name, last_name, email, phone, phone_e164, project_name, project_slug, message,
                 page_url, referrer, utm, ip_address, notified_at, id
          FROM leads ORDER BY created_at DESC`,
  suppressions: `SELECT created_at, email, phone_e164, channel, source, note, ip_address, id
                 FROM suppressions ORDER BY created_at DESC`,
} as const;

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = typeof value === "object" && !(value instanceof Date) ? JSON.stringify(value) : String(value instanceof Date ? value.toISOString() : value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * Compliance export of consent records, leads and opt-outs as CSV.
 * Open in a browser: /api/compliance/export?type=consent (username: anything, password: COMPLIANCE_EXPORT_TOKEN)
 */
export async function GET(request: Request) {
  if (!authorized(request, process.env.COMPLIANCE_EXPORT_TOKEN)) {
    return new Response("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Compliance export", charset="UTF-8"' },
    });
  }
  if (!hasDatabase()) return new Response("Database not configured", { status: 503 });

  const type = (new URL(request.url).searchParams.get("type") ?? "consent") as keyof typeof QUERIES;
  if (!(type in QUERIES)) return new Response("type must be consent, leads or suppressions", { status: 400 });

  const rows = (await sql().query(QUERIES[type])) as Record<string, unknown>[];
  const columns = rows[0] ? Object.keys(rows[0]) : [];
  const csv = [columns.join(","), ...rows.map((r) => columns.map((c) => csvCell(r[c])).join(","))].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new Response("\uFEFF" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="smartcoastalassets-${type}-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
