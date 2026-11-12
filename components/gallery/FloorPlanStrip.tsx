"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox, type Slide } from "./Lightbox";

export function FloorPlanStrip({ plans }: { plans: Slide[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <ul className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-5">
        {plans.map((p, i) => (
          <li key={p.src} className="w-56 shrink-0 snap-start sm:w-auto">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group block w-full overflow-hidden rounded-sm bg-white text-left ring-1 ring-sand-200 transition hover:ring-gold-400"
            >
              <span className="relative block aspect-[4/3]">
                <Image src={p.src} alt={p.alt} fill sizes="(min-width:1024px) 20vw, 224px" className="object-contain p-2" />
              </span>
              <span className="block border-t border-sand-200 px-3 py-2 text-[0.68rem] font-semibold tracking-[0.14em] text-navy-800 uppercase">
                {p.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {open !== null && <Lightbox slides={plans} startIndex={open} contain onClose={() => setOpen(null)} />}
    </>
  );
}
