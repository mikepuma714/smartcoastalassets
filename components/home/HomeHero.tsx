"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function HomeHero({ image }: { image: { src: string; alt: string; blurDataURL?: string } }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1.22]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const veil = useTransform(scrollYProgress, [0, 1], [0.2, 0.75]);

  const enter = (delay: number, y = 20) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.1, delay, ease: EASE },
        };

  return (
    <section
      ref={ref}
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-navy-950"
    >
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
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/75 via-navy-950/25 to-navy-950/85" />
      <motion.div className="absolute inset-0 bg-navy-950" style={{ opacity: reduce ? 0.2 : veil }} />

      <motion.div
        className="relative z-10 flex flex-1 flex-col justify-end pt-32 pb-24 sm:pt-36"
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
      >
        <div className="container-luxe">
          <motion.p className="eyebrow !text-gold-300" {...enter(0.2, 16)}>
            Clearwater Beach to St. Pete Beach
          </motion.p>
          <motion.h1
            className="mt-5 max-w-4xl text-[clamp(2.6rem,min(6.4vw,9.5svh),6rem)] leading-[1] !text-white"
            {...enter(0.35, 30)}
          >
            Luxury coastal residences on Florida&rsquo;s Gulf&nbsp;Coast.
          </motion.h1>
          <motion.p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg" {...enter(0.55)}>
            New and move-in-ready homes in Pinellas County, with short-term-rental flexibility, DSCR financing
            options and verified details.
          </motion.p>
          <motion.div className="mt-9 flex flex-wrap gap-3" {...enter(0.7)}>
            <Link href="#map" className="btn-gold">
              Explore the Map
            </Link>
            <Link href="/projects" className="btn-outline text-white hover:bg-white hover:text-navy-900">
              View Residences
            </Link>
          </motion.div>
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
