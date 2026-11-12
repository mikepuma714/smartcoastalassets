// Next's bundler does not emit MapLibre's web worker, so serve it from /public.
import fs from "node:fs";
import path from "node:path";

const src = path.join("node_modules", "maplibre-gl", "dist", "maplibre-gl-worker.mjs");
const dest = path.join("public", "vendor", "maplibre-gl-worker.mjs");

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);
