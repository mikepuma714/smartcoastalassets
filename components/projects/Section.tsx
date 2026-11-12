import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

export function Section({
  id,
  eyebrow,
  title,
  children,
  aside,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className={`scroll-mt-24 ${className}`}>
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 id={id ? `${id}-title` : undefined} className="mt-2 text-3xl tracking-[0.04em] uppercase sm:text-[2rem]">
              {title}
            </h2>
          </div>
          {aside}
        </div>
      </Reveal>
      <div className="mt-8">{children}</div>
    </section>
  );
}
