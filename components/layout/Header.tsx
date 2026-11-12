"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { nav, site } from "@/lib/site";
import { Logo } from "./Logo";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (fn: (v: boolean) => boolean) => setOpenOn(fn(open) ? pathname : null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overHero = pathname === "/" && !scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-luxe ${
        overHero
          ? "bg-transparent py-5"
          : "border-b border-sand-200/70 bg-sand-50/90 py-3 shadow-[0_1px_24px_rgba(12,31,53,0.06)] backdrop-blur-md"
      }`}
    >
      <div className="container-luxe flex items-center justify-between gap-6">
        <Logo light={overHero} />

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[0.72rem] font-medium tracking-[0.22em] uppercase transition-colors ${
                overHero ? "text-white/85 hover:text-white" : "text-navy-800 hover:text-gold-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="btn-gold !px-5 !py-2.5">
            Inquire
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={`tel:${site.agent.phoneE164}`}
            aria-label={`Call ${site.agent.phone}`}
            className={`grid size-11 place-items-center rounded-full ${overHero ? "text-white" : "text-navy-900"}`}
          >
            <Phone className="size-5" strokeWidth={1.5} />
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`grid size-11 place-items-center rounded-full ${overHero ? "text-white" : "text-navy-900"}`}
          >
            {open ? <X className="size-6" strokeWidth={1.5} /> : <Menu className="size-6" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Mobile" className="container-luxe pt-4 pb-6 lg:hidden">
          <ul className="divide-y divide-sand-200">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block py-4 font-display text-2xl text-navy-900">
                  {item.label}
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
