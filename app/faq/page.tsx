import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { getMasterFaq } from "@/lib/faq";
import { breadcrumbLd, faqLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "FAQ: Buying Coastal Property in Pinellas County",
  description:
    "Answers about Smart Coastal Assets residences: locations, pricing, short-term rental rules, self-management, rental income, DSCR financing, deposits and taxes.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const groups = getMasterFaq();
  return (
    <>
      <JsonLd data={faqLd(groups.flatMap((g) => g.items))} />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }])} />
      <PageHeader eyebrow="FAQ" title="Questions every coastal buyer asks.">
        <p>Answers come straight from current project data and are updated whenever a project changes.</p>
      </PageHeader>
      <div className="container-luxe max-w-4xl space-y-16 py-16 sm:py-24">
        {groups.map((g) => (
          <section key={g.title} aria-label={g.title}>
            <h2 className="text-3xl">{g.title}</h2>
            <div className="mt-6">
              <Faq items={g.items} />
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
