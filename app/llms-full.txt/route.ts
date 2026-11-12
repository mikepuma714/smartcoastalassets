import { getPublicProjects } from "@/lib/projects";
import { getGuides } from "@/lib/guides";
import { getMasterFaq } from "@/lib/faq";
import { guideMarkdown, projectMarkdown } from "@/lib/markdown";
import { site } from "@/lib/site";

export function GET() {
  const parts = [
    `# ${site.name}: complete reference`,
    "",
    `> ${site.description}`,
    "",
    `Presented by ${site.brokerage}. Contact ${site.agent.name}: ${site.agent.phone} (call or text), ${site.agent.email}. Website: ${site.url}`,
    "",
    "---",
    "",
    ...getPublicProjects().flatMap((p) => [projectMarkdown(p), "---", ""]),
    ...getGuides().flatMap((g) => [guideMarkdown(g), "---", ""]),
    "# Frequently asked questions",
    "",
    ...getMasterFaq().flatMap((group) => [`## ${group.title}`, "", ...group.items.flatMap((i) => [`### ${i.q}`, i.a, ""])]),
  ];
  return new Response(parts.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
