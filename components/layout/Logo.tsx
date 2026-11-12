import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" aria-label="Smart Coastal Assets home" className="group inline-flex flex-col leading-none">
      <span
        className={`font-display text-[1.35rem] tracking-[0.12em] uppercase sm:text-[1.55rem] ${
          light ? "text-white" : "text-navy-900"
        }`}
      >
        Smart Coastal Assets
      </span>
      <span
        className={`mt-1 text-[0.58rem] tracking-[0.32em] uppercase ${light ? "text-white/70" : "text-muted"}`}
      >
        Pinellas County · Florida
      </span>
    </Link>
  );
}
