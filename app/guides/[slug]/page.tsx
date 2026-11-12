import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { getGuide, getGuides } from "@/lib/guides";
import { breadcrumbLd, faqLd } from "@/lib/structured-data";
import { site } from "@/lib/site";

export const instant = false;

export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: { type: "article", title: g.title, description: g.description, url: `/guides/${g.slug}` },
  };
}

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.title,
          description: g.description,
          abstract: g.answer,
          dateModified: g.updated,
          datePublished: g.updated,
          url: `${site.url}/guides/${g.slug}`,
          author: { "@id": `${site.url}/#organization` },
          publisher: { "@id": `${site.url}/#organization` },
          citation: g.sources.map((s) => ({ "@type": "CreativeWork", name: s.label, url: s.url })),
        }}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Buyer Guides", path: "/guides" },
          { name: g.title, path: `/guides/${g.slug}` },
        ])}
      />
      {g.faqs.length > 0 && <JsonLd data={faqLd(g.faqs)} />}

      <article className="pt-32 pb-24 sm:pt-40">
        <div className="container-luxe max-w-4xl">
          <nav aria-label="Breadcrumb" className="text-xs tracking-[0.12em] text-muted uppercase">
            <Link href="/guides" className="hover:text-gold-600">Buyer Guides</Link>
          </nav>
          <h1 className="mt-4 text-4xl leading-[1.05] sm:text-6xl">{g.title}</h1>
          <p className="mt-4 text-sm text-muted">
            Last reviewed <time dateTime={g.updated}>{formatDate(g.updated)}</time> · {site.name}
          </p>

          <section aria-label="Short answer" className="mt-10 rounded-sm border-l-2 border-gold-500 bg-white p-6 shadow-sm sm:p-8">
            <p className="eyebrow">The short answer</p>
            <p className="mt-3 text-lg leading-relaxed text-navy-900">{g.answer}</p>
          </section>

          <div className="mt-14 space-y-14">
            {g.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-3xl">{s.heading}</h2>
                {s.paragraphs?.map((para) => (
                  <p key={para.slice(0, 40)} className="mt-4 leading-relaxed text-ink/85">
                    {para}
                  </p>
                ))}
                {s.bullets && (
                  <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-ink/85 marker:text-gold-500">
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
                {s.table && s.table.rows.length > 0 && (
                  <div className="mt-6 overflow-x-auto rounded-sm ring-1 ring-sand-200">
                    <table className="w-full min-w-[640px] border-collapse bg-white text-left text-sm">
                      <thead className="bg-navy-900 text-white">
                        <tr>
                          {s.table.head.map((h) => (
                            <th key={h} scope="col" className="px-4 py-3 text-[0.65rem] font-semibold tracking-[0.16em] uppercase">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {s.table.rows.map((row) => (
                          <tr key={row.join("|")} className="border-t border-sand-200 align-top">
                            {row.map((cell, i) =>
                              i === 0 ? (
                                <th key={i} scope="row" className="px-4 py-3 font-medium text-navy-900">
                                  {cell}
                                </th>
                              ) : (
                                <td key={i} className="px-4 py-3 text-ink/80">
                                  {cell}
                                </td>
                              ),
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}

            {g.faqs.length > 0 && (
              <section>
                <h2 className="text-3xl">Frequently asked questions</h2>
                <div className="mt-6">
                  <Faq items={g.faqs} />
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl">Sources</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {g.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-navy-700 underline underline-offset-2 hover:text-gold-600">
                      {s.label} <ExternalLink className="size-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
              {g.disclaimer && <p className="mt-6 text-xs leading-relaxed text-muted">{g.disclaimer}</p>}
            </section>

            <section className="rounded-sm bg-navy-900 p-8 text-white sm:p-10">
              <p className="font-display text-3xl">Have a question about a specific residence?</p>
              <Link href="/contact" className="btn-gold mt-6">
                Request Information <ArrowRight className="size-4" />
              </Link>
            </section>
          </div>
        </div>
      </article>
    </>
  );
}
