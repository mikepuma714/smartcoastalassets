import type { Metadata } from "next";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { PageHeader } from "@/components/PageHeader";
import { getActiveProjects } from "@/lib/projects";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Request Information",
  description: `Request pricing, availability, floor plans and rental details for Smart Coastal Assets residences. Call or text ${site.agent.phone}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const projects = getActiveProjects().map(({ slug, name }) => ({ slug, name }));
  return (
    <>
      <PageHeader eyebrow="Contact" title="Request information.">
        <p>Tell us which residence interests you and how to reach you. Marketing consent is optional.</p>
      </PageHeader>
      <section className="container-luxe grid gap-12 py-16 sm:py-24 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <p className="font-display text-3xl text-navy-900">{site.agent.name}</p>
          <p className="text-xs tracking-[0.18em] text-muted uppercase">{site.brokerage}</p>
          <div className="mt-6 space-y-2">
            <p>
              <a href={`tel:${site.agent.phoneE164}`} className="text-navy-800 hover:text-gold-600">
                Call or text {site.agent.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${site.agent.email}`} className="text-navy-800 hover:text-gold-600">
                {site.agent.email}
              </a>
            </p>
          </div>
        </aside>
        <div className="rounded-sm bg-white p-6 ring-1 ring-sand-200 sm:p-10 lg:col-span-8">
          <InquiryForm projects={projects} heading="" />
        </div>
      </section>
    </>
  );
}
