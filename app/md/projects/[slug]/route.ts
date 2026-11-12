import { getProject, getPublicProjects } from "@/lib/projects";
import { projectMarkdown } from "@/lib/markdown";

export function generateStaticParams() {
  return getPublicProjects().map((p) => ({ slug: p.slug }));
}

export async function GET(_request: Request, { params }: RouteContext<"/md/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return new Response("Not found", { status: 404 });
  return new Response(projectMarkdown(project), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "X-Robots-Tag": "noindex" },
  });
}
