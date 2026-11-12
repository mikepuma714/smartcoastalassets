import manifest from "@/content/image-manifest.json";

type Meta = { width: number; height: number; blurDataURL: string };

const entries = manifest as Record<string, Meta>;

export function imageMeta(src: string): Meta | undefined {
  return entries[src];
}

/** Props to spread on next/image for a soft blur-up while the photo loads. */
export function blurProps(src: string) {
  const meta = entries[src];
  return meta ? { placeholder: "blur" as const, blurDataURL: meta.blurDataURL } : {};
}
