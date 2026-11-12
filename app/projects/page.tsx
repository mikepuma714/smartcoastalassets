import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { getActiveProjects, getSoldOutProjects, toSummary } from "@/lib/projects";
import { breadcrumbLd } from "@/lib/structured-data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Luxury Coastal Residences in Pinellas County, FL",
  description:
    "All current Smart Coastal Assets residences from Clearwater Beach to St. Pete Beach: photos, pricing, rental rules, financing and location.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const active = getActiveProjects();
  const sold = getSoldOutProjects();

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Residences", path: "/projects" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Smart Coastal Assets residences",
          itemListElement: active.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${site.url}/projects/${p.slug}`,
            name: p.name,
          })),
        }}
      />
      <PageHeader eyebrow="Pinellas County, Florida" title="Residences">
        <p>
          {active.length} current coastal developments from Clearwater Beach to St. Pete Beach. Open any residence for
          photos, floor plans, rental rules and financing.
        </p>
      </PageHeader>

      <section className="container-luxe py-16 sm:py-24">
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={(i % 3) * 0.08}>
              <ProjectCard project={toSummary(p)} />
            </Reveal>
          ))}
        </ul>
      </section>

      {sold.length > 0 && (
        <section aria-labelledby="past" className="border-t border-sand-200 bg-sand-100 py-16 sm:py-24">
          <div className="container-luxe">
            <p className="eyebrow">Past projects</p>
            <h2 id="past" className="mt-3 text-4xl">
              Sold out
            </h2>
            <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {sold.map((p) => (
                <li key={p.slug}>
                  <ProjectCard project={toSummary(p)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
