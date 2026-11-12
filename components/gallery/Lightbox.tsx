"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type Slide = { src: string; alt: string; label?: string; blurDataURL?: string };

export function Lightbox({
  slides,
  startIndex,
  onClose,
  contain = false,
}: {
  slides: Slide[];
  startIndex: number;
  onClose: () => void;
  contain?: boolean;
}) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: slides.length > 1, startIndex });
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setIndex(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  const prev = useCallback(() => embla?.scrollPrev(), [embla]);
  const next = useCallback(() => embla?.scrollNext(), [embla]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, prev, next]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      data-lenis-prevent
      className={`fixed inset-0 z-[100] flex flex-col ${contain ? "bg-sand-50" : "bg-navy-950"}`}
    >
      <div className={`flex items-center justify-between px-4 py-3 ${contain ? "text-navy-900" : "text-white"}`}>
        <p className="text-sm tracking-[0.15em]">
          {index + 1} / {slides.length}
          {slides[index]?.label ? <span className="ml-3 opacity-70">{slides[index].label}</span> : null}
        </p>
        <button type="button" onClick={onClose} aria-label="Close viewer" className="grid size-11 place-items-center">
          <X className="size-6" strokeWidth={1.5} />
        </button>
      </div>
      <div className="relative min-h-0 flex-1">
        <div ref={emblaRef} className="h-full overflow-hidden">
          <div className="flex h-full touch-pan-y">
            {slides.map((s) => (
              <div key={s.src} className="relative h-full min-w-0 flex-[0_0_100%]">
                <Image src={s.src} alt={s.alt} fill sizes="100vw" quality={85} className="object-contain" />
              </div>
            ))}
          </div>
        </div>
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="absolute top-1/2 left-3 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy-900 shadow sm:grid"
            >
              <ChevronLeft className="size-6" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="absolute top-1/2 right-3 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy-900 shadow sm:grid"
            >
              <ChevronRight className="size-6" strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>
      <div className="h-6" />
    </div>
  );
}
