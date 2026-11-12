import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Building2, CalendarDays, ExternalLink, FileText, House, Landmark, MapPin, Percent, Users, Wallet } from "lucide-react";
import { ProjectGallery } from "@/components/gallery/ProjectGallery";
import { FloorPlanStrip } from "@/components/gallery/FloorPlanStrip";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { MobileContactBar } from "@/components/projects/MobileContactBar";
import { Section } from "@/components/projects/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/Icon";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { imageMeta } from "@/lib/images";
import { fullAddress, getActiveProjects, getProject, getPublicProjects, heroImageOf } from "@/lib/projects";
import { breadcrumbLd, faqLd, projectLd } from "@/lib/structured-data";
import { site } from "@/lib/site";

export const instant = false;

export function generateStaticParams() {
  return getPublicProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const hero = heroImageOf(p);
  const meta = hero ? imageMeta(hero.src) : undefined;
  const title = `${p.name} | ${p.address.city}, FL${p.price ? ` | ${p.price.display}` : ""}`;
  const description =
    p.summary?.slice(0, 300) ?? `${p.name} at ${fullAddress(p)}. Pricing, photos, rental rules and financing.`;
  return {
    title,
    description,
    alternates: { canonical: `/projects/${p.slug}`, types: { "text/markdown": `/projects/${p.slug}.md` } },
    openGraph: {
      title,
      description,
      url: `/projects/${p.slug}`,
      images: hero ? [{ url: hero.src, alt: hero.alt, width: meta?.width, height: meta?.height }] : undefined,
    },
  };
}

