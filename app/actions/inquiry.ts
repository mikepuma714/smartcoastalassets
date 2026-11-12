"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { getActiveProjects, getPublicProjects } from "@/lib/projects";
import { markNotified, recentSubmissionsFromIp, storeInquiry, toE164 } from "@/lib/leads";
import { notifyTeam } from "@/lib/notify";

export type InquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"firstName" | "lastName" | "email" | "phone" | "project", string>>;
  values?: Record<string, string>;
};

function echo(formData: FormData) {
  const values: Record<string, string> = {};
  for (const key of ["firstName", "lastName", "email", "phone", "project", "message"]) {
    values[key] = String(formData.get(key) ?? "");
  }
  return values;
}

const schema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name.").max(80),
  lastName: z.string().trim().min(1, "Please enter your last name.").max(80),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address.").max(200),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter your mobile number.")
    .max(30)
    .refine((v) => toE164(v) !== null, "Please enter a valid mobile number."),
  project: z.string().trim().min(1, "Please choose a project of interest."),
  message: z.string().trim().max(2000).optional(),
});

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "qr"];

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  // Bot traps: hidden field must stay empty, and humans take more than ~2s to fill the form.
  if (String(formData.get("company") ?? "") !== "") return { status: "success" };
  const startedAt = Number(formData.get("startedAt") ?? 0);
  if (startedAt && Date.now() - startedAt < 2000) return { status: "success" };

  const parsed = schema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    project: formData.get("project"),
    message: formData.get("message") || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: InquiryState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<InquiryState["fieldErrors"]>;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors, values: echo(formData) };
  }

  const h = await headers();
  const ipAddress = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || undefined;
  const userAgent = h.get("user-agent") ?? undefined;

  if ((await recentSubmissionsFromIp(ipAddress)) >= 5) {
    return { status: "error", message: "Too many submissions. Please call or text us instead.", values: echo(formData) };
  }

  const known = [...getActiveProjects(), ...getPublicProjects()].find((p) => p.slug === parsed.data.project);
  const projectSlug = known?.slug ?? null;
  const projectName = known?.name ?? "General inquiry (all projects)";

  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = formData.get(key);
    if (typeof value === "string" && value) utm[key] = value.slice(0, 200);
  }

  const input = {
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    projectSlug,
    projectName,
    message: parsed.data.message,
    consentGiven: formData.get("marketingConsent") === "yes",
    pageUrl: String(formData.get("pageUrl") ?? "").slice(0, 1000) || h.get("referer") || undefined,
    referrer: String(formData.get("referrer") ?? "").slice(0, 1000) || undefined,
    utm,
    ipAddress,
    userAgent,
  };

  let leadId: string;
  try {
    leadId = await storeInquiry(input);
  } catch (err) {
    console.error("[inquiry] failed to store", err);
    return {
      status: "error",
      message: "We couldn't submit your inquiry. Please try again, or call or text 813-245-0015.",
      values: echo(formData),
    };
  }

  try {
    if (await notifyTeam(leadId, input)) await markNotified(leadId);
  } catch (err) {
    console.error("[inquiry] notification failed", err);
  }

  return {
    status: "success",
    message: `Thank you, ${input.firstName}. Your inquiry about ${projectName} has been received. Our team will be in touch shortly.`,
  };
}
