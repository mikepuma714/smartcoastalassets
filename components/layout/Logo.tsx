import Link from "next/link";

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link href="/" aria-label="Smart Coastal Assets home" className="group inline-flex shrink-0 flex-col leading-none">
      <span
        className={`font-display text-[1.05rem] tracking-[0.1em] whitespace-nowrap uppercase min-[400px]:text-[1.2rem] sm:text-[1.5rem] sm:tracking-[0.12em] ${
          light ? "text-white" : "text-navy-900"
        }`}
      >
        Smart Coastal Assets
      </span>
      <span
        className={`overflow-hidden text-[0.58rem] tracking-[0.32em] whitespace-nowrap uppercase transition-all duration-500 ease-luxe ${
          compact ? "mt-0 max-h-0 opacity-0" : "mt-1 max-h-4 opacity-100"
        } ${light ? "text-white/70" : "text-muted"}`}
      >
        Pinellas County · Florida
      </span>
    </Link>
  );
}
