import "server-only";
import type { Project } from "./project-schema";
import type { Guide } from "./guides";
import { fullAddress } from "./projects";
import { site } from "./site";

function line(label: string, value?: string) {
  return value ? `- **${label}:** ${value}` : null;
}

export function projectMarkdown(p: Project): string {
  const url = `${site.url}/projects/${p.slug}`;
  const out: (string | null)[] = [
    `# ${p.name}`,
    "",
    `${p.tagline ?? ""}`.trim() || null,
    "",
    `Canonical page: ${url}`,
    p.lastVerified ? `Details last verified: ${p.lastVerified}` : null,
    p.status === "soldout" ? "Status: SOLD OUT" : "Status: Available",
    "",
    "## Key facts",
    line("Address", fullAddress(p)),
    p.geo ? line("Coordinates", `${p.geo.lat}, ${p.geo.lng}`) : null,
    line("Price", p.price?.display),
    line("Property type", p.propertyType),
    line("Bedrooms", p.stats.bedrooms),
    line("Bathrooms", p.stats.bathrooms),
    line("Square feet", p.stats.sqft),
    line("Number of residences", p.stats.residences),
    line("Residence types", p.stats.residenceTypes),
    line("Completion", p.stats.completion),
    "",
    p.summary ? "## Overview" : null,
    p.summary ?? null,
    "",
    p.highlights.length ? "## Investment and ownership highlights" : null,
    ...p.highlights.map((h) => `- **${h.title}:** ${h.text}`),
    "",
    p.amenities.length ? "## Amenities and lifestyle" : null,
    ...p.amenities.map((a) => `- ${a.label}`),
    "",
    "## Rental rules, management and financing",
    line("Minimum rental stay", p.details.rentalMinimum),
    line("Personal use", p.details.personalUse),
    line("Management", p.details.management),
    line("Initial deposit", p.details.deposit),
    line("Total down payment", p.details.downPayment),
    line("Financing", p.details.financing),
    p.details.dscr ? "- **DSCR financing:** Available (subject to lender approval)" : null,
    "",
    p.income ? "## Rental income" : null,
    p.income ? line(p.income.label ?? "Income", p.income.figure ?? "Available on request") : null,
    p.income?.source ? line("Source", p.income.source) : null,
    p.income?.note ? `- ${p.income.note}` : null,
    "",
    p.tax ? "## Tax considerations" : null,
    p.tax ? `${p.tax.note} Consult your CPA.` : null,
    "",
    p.process.length ? "## Path to ownership" : null,
    ...p.process.map((s, i) => `${i + 1}. **${s.title}:** ${s.text}`),
    "",
    p.faqs.length ? "## Frequently asked questions" : null,
    ...p.faqs.flatMap((f) => [`### ${f.q}`, f.a, ""]),
    "## Contact",
    `${p.contact?.name ?? site.agent.name}, ${site.brokerage}: call or text ${p.contact?.phone ?? site.agent.phone}, ${p.contact?.email ?? site.agent.email}. Inquiry form: ${url}#inquire`,
    "",
    p.links.length ? "## Links" : null,
    ...p.links.map((l) => `- [${l.label}](${l.url})`),
    "",
    p.disclaimer ? `_${p.disclaimer}_` : null,
    `_${site.generalDisclaimer}_`,
  ];
  return out.filter((l) => l !== null).join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
}

export function guideMarkdown(g: Guide): string {
  const out: string[] = [
    `# ${g.title}`,
    "",
    `Canonical page: ${site.url}/guides/${g.slug}`,
    `Last reviewed: ${g.updated}`,
    "",
    `**Short answer:** ${g.answer}`,
    "",
  ];
  for (const s of g.sections) {
    out.push(`## ${s.heading}`, "");
    s.paragraphs?.forEach((p) => out.push(p, ""));
    s.bullets?.forEach((b) => out.push(`- ${b}`));
    if (s.bullets) out.push("");
    if (s.table && s.table.rows.length) {
      out.push(`| ${s.table.head.join(" | ")} |`, `| ${s.table.head.map(() => "---").join(" | ")} |`);
      s.table.rows.forEach((r) => out.push(`| ${r.map((c) => c.replace(/\|/g, "/")).join(" | ")} |`));
      out.push("");
    }
  }
  if (g.faqs.length) {
    out.push("## FAQ", "");
    g.faqs.forEach((f) => out.push(`### ${f.q}`, f.a, ""));
  }
  out.push("## Sources", ...g.sources.map((s) => `- [${s.label}](${s.url})`), "");
  if (g.disclaimer) out.push(`_${g.disclaimer}_`, "");
  return out.join("\n");
}
