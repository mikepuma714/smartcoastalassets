import type { Metadata } from "next";
import { OptOutForm } from "@/components/forms/OptOutForm";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Opt Out of Marketing Communications",
  description: "Revoke consent to marketing calls, texts, emails and AI-assisted follow-up from Smart Coastal Assets.",
  alternates: { canonical: "/unsubscribe" },
  robots: { index: false },
};

export default function UnsubscribePage() {
  return (
    <>
      <PageHeader eyebrow="Communication preferences" title="Opt out.">
        <p>
          Enter your email address and/or mobile number to stop marketing communications. You can also reply STOP to
          any text, or contact {site.agent.email}.
        </p>
      </PageHeader>
      <section className="container-luxe max-w-xl py-16 sm:py-24">
        <OptOutForm />
      </section>
    </>
  );
}
