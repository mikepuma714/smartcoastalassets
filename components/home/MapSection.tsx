"use client";

import { useState } from "react";
import { Compass } from "lucide-react";
import type { ProjectSummary } from "@/lib/project-schema";
import { CoastalMap } from "@/components/map/CoastalMap";
import { ProjectCard } from "@/components/projects/ProjectCard";

export function MapSection({ projects }: { projects: ProjectSummary[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="map" aria-labelledby="map-heading" className="scroll-mt-20 bg-sand-50">
      <div className="grid lg:grid-cols-12">
        <div className="relative lg:col-span-5">
          <div className="lg:sticky lg:top-16 lg:h-[calc(100dvh-4rem)]">
            <CoastalMap
              projects={projects}
              activeSlug={active}
              onActiveChange={setActive}
              className="h-[72vh] min-h-[460px] lg:h-full lg:min-h-0"
            />
            <Compass
              aria-hidden
              strokeWidth={1}
              className="pointer-events-none absolute bottom-8 left-6 hidden size-12 text-white/70 lg:block"
            />
          </div>
        </div>

        <div className="px-5 py-14 sm:px-8 lg:col-span-7 lg:px-14 lg:py-24">
          <p className="eyebrow">Available Developments</p>
          <h2 id="map-heading" className="mt-4 max-w-xl text-4xl leading-[1.05] sm:text-5xl">
            Explore the coast, one address at a time.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
            Every pin marks a real location. Tap a marker or a residence to see photos, pricing, rental rules and
            financing options.
          </p>
          <div className="hairline my-10" />
          <ul className="grid gap-6 sm:grid-cols-2">
            {projects.map((p) => (
              <li key={p.slug}>
                <ProjectCard project={p} active={active === p.slug} onHover={setActive} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
