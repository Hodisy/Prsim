import { readdir, mkdir, stat } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import { spawn } from "node:child_process";

const projectRoot = new URL("../", import.meta.url).pathname;
const assetsRoot = join(projectRoot, "assets");
const outputRoot = join(assetsRoot, "derivatives");
// Each practical display size has a high-density counterpart:
// 96/192 for thumbnails, 480/960 for mobile, 960/1920 for wide content,
// and 1280/2560 for full-width desktop imagery.
const widths = [96, 192, 480, 960, 1280, 1920, 2560];
const sourceExtensions = new Set([".png", ".jpg", ".jpeg", ".avif"]);

async function walk(folder) {
  const entries = await readdir(folder, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === "derivatives" || entry.name === "social") continue;
    const path = join(folder, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (sourceExtensions.has(extname(entry.name).toLowerCase())) files.push(path);
  }
  return files;
}

function outputPath(source, width) {
  const relativeSource = relative(assetsRoot, source);
  return join(outputRoot, relativeSource.slice(0, -extname(relativeSource).length) + `.w${width}.webp`);
}

function runMagick(source, destination, width) {
  return new Promise((resolve, reject) => {
    const child = spawn("magick", [
      source,
      "-auto-orient",
      "-resize", `${width}x`,
      "-strip",
      "-quality", "82",
      "-define", "webp:method=5",
      destination,
    ], { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`magick exited with ${code}`)));
  });
}

const sources = await walk(assetsRoot);
const jobs = [];
for (const source of sources) {
  const sourceStat = await stat(source);
  for (const width of widths) {
    const destination = outputPath(source, width);
    await mkdir(dirname(destination), { recursive: true });
    let current = false;
    try { current = (await stat(destination)).mtimeMs >= sourceStat.mtimeMs; }
    catch { /* Missing derivative. */ }
    if (!current) jobs.push({ source, destination, width });
  }
}

const concurrency = Math.max(1, Math.min(6, Number(process.env.PRSIM_IMAGE_JOBS || 6)));
let cursor = 0;
await Promise.all(Array.from({ length: concurrency }, async () => {
  while (cursor < jobs.length) {
    const job = jobs[cursor++];
    await runMagick(job.source, job.destination, job.width);
  }
}));

console.log(`Generated ${jobs.length} responsive image derivatives from ${sources.length} masters.`);
