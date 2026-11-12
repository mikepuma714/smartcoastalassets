import { Plus } from "lucide-react";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-sand-200 border-y border-sand-200">
      {items.map((item) => (
        <details key={item.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
            <h3 className="font-sans text-base font-medium text-navy-900 sm:text-lg">{item.q}</h3>
            <Plus
              aria-hidden
              strokeWidth={1.25}
              className="mt-0.5 size-5 shrink-0 text-gold-500 transition-transform duration-300 group-open:rotate-45"
            />
          </summary>
          <p className="max-w-3xl pb-6 text-[0.95rem] leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
