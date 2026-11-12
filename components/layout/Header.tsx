"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Map as MapIcon, Menu, Phone, X } from "lucide-react";
import type { ProjectSummary } from "@/lib/project-schema";
import { nav, site } from "@/lib/site";
import { Logo } from "./Logo";

export type NavProject = Pick<ProjectSummary, "slug" | "name" | "town" | "price" | "image">;

const RESIDENCES_HREF = "/projects";

export function Header({ projects }: { projects: NavProject[] }) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const panelId = useId();
  const [scrolled, setScrolled] = useState(false);

  // Menus remember the page they were opened on, so navigating closes them.
  const [mobileOn, setMobileOn] = useState<string | null>(null);
  const [panelOn, setPanelOn] = useState<string | null>(null);
  const mobileOpen = mobileOn === pathname;
  const panelOpen = panelOn === pathname;
  const openPanel = () => setPanelOn(pathname);
  const closePanel = () => setPanelOn(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!panelOpen && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPanelOn(null);
        setMobileOn(null);
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setPanelOn(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [panelOpen, mobileOpen]);

  const overHero = pathname === "/" && !scrolled && !mobileOpen && !panelOpen;
  const linkTone = overHero ? "text-white/90 hover:text-white" : "text-navy-800 hover:text-gold-600";
  const linkBase = "text-[0.7rem] font-medium tracking-[0.16em] whitespace-nowrap uppercase transition-colors xl:tracking-[0.22em]";

  return (
    <header
      ref={headerRef}
      onMouseLeave={closePanel}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,padding,box-shadow] duration-500 ease-luxe ${
        overHero
          ? "bg-transparent py-5"
          : "border-b border-sand-200/70 bg-sand-50/95 py-3 shadow-[0_1px_24px_rgba(12,31,53,0.06)] backdrop-blur-md"
      }`}
    >
      <div className="container-luxe flex items-center justify-between gap-3 sm:gap-6">
        <Logo light={overHero} compact={scrolled && !overHero} />

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex xl:gap-8">
          {nav.map((item) =>
            item.href === RESIDENCES_HREF && projects.length > 0 ? (
              <button
                key={item.href}
                type="button"
                aria-expanded={panelOpen}
                aria-controls={panelId}
                onMouseEnter={openPanel}
                onClick={() => (panelOpen ? closePanel() : openPanel())}
                className={`${linkBase} ${linkTone} inline-flex items-center gap-1.5`}
              >
                {item.label}
                <ChevronDown
                  aria-hidden
                  className={`size-3.5 transition-transform duration-300 ${panelOpen ? "rotate-180" : ""}`}
                />
              </button>
            ) : (
              <Link key={item.href} href={item.href} onMouseEnter={closePanel} className={`${linkBase} ${linkTone}`}>
                {item.label}
              </Link>
            ),
          )}
          <Link href="/contact" onMouseEnter={closePanel} className="btn-gold !px-5 !py-2.5">
            Inquire
          </Link>
        </nav>

        <div className="-mr-2 flex shrink-0 items-center lg:hidden">
          <a
            href={`tel:${site.agent.phoneE164}`}
            aria-label={`Call ${site.agent.phone}`}
            className={`grid size-11 place-items-center rounded-full ${overHero ? "text-white" : "text-navy-900"}`}
          >
            <Phone className="size-5" strokeWidth={1.5} />
          </a>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOn(mobileOpen ? null : pathname)}
            className={`grid size-11 place-items-center rounded-full ${overHero ? "text-white" : "text-navy-900"}`}
          >
            {mobileOpen ? <X className="size-6" strokeWidth={1.5} /> : <Menu className="size-6" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {projects.length > 0 && (
        <div
          id={panelId}
          className={`absolute inset-x-0 top-full hidden border-b border-sand-200 bg-sand-50 shadow-[0_24px_48px_-24px_rgba(12,31,53,0.25)] ${
            panelOpen ? "lg:block" : ""
          }`}
        >
          <div className="container-luxe grid max-h-[calc(100dvh-5rem)] grid-cols-12 gap-8 overflow-y-auto py-7">
            <ul className="col-span-9 grid grid-cols-4 gap-5">
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link href={`/projects/${p.slug}`} className="group block" onClick={closePanel}>
                    <div className="relative aspect-[16/11] overflow-hidden rounded-sm bg-sand-200">
                      {p.image && (
                        <Image
                          src={p.image.src}
                          alt=""
                          fill
                          sizes="(min-width: 1280px) 18vw, 22vw"
                          className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
                          {...(p.image.blurDataURL
                            ? { placeholder: "blur" as const, blurDataURL: p.image.blurDataURL }
                            : {})}
                        />
                      )}
                    </div>
                    <p className="mt-3 font-display text-lg leading-tight text-navy-900 group-hover:text-gold-600 xl:text-xl">
                      {p.name}
                    </p>
                    <p className="mt-0.5 text-[0.62rem] tracking-[0.16em] text-muted uppercase">{p.town}, FL</p>
                    {p.price && <p className="mt-1 text-[0.8rem] leading-snug text-navy-800">{p.price}</p>}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="col-span-3 flex flex-col justify-between border-l border-sand-200 pl-8">
              <div>
                <p className="eyebrow">Residences</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Luxury coastal homes from Clearwater Beach to St. Pete Beach.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={RESIDENCES_HREF}
                  onClick={closePanel}
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-navy-900 uppercase hover:text-gold-600"
                >
                  All residences <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/#map"
                  onClick={closePanel}
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-navy-900 uppercase hover:text-gold-600"
                >
                  <MapIcon className="size-4" strokeWidth={1.5} /> Explore the map
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {mobileOpen && (
        <nav aria-label="Mobile" className="container-luxe max-h-[calc(100dvh-4.5rem)] overflow-y-auto pt-4 pb-6 lg:hidden">
          {projects.length > 0 && (
            <div className="border-b border-sand-200 pb-4">
              <p className="eyebrow">Residences</p>
              <ul className="mt-2">
                {projects.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/projects/${p.slug}`} className="flex items-center gap-3 py-2.5">
                      {p.image && (
                        <span className="relative size-12 shrink-0 overflow-hidden rounded-sm bg-sand-200">
                          <Image src={p.image.src} alt="" fill sizes="48px" className="object-cover" />
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="block truncate font-display text-xl leading-tight text-navy-900">{p.name}</span>
                        <span className="block text-[0.65rem] tracking-[0.18em] text-muted uppercase">
                          {p.town}
                          {p.price ? ` · ${p.price}` : ""}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <ul className="divide-y divide-sand-200">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block py-4 font-display text-2xl text-navy-900">
                  {item.href === RESIDENCES_HREF ? "All Residences" : item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact" className="btn-gold mt-5 w-full">
            Request Information
          </Link>
        </nav>
      )}
    </header>
  );
}
