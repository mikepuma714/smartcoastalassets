import Link from "next/link";
import { getActiveProjects } from "@/lib/projects";
import { site } from "@/lib/site";

async function CopyrightYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  const projects = getActiveProjects();
  return (
    <footer className="bg-navy-950 text-white/75">
      <div className="container-luxe grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-display text-2xl tracking-[0.12em] text-white uppercase">Smart Coastal Assets</p>
          <p className="mt-2 text-[0.62rem] tracking-[0.32em] uppercase text-white/50">Pinellas County · Florida</p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed">{site.tagline}. Presented by {site.brokerage}.</p>
          <div className="mt-6 space-y-1 text-sm">
            <p className="text-white">{site.agent.name}</p>
            <p>
              <a className="hover:text-gold-300" href={`tel:${site.agent.phoneE164}`}>
                {site.agent.phone}
              </a>
            </p>
            <p>
              <a className="hover:text-gold-300" href={`mailto:${site.agent.email}`}>
                {site.agent.email}
              </a>
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow !text-gold-300">Residences</p>
          <ul className="mt-5 space-y-3 text-sm">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link className="hover:text-gold-300" href={`/projects/${p.slug}`}>
                  {p.name} <span className="text-white/40">· {p.address.city}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="eyebrow !text-gold-300">Learn</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link className="hover:text-gold-300" href="/guides">Buyer Guides</Link></li>
            <li><Link className="hover:text-gold-300" href="/faq">FAQ</Link></li>
            <li><Link className="hover:text-gold-300" href="/#map">Coastal Map</Link></li>
            <li><Link className="hover:text-gold-300" href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow !text-gold-300">Legal</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link className="hover:text-gold-300" href="/privacy">Privacy Policy</Link></li>
            <li><Link className="hover:text-gold-300" href="/terms">Terms of Use</Link></li>
            <li><Link className="hover:text-gold-300" href="/unsubscribe">Unsubscribe / Opt Out</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-luxe space-y-3 py-8 text-[0.72rem] leading-relaxed text-white/45">
          <p>{site.generalDisclaimer}</p>
          <p>{site.legalFooter}</p>
          <p>
            © <CopyrightYear /> {site.brokerage}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
