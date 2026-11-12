"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Lightbox, type Slide } from "./Lightbox";

type Tab = "photos" | "plans";

export function ProjectGallery({ photos, floorplans }: { photos: Slide[]; floorplans: Slide[] }) {
  const [tab, setTab] = useState<Tab>("photos");
  const slides = tab === "photos" ? photos : floorplans;
  const isPlans = tab === "plans";

  const [mainRef, main] = useEmblaCarousel({ loop: slides.length > 1 });
  const [thumbRef, thumbs] = useEmblaCarousel({ dragFree: true, containScroll: "keepSnaps" });
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (!main) return;
    const onSelect = () => {
      const i = main.selectedScrollSnap();
      setIndex(i);
      thumbs?.scrollTo(i);
    };
    onSelect();
    main.on("select", onSelect).on("reInit", onSelect);
    return () => {
      main.off("select", onSelect).off("reInit", onSelect);
    };
  }, [main, thumbs]);

  useEffect(() => {
    main?.reInit();
    thumbs?.reInit();
    main?.scrollTo(0, true);
  }, [tab, main, thumbs]);

  const prev = useCallback(() => main?.scrollPrev(), [main]);
  const next = useCallback(() => main?.scrollNext(), [main]);

  if (photos.length === 0) return null;

  return (
    <div>
      <div className="group relative overflow-hidden bg-navy-950">
        <div ref={mainRef} className="overflow-hidden">
          <div className="flex touch-pan-y">
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                onClick={() => setLightbox(i)}
                aria-label={`Open ${s.label ?? s.alt} full screen`}
                className={`relative aspect-[4/3] min-w-0 flex-[0_0_100%] cursor-zoom-in sm:aspect-[16/9] lg:aspect-auto lg:h-[min(74vh,760px)] ${
                  isPlans ? "bg-white" : ""
                }`}
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  priority={i === 0 && tab === "photos"}
                  sizes="100vw"
                  quality={85}
                  className={isPlans ? "object-contain p-4" : "object-cover"}
                  {...(s.blurDataURL && !isPlans ? { placeholder: "blur" as const, blurDataURL: s.blurDataURL } : {})}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
          {floorplans.length > 0 ? (
            <div className="pointer-events-auto flex rounded-full bg-navy-950/60 p-1 text-[0.65rem] font-semibold tracking-[0.18em] uppercase backdrop-blur">
              {(["photos", "plans"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  aria-pressed={tab === t}
                  className={`rounded-full px-4 py-2 transition-colors ${tab === t ? "bg-white text-navy-900" : "text-white/80 hover:text-white"}`}
                >
                  {t === "photos" ? `Photos (${photos.length})` : `Floor Plans (${floorplans.length})`}
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}
          <span className="rounded-full bg-navy-950/60 px-3.5 py-1.5 text-xs tracking-[0.12em] text-white backdrop-blur">
            {index + 1} / {slides.length}
          </span>
        </div>

        {slides[index]?.label && (
          <p className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-navy-950/70 px-4 py-1.5 text-xs tracking-[0.12em] text-white uppercase">
            {slides[index].label}
          </p>
        )}

        <button
          type="button"
          onClick={() => setLightbox(index)}
          aria-label="View full screen"
          className="absolute right-4 bottom-4 grid size-11 place-items-center rounded-full bg-white/90 text-navy-900 shadow-lg"
        >
          <Expand className="size-4" strokeWidth={1.5} />
        </button>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute top-1/2 left-4 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy-900 shadow-lg transition hover:bg-white sm:grid"
            >
              <ChevronLeft className="size-6" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute top-1/2 right-4 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy-900 shadow-lg transition hover:bg-white sm:grid"
            >
              <ChevronRight className="size-6" strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>

      <div className="container-luxe mt-3">
        <div ref={thumbRef} className="overflow-hidden">
          <div className="flex gap-2.5">
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                onClick={() => main?.scrollTo(i)}
                aria-label={`Show ${s.label ?? s.alt}`}
                aria-current={i === index ? "true" : undefined}
                className={`relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-sm transition-all sm:w-36 ${
                  isPlans ? "bg-white" : "bg-sand-200"
                } ${i === index ? "ring-2 ring-gold-500 ring-offset-2 ring-offset-sand-50" : "opacity-70 hover:opacity-100"}`}
              >
                <Image src={s.src} alt="" fill sizes="144px" className={isPlans ? "object-contain p-1" : "object-cover"} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {lightbox !== null && (
        <Lightbox slides={slides} startIndex={lightbox} contain={isPlans} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}
