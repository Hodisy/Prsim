import { join, normalize } from "node:path";

const root = import.meta.dir;
const entry = "prsim-wireframe-preview.html";

const server = Bun.serve({
  hostname: "localhost",
  port: 4173,
  async fetch(request) {
    const url = new URL(request.url);
    const requestedPath = decodeURIComponent(url.pathname).replace(/^\/+/, "") || entry;
    const relativePath = normalize(requestedPath);

    if (relativePath.startsWith("..")) {
      return new Response("Forbidden", { status: 403 });
    }

    const file = Bun.file(join(root, relativePath));
    if (!(await file.exists())) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(file, {
      headers: { "Cache-Control": "no-store" },
    });
  },
});

console.log(`PRSIM disponible sur ${server.url}`);
