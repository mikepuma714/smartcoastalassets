import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, KeyRound, Landmark, Waves } from "lucide-react";
import { HomeHero } from "@/components/home/HomeHero";
import { MapSection } from "@/components/home/MapSection";
import { ProjectShowcase, type ShowcaseItem } from "@/components/home/ProjectShowcase";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { imageMeta } from "@/lib/images";
import { getActiveProjects, heroImageOf, toSummary } from "@/lib/projects";
import { getGuides } from "@/lib/guides";
import { getMasterFaq } from "@/lib/faq";
import { faqLd } from "@/lib/structured-data";
import { site } from "@/lib/site";

export default function HomePage() {
  const projects = getActiveProjects();
  const summaries = projects.map(toSummary);
  const heroProject = projects.find((p) => p.slug === "beachmaker-resort") ?? projects[0];
  const heroImg = heroProject ? heroImageOf(heroProject) : undefined;

  const showcase: ShowcaseItem[] = projects.flatMap((p) => {
    const img = heroImageOf(p);
    if (!img) return [];
    return [
      {
        slug: p.slug,
        name: p.name,
        town: p.address.city,
        tagline: p.tagline,
        price: p.price?.display,
        image: { ...img, blurDataURL: imageMeta(img.src)?.blurDataURL },
        facts: [
          p.stats.bedrooms && { label: "Bedrooms", value: p.stats.bedrooms },
          p.stats.sqft && { label: "Sq. Ft.", value: p.stats.sqft },
          p.details.rentalMinimum && { label: "Rentals", value: p.details.rentalMinimum },
          p.stats.residences && { label: "Residences", value: p.stats.residences },
        ]
          .filter((f): f is { label: string; value: string } => Boolean(f))
          .slice(0, 3),
      },
    ];
  });

  const strCount = projects.filter((p) => /1–7|nightly/i.test(p.details.rentalMinimum ?? "")).length;
  const guides = getGuides().slice(0, 3);
  const faqTeaser = getMasterFaq().flatMap((g) => g.items).slice(0, 5);

  const pillars = [
    {
      icon: Waves,
      title: "Waterfront & walk-to-beach",
      text: "Every residence sits on Pinellas County's Gulf barrier islands, from Intracoastal frontage to one block from the sand.",
    },
    {
      icon: KeyRound,
      title: "Rental flexibility",
      text: `${strCount} of ${projects.length} current residences permit nightly or 1–7 day rentals. Rules are published on every project page.`,
    },
    {
      icon: Landmark,
      title: "DSCR financing",
      text: "Qualify on the property's rental income. DSCR options are available across our current developments, subject to lender approval.",
    },
    {
      icon: BadgeCheck,
      title: "Verified details",
      text: "Pricing, deposits, rental rules and income figures come from the developer or the named source, each with a last-verified date.",
    },
  ];

  return (
    <>
      <JsonLd data={faqLd(faqTeaser)} />

      {heroImg && (
        <HomeHero image={{ ...heroImg, blurDataURL: imageMeta(heroImg.src)?.blurDataURL }} />
      )}

      <section id="intro" aria-labelledby="intro-title" className="scroll-mt-20 bg-sand-50 py-24 sm:py-32">
        <div className="container-luxe grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">{site.name}</p>
            <h2 id="intro-title" className="mt-4 text-4xl leading-[1.05] sm:text-6xl">
              Own the Gulf Coast, <em className="text-gold-600">smartly.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <p className="text-lg leading-relaxed text-muted sm:text-xl">
              We present a small, curated collection of new and move-in-ready coastal residences from Clearwater Beach
              to St. Pete Beach. Each is chosen for location, scarcity and ownership flexibility, and each is
              documented with the facts serious buyers ask for first: rental rules, financing and verified numbers.
            </p>
            <Link href="/projects" className="mt-8 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-gold-600 uppercase">
              All residences <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
        <div className="container-luxe mt-20">
          <ul className="grid gap-px overflow-hidden rounded-sm bg-sand-200 ring-1 ring-sand-200 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.08} className="bg-sand-50 p-8">
                <p.icon aria-hidden strokeWidth={1.1} className="size-9 text-gold-500" />
                <h3 className="mt-6 text-2xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{p.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <MapSection projects={summaries} />

      <ProjectShowcase items={showcase} />

      <section aria-labelledby="guides-title" className="bg-sand-100 py-24 sm:py-32">
        <div className="container-luxe">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Buyer guides</p>
              <h2 id="guides-title" className="mt-4 max-w-2xl text-4xl leading-[1.05] sm:text-5xl">
                Clear answers before you buy on the coast.
              </h2>
            </div>
            <Link href="/guides" className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-gold-600 uppercase">
              All guides <ArrowRight className="size-4" />
            </Link>
          </Reveal>
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {guides.map((g, i) => (
              <Reveal as="li" key={g.slug} delay={i * 0.08}>
                <Link
                  href={`/guides/${g.slug}`}
                  className="group flex h-full flex-col rounded-sm bg-white p-8 ring-1 ring-sand-200 transition hover:-translate-y-1 hover:ring-gold-400"
                >
                  <Building2 aria-hidden strokeWidth={1.1} className="size-7 text-gold-500" />
                  <h3 className="mt-6 text-2xl leading-snug">{g.title}</h3>
                  <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted">{g.answer}</p>
                  <span className="mt-auto inline-flex pt-6 items-center gap-2 text-xs font-semibold tracking-[0.2em] text-navy-800 uppercase">
                    Read guide <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="bg-sand-50 py-24 sm:py-32">
        <div className="container-luxe grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">FAQ</p>
            <h2 id="faq-title" className="mt-4 text-4xl leading-[1.05] sm:text-5xl">
              Questions every buyer asks.
            </h2>
            <Link href="/faq" className="mt-8 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-gold-600 uppercase">
              Full FAQ <ArrowRight className="size-4" />
            </Link>
          </Reveal>
          <div className="lg:col-span-8">
            <Faq items={faqTeaser} />
          </div>
        </div>
      </section>

      <section id="inquire" aria-labelledby="home-inquire" className="relative scroll-mt-20 overflow-hidden bg-navy-950 py-24 sm:py-32">
        {heroProject && projects[1] && heroImageOf(projects[1]) && (
          <ParallaxImage
            src={heroImageOf(projects[1])!.src}
            alt=""
            strength={10}
            overlayClassName="bg-navy-950/85"
          />
        )}
        <div className="container-luxe relative grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow !text-gold-300">Private inquiries</p>
            <h2 id="home-inquire" className="mt-4 text-4xl leading-[1.05] !text-white sm:text-6xl">
              Let&rsquo;s find your place on the coast.
            </h2>
            <p className="mt-6 max-w-md text-white/75">
              Ask about pricing, availability, floor plans, rental rules or financing. Prefer to talk?
            </p>
            <p className="mt-6 font-display text-3xl text-white">{site.agent.name}</p>
            <p className="text-xs tracking-[0.18em] text-white/60 uppercase">{site.brokerage}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={`tel:${site.agent.phoneE164}`} className="btn-outline text-white hover:bg-white hover:text-navy-900">
                Call {site.agent.phone}
              </a>
              <a href={`sms:${site.agent.phoneE164}`} className="btn-outline text-white hover:bg-white hover:text-navy-900">
                Text us
              </a>
            </div>
          </Reveal>
          <div className="rounded-sm bg-white p-6 sm:p-10 lg:col-span-7">
            <InquiryForm projects={projects.map(({ slug, name }) => ({ slug, name }))} heading="Request Information" />
          </div>
        </div>
      </section>
    </>
  );
}
