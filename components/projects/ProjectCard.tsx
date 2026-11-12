"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { ProjectSummary } from "@/lib/project-schema";

export function ProjectCard({
  project,
  active = false,
  onHover,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 85vw",
}: {
  project: ProjectSummary;
  active?: boolean;
  onHover?: (slug: string | null) => void;
  sizes?: string;
}) {
  const soldOut = project.status === "soldout";
  return (
    <Link
      href={`/projects/${project.slug}`}
      onMouseEnter={() => onHover?.(project.slug)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(project.slug)}
      onBlur={() => onHover?.(null)}
      className={`group block overflow-hidden rounded-sm bg-white shadow-[0_1px_2px_rgba(12,31,53,0.06),0_12px_32px_-12px_rgba(12,31,53,0.18)] ring-1 transition-all duration-500 ease-luxe hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(12,31,53,0.35)] ${
        active ? "ring-gold-400" : "ring-sand-200/80"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-200">
        {project.image && (
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-[1.2s] ease-luxe group-hover:scale-[1.06]"
            {...(project.image.blurDataURL ? { placeholder: "blur" as const, blurDataURL: project.image.blurDataURL } : {})}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent" />
        {soldOut && (
          <span className="absolute top-3 left-3 rounded-sm bg-navy-900/90 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.2em] text-white uppercase">
            Sold Out
          </span>
        )}
        <span className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-white/90 text-navy-900 opacity-0 transition-all duration-500 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-2xl leading-tight">{project.name}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs tracking-[0.08em] text-muted uppercase">
          <MapPin className="size-3.5 text-gold-500" strokeWidth={1.5} />
          {project.town}, FL
        </p>
        {project.price && (
          <p className="mt-4 border-t border-sand-200 pt-4 font-display text-xl text-navy-800">{project.price}</p>
        )}
      </div>
    </Link>
  );
}