function formatDate(iso?: string) {
  if (!iso) return undefined;
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const withBlur = <T extends { src: string }>(img: T) => ({ ...img, blurDataURL: imageMeta(img.src)?.blurDataURL });
  const photos = p.gallery.map(withBlur);
  const plans = p.floorplans.map(withBlur);
  const contact = { name: p.contact?.name ?? site.agent.name, phone: p.contact?.phone ?? site.agent.phone, email: p.contact?.email ?? site.agent.email };
  const phoneE164 = `+1${contact.phone.replace(/\D/g, "").slice(-10)}`;
  const formProjects = getActiveProjects().map(({ slug, name }) => ({ slug, name }));
  if (!formProjects.some((fp) => fp.slug === p.slug)) formProjects.unshift({ slug: p.slug, name: p.name });

  const stats = [
    { label: "Bedrooms", value: p.stats.bedrooms },
    { label: "Bathrooms", value: p.stats.bathrooms },
    { label: "Sq. Ft.", value: p.stats.sqft },
    { label: "Residences", value: p.stats.residences },
    { label: "Completion", value: p.stats.completion },
  ].filter((s): s is { label: string; value: string } => Boolean(s.value));

  const keyDetails = [
    { icon: Wallet, label: "Price", value: p.price?.display },
    { icon: Landmark, label: "Initial Deposit", value: p.details.deposit },
    { icon: Percent, label: "Total Down Payment", value: p.details.downPayment },
    { icon: FileText, label: "Financing Options", value: p.details.financing },
    { icon: CalendarDays, label: "Estimated Completion", value: p.stats.completion },
  ].filter((d) => d.value);

  const ownership = [
    { icon: Building2, label: "Property Type", value: p.propertyType, sub: p.stats.residenceTypes },
    { icon: House, label: "Rentals & Personal Use", value: p.details.rentalMinimum ? `${p.details.rentalMinimum} minimum` : undefined, sub: p.details.personalUse },
    { icon: Users, label: "Management", value: p.details.management },
  ].filter((d) => d.value);

  const soldOut = p.status === "soldout";

  return (
    <>
      <JsonLd data={projectLd(p)} />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Residences", path: "/projects" }, { name: p.name, path: `/projects/${p.slug}` }])} />
      {p.faqs.length > 0 && <JsonLd data={faqLd(p.faqs)} />}

      <div className="pt-[68px] sm:pt-[76px]">
        <ProjectGallery photos={photos} floorplans={plans} />
      </div>

      <article className="container-luxe pb-24">
        <nav aria-label="Breadcrumb" className="mt-8 text-xs tracking-[0.12em] text-muted uppercase">
          <Link href="/" className="hover:text-gold-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/projects" className="hover:text-gold-600">Residences</Link>
          <span className="mx-2">/</span>
          <span className="text-navy-800">{p.name}</span>
        </nav>

        <header className="mt-6 flex flex-col gap-6 border-b border-sand-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            {soldOut && (
              <span className="mb-3 inline-block rounded-sm bg-navy-900 px-3 py-1 text-[0.62rem] font-semibold tracking-[0.2em] text-white uppercase">
                Sold Out
              </span>
            )}
            <h1 className="text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">{p.name}</h1>
            <div className="mt-4 flex items-center gap-2 text-sm tracking-[0.14em] text-muted uppercase">
              <MapPin className="size-4 shrink-0 text-gold-500" strokeWidth={1.5} />
              <address className="not-italic">{fullAddress(p)}</address>
            </div>
          </div>
          {p.price && (
            <div className="lg:text-right">
              <p className="font-display text-4xl text-navy-900 sm:text-5xl">{p.price.display}</p>
              {p.price.label && <p className="mt-2 text-xs tracking-[0.22em] text-muted uppercase">{p.price.label}</p>}
            </div>
          )}
        </header>

        {stats.length > 0 && (
          <dl className="grid grid-cols-2 border-b border-sand-200 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((s) => (
              <div key={s.label} className="border-sand-200 py-5 pr-4 odd:border-r sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0">
                <dt className="text-[0.62rem] tracking-[0.24em] text-muted uppercase">{s.label}</dt>
                <dd className="mt-1 font-display text-2xl text-navy-900">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {p.highlights.length > 0 && (
          <section aria-label="Investment and ownership highlights" className="border-b border-sand-200 py-12">
            <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
              {p.highlights.map((h, i) => (
                <Reveal as="li" key={h.title} delay={i * 0.06} className="flex gap-4 text-left lg:flex-col lg:items-center lg:text-center">
                  <span className="grid size-16 shrink-0 place-items-center rounded-full border border-gold-400/70 text-gold-500">
                    <Icon name={h.icon} className="size-7" />
                  </span>
                  <div>
                    <h3 className="font-sans text-[0.8rem] font-semibold tracking-[0.14em] text-navy-900 uppercase">{h.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{h.text}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </section>
        )}

        {p.summary && (
          <section aria-label="Overview" className="grid gap-8 border-b border-sand-200 py-12 lg:grid-cols-12 lg:items-center">
            <Reveal className="lg:col-span-8">
              <p className="font-display text-[1.45rem] leading-[1.5] text-navy-900 sm:text-[1.7rem]">{p.summary}</p>
            </Reveal>
            <div className="flex flex-col items-start gap-4 lg:col-span-4 lg:items-center">
              <a href="#inquire" className="btn-gold w-full sm:w-auto lg:w-full">
                Inquire Now <ArrowRight className="size-4" />
              </a>
              <a href="#inquire" className="text-xs font-semibold tracking-[0.18em] text-gold-600 uppercase underline underline-offset-4">
                Schedule a private tour
              </a>
            </div>
          </section>
        )}

        <div className="space-y-20 pt-16">
          {p.amenities.length > 0 && (
            <Section id="amenities" title="Amenities & Lifestyle">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
                {p.amenities.map((a, i) => (
                  <Reveal as="li" key={a.label} delay={i * 0.05} className="flex flex-col items-center text-center">
                    <Icon name={a.icon} className="size-9 text-navy-800" />
                    <p className="mt-3 text-[0.72rem] leading-snug font-medium tracking-[0.1em] text-navy-900 uppercase">{a.label}</p>
                  </Reveal>
                ))}
              </ul>
            </Section>
          )}

          {(keyDetails.length > 0 || ownership.length > 0) && (
            <Section id="details" title="Key Details">
              {keyDetails.length > 0 && (
                <dl className="grid gap-6 rounded-sm bg-mist-50 p-6 ring-1 ring-mist-100 sm:grid-cols-2 sm:p-8 lg:grid-cols-5">
                  {keyDetails.map((d) => (
                    <div key={d.label} className="flex gap-3">
                      <d.icon aria-hidden className="mt-0.5 size-6 shrink-0 text-navy-700" strokeWidth={1.25} />
                      <div>
                        <dt className="text-[0.62rem] font-semibold tracking-[0.2em] text-navy-800 uppercase">{d.label}</dt>
                        <dd className="mt-1.5 text-[0.95rem] leading-snug text-ink">{d.value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              )}
              {ownership.length > 0 && (
                <dl className="mt-5 grid gap-5 md:grid-cols-3">
                  {ownership.map((d) => (
                    <div key={d.label} className="flex gap-4 rounded-sm bg-white p-6 ring-1 ring-sand-200">
                      <d.icon aria-hidden className="mt-0.5 size-7 shrink-0 text-navy-700" strokeWidth={1.25} />
                      <div>
                        <dt className="text-[0.62rem] font-semibold tracking-[0.2em] text-navy-800 uppercase">{d.label}</dt>
                        <dd className="mt-1.5 text-[0.95rem] leading-snug text-ink">{d.value}</dd>
                        {d.sub && <dd className="mt-1 text-sm leading-snug text-muted">{d.sub}</dd>}
                      </div>
                    </div>
                  ))}
                </dl>
              )}
              <p className="mt-4 text-xs text-muted">All terms are subject to the purchase contract and lender approval.</p>
            </Section>
          )}

          {(p.income || p.tax) && (
            <Section id="income" title="Income & Tax Considerations">
              <div className="grid gap-5 md:grid-cols-2">
                {p.income && (
                  <div className="rounded-sm bg-navy-900 p-8 text-white">
                    <p className="eyebrow !text-gold-300">{p.income.label ?? "Rental income"}</p>
                    {p.income.figure && <p className="mt-4 font-display text-5xl">{p.income.figure}</p>}
                    {p.income.source && <p className="mt-3 text-sm text-white/70">Source: {p.income.source}</p>}
                    {p.income.note && <p className="mt-4 text-sm leading-relaxed text-white/80">{p.income.note}</p>}
                  </div>
                )}
                {p.tax && (
                  <div className="rounded-sm bg-white p-8 ring-1 ring-sand-200">
                    <p className="eyebrow">Potential tax advantages</p>
                    <p className="mt-4 text-lg leading-relaxed text-navy-900">{p.tax.note}</p>
                    <p className="mt-4 text-sm text-muted">
                      Tax benefits depend on your circumstances. Consult your CPA.{" "}
                      <Link href="/guides/short-term-rental-tax-strategy" className="text-gold-600 underline underline-offset-2">
                        Learn how this works
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </Section>
          )}

          {p.process.length > 0 && (
            <Section id="process" title="The Path to Ownership">
              <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                {p.process.map((step, i) => (
                  <Reveal as="li" key={step.title} delay={i * 0.06} className="border-t border-gold-400/60 pt-5">
                    <p className="font-display text-4xl text-gold-500">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-2 font-sans text-sm font-semibold tracking-[0.14em] text-navy-900 uppercase">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
                  </Reveal>
                ))}
              </ol>
            </Section>
          )}

          {plans.length > 0 && (
            <Section id="floor-plans" title="Floor Plans">
              <FloorPlanStrip plans={plans} />
            </Section>
          )}

          {p.faqs.length > 0 && (
            <Section id="faq" title={`${p.name} FAQ`}>
              <Faq items={p.faqs} />
            </Section>
          )}

          <section id="inquire" aria-labelledby="inquire-title" className="scroll-mt-24">
            <div className="grid overflow-hidden rounded-sm bg-white ring-1 ring-sand-200 lg:grid-cols-12">
              <div className="bg-navy-900 p-8 text-white sm:p-10 lg:col-span-5">
                <p className="eyebrow !text-gold-300">{soldOut ? "Sold out" : "Private inquiries"}</p>
                <h2 id="inquire-title" className="mt-3 text-4xl !text-white">
                  {soldOut ? "Ask about similar residences" : `Request information on ${p.name}`}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-white/75">
                  Pricing, availability, floor plans, rental details and financing. Submitting an inquiry does not
                  require marketing consent.
                </p>
                <div className="hairline my-8 opacity-50" />
                <p className="font-display text-2xl">{contact.name}</p>
                <p className="text-xs tracking-[0.18em] text-white/60 uppercase">{site.brokerage}</p>
                <div className="mt-5 space-y-2 text-sm">
                  <p>
                    <a className="hover:text-gold-300" href={`tel:${phoneE164}`}>Call or text {contact.phone}</a>
                  </p>
                  <p>
                    <a className="hover:text-gold-300" href={`mailto:${contact.email}?subject=${encodeURIComponent(p.name)}`}>{contact.email}</a>
                  </p>
                </div>
                {p.links.length > 0 && (
                  <ul className="mt-6 space-y-2 text-sm">
                    {p.links.map((l) => (
                      <li key={l.url}>
                        <a href={l.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-gold-300 hover:text-white">
                          {l.label} <ExternalLink className="size-3.5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="p-6 sm:p-10 lg:col-span-7">
                <InquiryForm projects={formProjects} defaultProject={p.slug} heading="" />
              </div>
            </div>
          </section>

          <footer className="space-y-3 border-t border-sand-200 pt-8 text-xs leading-relaxed text-muted">
            {p.lastVerified && <p>Project details last verified {formatDate(p.lastVerified)}.</p>}
            {p.disclaimer && <p className="uppercase">{p.disclaimer}</p>}
          </footer>
        </div>
      </article>

      <MobileContactBar phone={contact.phone} phoneE164={phoneE164} projectName={p.name} />
    </>
  );
}
