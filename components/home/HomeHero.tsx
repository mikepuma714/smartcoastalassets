"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

export function HomeHero({
  image,
  stats,
}: {
  image: { src: string; alt: string; blurDataURL?: string };
  stats: { value: string; label: string }[];
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1.22]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-45%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const veil = useTransform(scrollYProgress, [0, 1], [0.25, 0.75]);

  return (
    <section ref={ref} aria-label="Introduction" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-navy-950">
      <motion.div className="absolute inset-0" style={reduce ? undefined : { scale, y: imageY }}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover"
          {...(image.blurDataURL ? { placeholder: "blur" as const, blurDataURL: image.blurDataURL } : {})}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 via-navy-950/10 to-navy-950/80" />
      <motion.div className="absolute inset-0 bg-navy-950" style={{ opacity: reduce ? 0.25 : veil }} />

      <motion.div
        className="relative z-10 flex h-full flex-col justify-end pb-24 sm:pb-28"
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
      >
        <div className="container-luxe">
          <motion.p
            className="eyebrow !text-gold-300"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Clearwater Beach to St. Pete Beach
          </motion.p>
          <motion.h1
            className="mt-5 max-w-4xl text-[2.9rem] leading-[0.98] !text-white sm:text-7xl lg:text-[6.2rem]"
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            Luxury coastal residences on Florida&rsquo;s Gulf&nbsp;Coast.
          </motion.h1>
          <motion.p
            className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            New and move-in-ready homes in Pinellas County, with short-term-rental flexibility, DSCR financing
            options and verified details.
          </motion.p>
          <motion.div
            className="mt-9 flex flex-wrap gap-3"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="#map" className="btn-gold">
              Explore the Map
            </Link>
            <Link href="/projects" className="btn-outline text-white hover:bg-white hover:text-navy-900">
              View Residences
            </Link>
          </motion.div>

          {stats.length > 0 && (
            <motion.dl
              className="mt-14 hidden max-w-3xl grid-cols-3 gap-8 border-t border-white/20 pt-6 sm:grid"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1 }}
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-[0.62rem] tracking-[0.26em] text-white/60 uppercase">{s.label}</dt>
                  <dd className="mt-1 font-display text-3xl text-white">{s.value}</dd>
                </div>
              ))}
            </motion.dl>
          )}
        </div>
      </motion.div>

      <a
        href="#intro"
        aria-label="Scroll to content"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/70 transition-colors hover:text-white"
      >
        <ChevronDown className="size-7 animate-bounce" strokeWidth={1} />
      </a>
    </section>
  );
}
