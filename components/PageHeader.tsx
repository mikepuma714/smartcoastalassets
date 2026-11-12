import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header className="border-b border-sand-200 bg-sand-100 pt-32 pb-14 sm:pt-40 sm:pb-20">
      <div className="container-luxe">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-4 max-w-4xl text-5xl leading-[1] sm:text-7xl">{title}</h1>
        {children && <div className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">{children}</div>}
      </div>
    </header>
  );
}
