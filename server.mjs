import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL(".", import.meta.url));
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const path = resolve(root, `.${pathname === "/" ? "/index.html" : pathname}`);
    if (!path.startsWith(root.endsWith(sep) ? root : root + sep) || !types[extname(path)] || /(^|\/)\./.test(pathname)) {
      response.writeHead(404).end("Not found"); return;
    }
    const body = await readFile(path);
    response.writeHead(200, { "Content-Type": `${types[extname(path)]}; charset=utf-8`, "X-Content-Type-Options": "nosniff" });
    response.end(body);
  } catch { response.writeHead(404).end("Not found"); }
}).listen(Number(process.env.PORT || 4173), "127.0.0.1", () => console.log("Curveball: http://localhost:4173"));
