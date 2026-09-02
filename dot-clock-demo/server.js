import { join, normalize } from "node:path";

const root = import.meta.dir;
const port = Number(process.env.PORT || 4182);

const server = Bun.serve({
  hostname: "127.0.0.1",
  port,
  async fetch(request) {
    const path = normalize(decodeURIComponent(new URL(request.url).pathname).replace(/^\/+/, "") || "index.html");
    if (path.startsWith("..")) return new Response("Forbidden", { status: 403 });

    const file = Bun.file(join(root, path));
    if (!(await file.exists())) return new Response("Not found", { status: 404 });
    return new Response(file, { headers: { "Cache-Control": "no-store" } });
  },
});

console.log(`Dot Clock available at ${server.url}`);
