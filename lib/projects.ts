import "server-only";
import fs from "node:fs";
import path from "node:path";
import { imageMeta } from "./images";
import { projectSchema, type Project, type ProjectSummary } from "./project-schema";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

let cache: Project[] | null = null;

function loadAll(): Project[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".json"));
  const projects = files.map((file) => {
    const raw = JSON.parse(fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8"));
    const parsed = projectSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`Invalid project file content/projects/${file}:\n${parsed.error.message}`);
    }
    if (parsed.data.slug !== file.replace(/\.json$/, "")) {
      throw new Error(`content/projects/${file}: "slug" must match the file name.`);
    }
    return parsed.data;
  });
  cache = projects.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  return cache;
}

/** Projects shown in listings, the map and search data. */
export function getActiveProjects(): Project[] {
  return loadAll().filter((p) => p.status === "active");
}

/** Projects that have a public page (active + sold out). */
export function getPublicProjects(): Project[] {
  return loadAll().filter((p) => p.status === "active" || p.status === "soldout");
}

export function getSoldOutProjects(): Project[] {
  return loadAll().filter((p) => p.status === "soldout");
}

export function getProject(slug: string): Project | undefined {
  return getPublicProjects().find((p) => p.slug === slug);
}

export function townOf(p: Project): string {
  return p.address.city;
}

export function fullAddress(p: Project): string {
  const { street, city, state, zip } = p.address;
  return `${street}, ${city}, ${state}${zip ? ` ${zip}` : ""}`;
}

export function cardImageOf(p: Project) {
  return p.cardImage ?? p.gallery[0] ?? p.heroImage;
}

export function heroImageOf(p: Project) {
  return p.heroImage ?? p.gallery[0];
}

export function toSummary(p: Project): ProjectSummary {
  const image = cardImageOf(p);
  return {
    slug: p.slug,
    name: p.name,
    status: p.status,
    town: townOf(p),
    address: fullAddress(p),
    price: p.price?.display,
    geo: p.geo,
    image: image ? { ...image, blurDataURL: imageMeta(image.src)?.blurDataURL } : undefined,
    tagline: p.tagline,
  };
}
