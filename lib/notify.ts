import "server-only";
import { Resend } from "resend";
import { site } from "./site";
import type { InquiryInput } from "./leads";

function escape(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export async function notifyTeam(leadId: string, input: InquiryInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = (process.env.INQUIRY_NOTIFY_TO ?? site.agent.email)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from = process.env.INQUIRY_FROM_EMAIL ?? "Smart Coastal Assets <inquiries@smartcoastalassets.com>";

  if (!apiKey) {
    console.warn(`[inquiry] RESEND_API_KEY not set; team notification skipped for lead ${leadId}.`);
    return false;
  }

  const name = `${input.firstName} ${input.lastName}`;
  const consentLine = input.consentGiven
    ? "YES: marketing consent given (calls, texts, emails, automated & AI-assisted)"
    : "NO: marketing consent NOT given. Respond to this inquiry only; no automated/AI marketing.";

  const rows: [string, string][] = [
    ["Project", input.projectName],
    ["Name", name],
    ["Email", input.email],
    ["Mobile", input.phone],
    ["Marketing consent", consentLine],
    ["Message", input.message || "—"],
    ["Page", input.pageUrl || "—"],
    ["Source", Object.entries(input.utm).map(([k, v]) => `${k}=${v}`).join(", ") || "—"],
    ["Lead ID", leadId],
  ];

  const html = `
    <div style="font-family:Arial,sans-serif;color:#1b2532;max-width:560px">
      <h2 style="font-family:Georgia,serif;font-weight:normal;color:#0c1f35">New inquiry: ${escape(input.projectName)}</h2>
      <table cellpadding="8" style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="border-bottom:1px solid #ece3d3;color:#5d6877;width:150px;vertical-align:top">${k}</td><td style="border-bottom:1px solid #ece3d3">${escape(v)}</td></tr>`,
          )
          .join("")}
      </table>
    </div>`;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: `New inquiry: ${input.projectName} (${name})${input.consentGiven ? "" : " [no marketing consent]"}`,
    html,
    text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
  });
  if (error) {
    console.error("[inquiry] Resend error", error);
    return false;
  }
  return true;
}
