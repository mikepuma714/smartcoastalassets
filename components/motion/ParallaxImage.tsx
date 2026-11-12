"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * Full-bleed image that drifts slower than the page as it scrolls past,
 * for the layered depth effect.
 */
export function ParallaxImage({
  src,
  alt,
  blurDataURL,
  strength = 18,
  priority = false,
  className = "",
  overlayClassName = "bg-gradient-to-b from-navy-950/30 via-navy-950/10 to-navy-950/70",
}: {
  src: string;
  alt: string;
  blurDataURL?: string;
  strength?: number;
  priority?: boolean;
  className?: string;
  overlayClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div className="absolute inset-x-0 -inset-y-[22%]" style={reduce ? undefined : { y }}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          quality={85}
          className="object-cover"
          {...(blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {})}
        />
      </motion.div>
      <div className={`absolute inset-0 ${overlayClassName}`} />
    </div>
  );
}
