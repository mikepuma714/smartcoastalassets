"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { ParallaxImage } from "@/components/motion/ParallaxImage";

export type ShowcaseItem = {
  slug: string;
  name: string;
  town: string;
  tagline?: string;
  price?: string;
  image: { src: string; alt: string; blurDataURL?: string };
  facts: { label: string; value: string }[];
};

function Panel({ item, index }: { item: ShowcaseItem; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0.15, 0.5], [80, 0]);
  const opacity = useTransform(scrollYProgress, [0.15, 0.45, 0.8, 0.95], [0, 1, 1, 0.2]);

  return (
    <section
      ref={ref}
      aria-label={item.name}
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-navy-950 text-white"
    >
      <ParallaxImage
        src={item.image.src}
        alt={item.image.alt}
        blurDataURL={item.image.blurDataURL}
        strength={14}
        overlayClassName="bg-gradient-to-t from-navy-950/90 via-navy-950/25 to-navy-950/40"
      />
      <motion.div className="container-luxe relative z-10 pb-20 sm:pb-24" style={reduce ? undefined : { y, opacity }}>
        <p className="eyebrow !text-gold-300">
          {String(index + 1).padStart(2, "0")} · {item.town}, Florida
        </p>
        <h2 className="mt-4 text-5xl leading-[0.95] !text-white sm:text-7xl lg:text-8xl">{item.name}</h2>
        {item.tagline && <p className="mt-5 max-w-xl text-lg text-white/80">{item.tagline}</p>}

        <dl className="mt-10 grid max-w-4xl grid-cols-2 gap-x-8 gap-y-6 border-t border-white/20 pt-6 sm:grid-cols-4">
          {item.price && (
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-[0.62rem] tracking-[0.26em] text-white/55 uppercase">Price</dt>
              <dd className="mt-1 font-display text-2xl">{item.price}</dd>
            </div>
          )}
          {item.facts.map((f) => (
            <div key={f.label}>
              <dt className="text-[0.62rem] tracking-[0.26em] text-white/55 uppercase">{f.label}</dt>
              <dd className="mt-1 font-display text-2xl">{f.value}</dd>
            </div>
          ))}
        </dl>

        <Link
          href={`/projects/${item.slug}`}
          className="btn-outline group mt-10 text-white hover:border-gold-400 hover:bg-gold-500"
        >
          Explore {item.name}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </section>
  );
}

export function ProjectShowcase({ items }: { items: ShowcaseItem[] }) {
  return (
    <div>
      {items.map((item, i) => (
        <Panel key={item.slug} item={item} index={i} />
      ))}
    </div>
  );
}
