import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { getGuides } from "@/lib/guides";
import { breadcrumbLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Buyer Guides: Pinellas County Coastal Real Estate",
  description:
    "Plain-English guides to buying coastal property in Pinellas County, Florida: short-term rental rules, DSCR loans, tax strategy, pre-construction condos and ownership costs.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  const guides = getGuides();
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Buyer Guides", path: "/guides" }])} />
      <PageHeader eyebrow="Buyer guides" title="Know before you buy on the coast.">
        <p>Each guide leads with the answer, then shows the details and the official sources behind it.</p>
      </PageHeader>
      <section className="container-luxe py-16 sm:py-24">
        <ul className="divide-y divide-sand-200 border-y border-sand-200">
          {guides.map((g, i) => (
            <Reveal as="li" key={g.slug} delay={i * 0.04}>
              <Link href={`/guides/${g.slug}`} className="group grid gap-4 py-10 md:grid-cols-12 md:items-start">
                <span className="font-display text-4xl text-gold-500 md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <div className="md:col-span-10">
                  <h2 className="text-3xl leading-snug transition-colors group-hover:text-gold-600">{g.title}</h2>
                  <p className="mt-3 max-w-3xl leading-relaxed text-muted">{g.description}</p>
                </div>
                <ArrowRight className="hidden size-6 text-navy-800 transition-transform group-hover:translate-x-1 md:col-span-1 md:block md:justify-self-end" />
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
