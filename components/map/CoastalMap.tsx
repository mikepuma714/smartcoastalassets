"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";
import { ArrowRight, X } from "lucide-react";
import type { ProjectSummary } from "@/lib/project-schema";
import { COAST_BOUNDS, TOWNS, satelliteTiles } from "@/lib/map";

function thumb(src: string) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=128&q=75`;
}

export function CoastalMap({
  projects,
  activeSlug,
  onActiveChange,
  className = "",
}: {
  projects: ProjectSummary[];
  activeSlug?: string | null;
  onActiveChange?: (slug: string | null) => void;
  className?: string;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const [selected, setSelected] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const current = activeSlug !== undefined && activeSlug !== null ? activeSlug : selected;
  const selectedProject = projects.find((p) => p.slug === selected);

  const select = (slug: string | null) => {
    setSelected(slug);
    onActiveChange?.(slug);
  };
  const selectRef = useRef(select);
  const selectedRef = useRef(selected);
  useEffect(() => {
    selectRef.current = select;
    selectedRef.current = selected;
  });

  useEffect(() => {
    let cancelled = false;
    const markers = markersRef.current;

    (async () => {
      const maplibregl = await import("maplibre-gl");
      if (cancelled || !containerRef.current) return;
      maplibregl.setWorkerUrl(`/vendor/maplibre-gl-worker.mjs?v=${maplibregl.getVersion()}`);

      const touch = window.matchMedia("(hover: none)").matches;
      const width = containerRef.current.clientWidth;
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: {
          version: 8,
          sources: {
            satellite: {
              type: "raster",
              tiles: [satelliteTiles()],
              tileSize: 256,
              maxzoom: 19,
              attribution: "Imagery © Esri, Maxar, Earthstar Geographics",
            },
          },
          layers: [{ id: "satellite", type: "raster", source: "satellite", paint: { "raster-saturation": -0.05 } }],
        },
        bounds: COAST_BOUNDS,
        fitBoundsOptions: {
          padding: { top: 32, bottom: 32, right: 24, left: Math.min(170, Math.round(width * 0.38)) },
        },
        maxBounds: [
          [-83.15, 27.55],
          [-82.45, 28.15],
        ],
        minZoom: 9.5,
        maxZoom: 17,
        attributionControl: { compact: true },
        cooperativeGestures: touch,
        dragRotate: false,
        pitchWithRotate: false,
      });
      map.touchZoomRotate.disableRotation();
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      mapRef.current = map;

      for (const town of TOWNS) {
        const el = document.createElement("div");
        el.className = "scam-town";
        el.setAttribute("aria-hidden", "true");
        el.textContent = town.name;
        new maplibregl.Marker({ element: el, anchor: "right", offset: [-22, 0] })
          .setLngLat([town.lng, town.lat])
          .addTo(map);
      }

      for (const p of projects) {
        if (!p.geo) continue;
        const el = document.createElement("button");
        el.type = "button";
        el.className = "scam-marker";
        el.setAttribute("aria-label", `${p.name}, ${p.town}. ${p.price ?? ""}`);
        el.innerHTML = `
          <span class="scam-marker__ring">${p.image ? `<img src="${thumb(p.image.src)}" alt="" loading="lazy" />` : ""}</span>
          <span class="scam-marker__label"><strong></strong><small></small></span>`;
        el.querySelector("strong")!.textContent = p.name;
        el.querySelector("small")!.textContent = p.town;

        el.addEventListener("mouseenter", () => !touch && selectRef.current(p.slug));
        el.addEventListener("mouseleave", () => !touch && selectRef.current(null));
        el.addEventListener("focus", () => selectRef.current(p.slug));
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          if (!touch || selectedRef.current === p.slug) {
            router.push(`/projects/${p.slug}`);
          } else {
            selectRef.current(p.slug);
            map.easeTo({ center: [p.geo!.lng, p.geo!.lat], duration: 600 });
          }
        });

        const marker = new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat([p.geo.lng, p.geo.lat]).addTo(map);
        markers.set(p.slug, marker);
      }

      const MIN_GAP = 54;
      const rowStep = touch ? 44 : MIN_GAP;
      // Markers too close to tell apart are lined up eastward (inland) from the westernmost one,
      // so they never cover the town labels drawn over the Gulf.
      // Large groups tighten (photos overlap) so the last marker stays inside the right edge.
      const spread = () => {
        const points = [...markers.values()]
          .map((marker) => ({ marker, pt: map.project(marker.getLngLat()) }))
          .sort((a, b) => a.pt.x - b.pt.x);
        const groups: { x: number; y: number; members: typeof points }[] = [];
        for (const point of points) {
          const group = groups.find((g) => Math.hypot(g.x - point.pt.x, g.y - point.pt.y) < MIN_GAP);
          if (group) group.members.push(point);
          else groups.push({ x: point.pt.x, y: point.pt.y, members: [point] });
        }
        const mapWidth = map.getContainer().clientWidth;
        for (const group of groups) {
          const n = group.members.length;
          const half = group.members[0].marker.getElement().offsetWidth / 2;
          const room = mapWidth - 8 - half - group.x;
          const step = n > 1 ? Math.max(rowStep * 0.6, Math.min(rowStep, room / (n - 1))) : 0;
          group.members.forEach(({ marker, pt }, i) => {
            marker.setOffset([group.x + i * step - pt.x, group.y - pt.y]);
          });
        }
      };
      spread();
      map.on("zoom", spread);

      map.on("click", () => selectRef.current(null));
      map.on("load", () => !cancelled && setReady(true));
    })();

    return () => {
      cancelled = true;
      markers.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [projects, router]);

  useEffect(() => {
    for (const [slug, marker] of markersRef.current) {
      const el = marker.getElement();
      el.classList.toggle("is-active", slug === current);
      el.style.zIndex = slug === current ? "10" : "1";
    }
  }, [current, ready]);

  return (
    <div className={`relative overflow-hidden bg-navy-900 ${className}`}>
      <div className="absolute inset-0">
        <div ref={containerRef} className="size-full" aria-label="Map of Pinellas County coastal projects" role="region" />
      </div>
      <div
        className={`pointer-events-none absolute inset-0 bg-navy-900 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
      />

      {selectedProject && (
        <div className="absolute inset-x-3 bottom-3 z-10 sm:hidden">
          <div className="flex items-center gap-3 rounded-sm bg-white p-2.5 shadow-2xl">
            {selectedProject.image && (
              <div className="relative size-16 shrink-0 overflow-hidden rounded-sm">
                <Image src={selectedProject.image.src} alt="" fill sizes="64px" className="object-cover" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg leading-tight text-navy-900">{selectedProject.name}</p>
              <p className="truncate text-xs text-muted">
                {selectedProject.town}
                {selectedProject.price ? ` · ${selectedProject.price}` : ""}
              </p>
            </div>
            <Link
              href={`/projects/${selectedProject.slug}`}
              className="grid size-11 shrink-0 place-items-center rounded-sm bg-gold-500 text-white"
              aria-label={`View ${selectedProject.name}`}
            >
              <ArrowRight className="size-5" />
            </Link>
            <button
              type="button"
              onClick={() => select(null)}
              className="grid size-8 shrink-0 place-items-center text-muted"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
