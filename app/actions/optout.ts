"use server";

import { headers } from "next/headers";
import { addSuppression, toE164, type Channel } from "@/lib/leads";

export type OptOutState = { status: "idle" | "success" | "error"; message?: string };

const CHANNELS: Record<string, Channel | "all"> = {
  all: "all",
  sms: "sms",
  phone_call: "phone_call",
  email: "email",
  ai_voice: "ai_voice",
};

export async function submitOptOut(_prev: OptOutState, formData: FormData): Promise<OptOutState> {
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const channel = CHANNELS[String(formData.get("channel") ?? "all")] ?? "all";

  if (!email && !phone) return { status: "error", message: "Enter the email address and/or mobile number to opt out." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { status: "error", message: "Please enter a valid email address." };
  if (phone && !toE164(phone)) return { status: "error", message: "Please enter a valid mobile number." };

  const h = await headers();
  const ipAddress = h.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;

  try {
    if (email) await addSuppression({ email, channel, source: "web_unsubscribe", ipAddress });
    if (phone) await addSuppression({ phone, channel, source: "web_unsubscribe", ipAddress });
  } catch (err) {
    console.error("[optout] failed", err);
    return { status: "error", message: "Something went wrong. Please email or call us and we will opt you out." };
  }
  return { status: "success", message: "You have been opted out. It may take up to 24 hours to take effect across all systems." };
}
