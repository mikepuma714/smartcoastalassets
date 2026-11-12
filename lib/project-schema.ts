import { z } from "zod";

export const ICONS = [
  "gem",
  "map-pin",
  "home",
  "landmark",
  "trending-up",
  "waves",
  "anchor",
  "palm",
  "sun",
  "building",
  "key",
  "sparkles",
  "utensils",
  "dumbbell",
  "paw",
  "car",
  "bed",
  "users",
  "fish",
  "glass",
  "shield",
  "compass",
] as const;

const icon = z.enum(ICONS);

const image = z.object({
  src: z.string().startsWith("/"),
  alt: z.string().min(1),
});

const floorplan = image.extend({
  label: z.string().min(1),
});

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  /** active = listed everywhere; soldout = shown as "Sold Out" in Past Projects only; draft/archived = hidden. */
  status: z.enum(["active", "soldout", "draft", "archived"]),
  order: z.number().default(100),
  tagline: z.string().optional(),
  propertyType: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string().default("FL"),
    zip: z.string().optional(),
  }),
  geo: z.object({ lat: z.number(), lng: z.number() }).optional(),
  price: z
    .object({
      display: z.string(),
      from: z.number().optional(),
      to: z.number().optional(),
      label: z.string().optional(),
    })
    .optional(),
  stats: z
    .object({
      bedrooms: z.string().optional(),
      bathrooms: z.string().optional(),
      sqft: z.string().optional(),
      residences: z.string().optional(),
      completion: z.string().optional(),
      residenceTypes: z.string().optional(),
    })
    .default({}),
  summary: z.string().optional(),
  heroImage: image.optional(),
  cardImage: image.optional(),
  gallery: z.array(image).default([]),
  floorplans: z.array(floorplan).default([]),
  highlights: z.array(z.object({ icon, title: z.string(), text: z.string() })).max(5).default([]),
  amenities: z.array(z.object({ icon, label: z.string() })).default([]),
  details: z
    .object({
      deposit: z.string().optional(),
      downPayment: z.string().optional(),
      financing: z.string().optional(),
      dscr: z.boolean().optional(),
      rentalMinimum: z.string().optional(),
      personalUse: z.string().optional(),
      management: z.string().optional(),
    })
    .default({}),
  income: z
    .object({
      figure: z.string().optional(),
      label: z.string().optional(),
      source: z.string().optional(),
      note: z.string().optional(),
    })
    .optional(),
  tax: z.object({ note: z.string() }).optional(),
  process: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
  disclaimer: z.string().optional(),
  contact: z
    .object({ name: z.string().optional(), phone: z.string().optional(), email: z.string().optional() })
    .optional(),
  lastVerified: z.string().optional(),
  /** Never displayed on the site. For the team only. */
  internalNotes: z.array(z.string()).default([]),
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectImage = z.infer<typeof image>;
export type IconName = (typeof ICONS)[number];

/** The subset of project data passed to client components (map, cards). */
export type ProjectSummary = {
  slug: string;
  name: string;
  status: Project["status"];
  town: string;
  address: string;
  price?: string;
  geo?: { lat: number; lng: number };
  image?: ProjectImage & { blurDataURL?: string };
  tagline?: string;
};
