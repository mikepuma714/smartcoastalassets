// Downloads every file from a public ("anyone with the link") Google Drive folder
// into assets-raw/<slug>/. Subfolders whose name contains "floor" go to
// assets-raw/<slug>/floorplans/.
//
// Usage:
//   node scripts/fetch-drive.mjs <slug> <folderUrlOrId> [nameFilter ...]
//
// nameFilter (optional) limits downloads to files whose name contains any of the
// given strings (case-insensitive). Useful for very large folders.

import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const [slug, folderArg, ...filters] = process.argv.slice(2);
if (!slug || !folderArg) {
  console.error("Usage: node scripts/fetch-drive.mjs <slug> <folderUrlOrId> [nameFilter ...]");
  process.exit(1);
}

const folderId = folderArg.match(/folders\/([\w-]+)/)?.[1] ?? folderArg;
const outRoot = path.join("assets-raw", slug);

async function listFolder(id) {
  const res = await fetch(`https://drive.google.com/embeddedfolderview?id=${id}`);
  if (!res.ok) throw new Error(`Could not list folder ${id}: ${res.status}`);
  const html = await res.text();
  const entries = [];
  const re = /href="(https:\/\/drive\.google\.com\/[^"]+)"[^>]*>[\s\S]*?<div class="flip-entry-title">([^<]+)</g;
  for (const m of html.matchAll(re)) {
    const url = m[1];
    const name = m[2].trim().replace(/&amp;/g, "&").replace(/&#39;/g, "'");
    const folder = url.match(/folders\/([\w-]+)/)?.[1];
    const file = url.match(/file\/d\/([\w-]+)/)?.[1];
    if (folder) entries.push({ type: "folder", id: folder, name });
    else if (file) entries.push({ type: "file", id: file, name });
  }
  return entries;
}

function matches(name) {
  if (filters.length === 0) return true;
  const lower = name.toLowerCase();
  return filters.some((f) => lower.includes(f.toLowerCase()));
}

async function download(id, dest) {
  try {
    await stat(dest);
    console.log(`  skip (exists) ${dest}`);
    return;
  } catch {}
  const url = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;
  const res = await fetch(url);
  const type = res.headers.get("content-type") ?? "";
  if (!res.ok || type.includes("text/html")) {
    throw new Error(`Download failed for ${dest} (${res.status} ${type})`);
  }
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  console.log(`  saved ${dest}`);
}

async function walk(id, dir, isFloorplans = false) {
  await mkdir(dir, { recursive: true });
  for (const entry of await listFolder(id)) {
    if (entry.type === "folder") {
      const floor = /floor/i.test(entry.name);
      await walk(entry.id, floor ? path.join(outRoot, "floorplans") : path.join(dir, entry.name), floor || isFloorplans);
    } else if (isFloorplans || matches(entry.name)) {
      await download(entry.id, path.join(dir, entry.name));
    }
  }
}

await walk(folderId, outRoot);
console.log("Done.");
