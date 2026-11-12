// Compresses raw photos from assets-raw/<slug>/ into web-ready WebP files in
// public/projects/<slug>/, and records size + blur placeholder for each image in
// content/image-manifest.json.
//
// Usage:
//   pnpm images            (all projects)
//   pnpm images <slug>     (one project)

import { readdir, mkdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const RAW = "assets-raw";
const OUT = path.join("public", "projects");
const MANIFEST = path.join("content", "image-manifest.json");
const MAX_WIDTH = 2400;
const QUALITY = 82;
const EXTENSIONS = new Set([".jpg", ".jpeg", ".jfif", ".png", ".webp", ".avif", ".heic", ".tif", ".tiff"]);

const only = process.argv[2];

function toSlug(value) {
  return value
    .toLowerCase()
    .replace(/[#&]/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function filesIn(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await filesIn(full)));
    else if (EXTENSIONS.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

let manifest = {};
try {
  manifest = JSON.parse(await readFile(MANIFEST, "utf8"));
} catch {}

const projects = only ? [only] : (await readdir(RAW, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);

for (const slug of projects) {
  const rawDir = path.join(RAW, slug);
  for (const file of await filesIn(rawDir)) {
    const rel = path.relative(rawDir, file);
    const parts = rel.split(path.sep);
    const isFloorplan = parts[0] === "floorplans";
    const base = toSlug(parts.slice(isFloorplan ? 1 : 0).join(" ").replace(/\.[^.]+$/, ""));
    const outDir = path.join(OUT, slug, isFloorplan ? "floorplans" : "");
    const outFile = path.join(outDir, `${base}.webp`);
    const publicPath = "/" + path.relative("public", outFile).split(path.sep).join("/");

    await mkdir(outDir, { recursive: true });
    const before = (await stat(file)).size;
    const image = sharp(file, { failOn: "none" }).rotate();
    const info = await image
      .clone()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(outFile);
    const blur = await image.clone().resize(16).webp({ quality: 40 }).toBuffer();

    manifest[publicPath] = {
      width: info.width,
      height: info.height,
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    };
    console.log(`${publicPath}  ${(before / 1024).toFixed(0)} KB -> ${(info.size / 1024).toFixed(0)} KB`);
  }
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await mkdir("content", { recursive: true });
await writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");
console.log(`Manifest written: ${MANIFEST} (${Object.keys(sorted).length} images)`);
